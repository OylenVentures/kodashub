import { HttpException, HttpStatus } from '@nestjs/common';

/** Thrown when Blesta itself returns a 4xx (bad input, e.g. domain already exists as a service). */
export class BlestaValidationException extends HttpException {
  constructor(message: string, errors?: Record<string, unknown>) {
    super({ message, errors }, HttpStatus.BAD_REQUEST);
  }
}

/** Thrown when Blesta is unreachable, times out, or returns a 5xx — an upstream failure, not the caller's fault. */
export class BlestaUnavailableException extends HttpException {
  constructor(message = 'The domain platform is temporarily unavailable. Please try again shortly.') {
    super(message, HttpStatus.BAD_GATEWAY);
  }
}

/** Thrown for capabilities that depend on a specific registrar module/plugin not being configured. */
export class BlestaCapabilityNotConfiguredException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_IMPLEMENTED);
  }
}
