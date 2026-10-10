import { randomBytes } from 'crypto';

export class Otp {
  generateOTP() {
    const token = randomBytes(6).toString('hex');
    const expiration = new Date(new Date().getTime() + 600000); // 10 minutes
    return { token, expiration };
  }
}
