import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RegistrarUnavailableException,
  RegistrarValidationException,
} from '../registrar.exceptions.js';

const REQUEST_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 2;

/**
 * Thin wrapper around ResellerClub's (LogicBoxes) HTTP API.
 * https://manage.resellerclub.com/kb/servlet/KBServlet/cat-140.html
 *
 * Auth: auth-userid + api-key as query/body params (not headers).
 * Base URL: https://httpapi.com/api/ (live) or https://test.httpapi.com/api/ (test/sandbox).
 * Endpoints are POSTed as form-encoded, array params repeated (ns=ns1.x.com&ns=ns2.x.com).
 */
@Injectable()
export class ResellerClubHttpClient {
  private readonly logger = new Logger(ResellerClubHttpClient.name);
  private readonly baseUrl: string;
  private readonly authUserId: string;
  private readonly apiKey: string;

  constructor(private config: ConfigService) {
    const testMode =
      this.config.get<string>('RESELLERCLUB_TEST_MODE') === 'true';
    this.baseUrl = testMode
      ? 'https://test.httpapi.com/api'
      : 'https://httpapi.com/api';
    this.authUserId = this.config.get<string>('RESELLERCLUB_USER_ID') ?? '';
    this.apiKey = this.config.get<string>('RESELLERCLUB_API_KEY') ?? '';

    if (!this.authUserId || !this.apiKey) {
      this.logger.warn(
        'RESELLERCLUB_USER_ID / RESELLERCLUB_API_KEY are not configured.',
      );
    }
  }

  /** @param path e.g. "domains/available.json", "dns/manage/add-cname-record.json" */
  async call<T>(
    path: string,
    params: Record<string, unknown> = {},
  ): Promise<T> {
    const url = `${this.baseUrl}/${path}`;
    const body = this.toFormBody({
      'auth-userid': this.authUserId,
      'api-key': this.apiKey,
      ...params,
    });

    let lastError: unknown;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(`${url}?${body}`, {
          signal: controller.signal,
        });
        clearTimeout(timeout);

        const text = await response.text();
        const json = this.safeJsonParse(text);

        if (response.status >= 500) {
          throw new Error(`ResellerClub returned ${response.status}`);
        }

        // ResellerClub signals errors two ways depending on endpoint:
        // an HTTP 4xx, OR a 200 body containing status:"ERROR" / status:"Failed".
        const status = (json as any)?.status;
        if (!response.ok || status === 'ERROR' || status === 'Failed') {
          throw new RegistrarValidationException(
            (json as any)?.message ??
              (json as any)?.error ??
              `ResellerClub rejected the request`,
            json,
          );
        }

        return json as T;
      } catch (err) {
        clearTimeout(timeout);

        if (err instanceof RegistrarValidationException) throw err;

        lastError = err;
        if (attempt < MAX_RETRIES) {
          await this.sleep(300 * Math.pow(2, attempt));
          continue;
        }
      }
    }

    this.logger.error(
      `ResellerClub call failed after retries: ${path} — ${(lastError as Error)?.message}`,
    );
    throw new RegistrarUnavailableException('ResellerClub');
  }

  private toFormBody(params: Record<string, unknown>): string {
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        value.forEach((v) => usp.append(key, String(v)));
      } else {
        usp.append(key, String(value));
      }
    });
    return usp.toString();
  }

  private safeJsonParse(text: string): unknown {
    try {
      return JSON.parse(text);
    } catch {
      return { message: text };
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
