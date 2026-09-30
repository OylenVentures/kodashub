import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BlestaUnavailableException,
  BlestaValidationException,
} from './blesta.exceptions.js';
import { BlestaErrorResponse } from './interfaces/blesta-api.interface.js';

const REQUEST_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 2; // only for network errors / 5xx — never retries a 4xx

/**
 * Thin, generic wrapper around Blesta's REST API.
 *
 * Blesta's API is structured as: {baseUrl}/{model}/{method}.{format}
 * authenticated with HTTP Basic Auth (API username + API key, created under
 * Blesta admin: Settings > Company > API Access). Requests are sent as
 * application/x-www-form-urlencoded (GET query string or POST body depending
 * on method semantics — Blesta itself infers this from the underlying model
 * method's expected HTTP verb, so we simply forward params as a POST body,
 * which Blesta accepts for all model methods).
 *
 * This class only knows how to *call* Blesta — it has no domain-specific
 * knowledge. DomainsService builds on top of it.
 */
@Injectable()
export class BlestaApiService {
  private readonly logger = new Logger(BlestaApiService.name);
  private readonly baseUrl: string;
  private readonly username: string;
  private readonly key: string;

  constructor(private config: ConfigService) {
    this.baseUrl = this.trimTrailingSlash(
      this.config.get<string>('BLESTA_API_URL') ?? '',
    );
    this.username = this.config.get<string>('BLESTA_API_USER') ?? '';
    this.key = this.config.get<string>('BLESTA_API_KEY') ?? '';

    if (!this.baseUrl || !this.username || !this.key) {
      this.logger.warn(
        'BLESTA_API_URL / BLESTA_API_USER / BLESTA_API_KEY are not fully configured — Blesta calls will fail.',
      );
    }
  }

  /**
   * Calls {model}/{method}.json on the Blesta API.
   * @param model e.g. "clients", "services", "packages". Use "plugin_name.model" for plugin models.
   * @param method e.g. "add", "edit", "get", "getAll"
   * @param params request parameters — sent as a form-encoded body
   */
  async call<T>(
    model: string,
    method: string,
    params: Record<string, unknown> = {},
  ): Promise<T> {
    const url = `${this.baseUrl}/${model}/${method}.json`;
    const body = this.toFormBody(params);
    const authHeader =
      'Basic ' + Buffer.from(`${this.username}:${this.key}`).toString('base64');

    let lastError: unknown;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
          body,
          signal: controller.signal,
        });

        clearTimeout(timeout);

        const text = await response.text();
        const json = text ? this.safeJsonParse(text) : {};

        if (response.status === 400 || response.status === 403) {
          const err = json as BlestaErrorResponse;
          throw new BlestaValidationException(
            err.message ?? 'The domain platform rejected this request',
            err.errors,
          );
        }

        if (response.status === 401) {
          this.logger.error('Blesta API rejected our credentials (401)');
          throw new BlestaUnavailableException(
            'Domain platform authentication failed',
          );
        }

        if (response.status >= 500) {
          throw new Error(`Blesta returned ${response.status}`);
        }

        if (!response.ok) {
          throw new BlestaValidationException(
            (json as BlestaErrorResponse).message ??
              `Unexpected response (${response.status})`,
          );
        }

        return json as T;
      } catch (err) {
        clearTimeout(timeout);

        // Don't retry validation errors — the request itself is wrong.
        if (err instanceof BlestaValidationException) throw err;
        if (err instanceof BlestaUnavailableException) throw err;

        lastError = err;
        if (attempt < MAX_RETRIES) {
          await this.sleep(300 * Math.pow(2, attempt)); // backoff: 300ms, 600ms
          continue;
        }
      }
    }

    this.logger.error(
      `Blesta API call failed after ${MAX_RETRIES + 1} attempts: ${model}/${method} — ${
        (lastError as Error)?.message
      }`,
    );
    throw new BlestaUnavailableException();
  }

  private toFormBody(params: Record<string, unknown>): string {
    const usp = new URLSearchParams();
    this.flatten(params).forEach(([key, value]) => usp.append(key, value));
    return usp.toString();
  }

  /** Flattens nested objects/arrays into Blesta/PHP-style bracket notation, e.g. meta[ns1]=..., pid[]=... */
  private flatten(obj: unknown, prefix = ''): Array<[string, string]> {
    const entries: Array<[string, string]> = [];

    if (Array.isArray(obj)) {
      obj.forEach((value, index) => {
        entries.push(...this.flatten(value, `${prefix}[${index}]`));
      });
    } else if (obj !== null && typeof obj === 'object') {
      Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
        entries.push(
          ...this.flatten(value, prefix ? `${prefix}[${key}]` : key),
        );
      });
    } else if (obj !== undefined && obj !== null) {
      entries.push([prefix, String(obj)]);
    }

    return entries;
  }

  private safeJsonParse(text: string): unknown {
    try {
      return JSON.parse(text);
    } catch {
      return { message: text };
    }
  }

  private trimTrailingSlash(url: string): string {
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
