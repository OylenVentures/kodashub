import { HttpException, HttpStatus } from '@nestjs/common';

/** The registrar rejected the request as invalid (bad input, domain taken, insufficient funds, etc). */
export class RegistrarValidationException extends HttpException {
  constructor(message: string, details?: unknown) {
    super({ message, details }, HttpStatus.BAD_REQUEST);
  }
}

/** The registrar is unreachable, timed out, or returned a server error. */
export class RegistrarUnavailableException extends HttpException {
  constructor(registrarName: string, message?: string) {
    super(
      message ?? `${registrarName} is temporarily unavailable. Please try again shortly.`,
      HttpStatus.BAD_GATEWAY,
    );
  }
}

/** No registrar is configured to sell/manage the given TLD. */
export class UnsupportedTldException extends HttpException {
  constructor(tld: string) {
    super(`The .${tld} TLD is not currently supported`, HttpStatus.BAD_REQUEST);
  }
}
