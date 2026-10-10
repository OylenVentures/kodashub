import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    example: 'card',
    description:
      'The payment method must be either card, bank_transfer, apple_pay, ussd, or qr',
  })
  @IsNotEmpty()
  @IsEnum(['card', 'bank_transfer', 'apple_pay', 'ussd', 'qr'])
  method: 'card' | 'bank_transfer' | 'apple_pay' | 'ussd' | 'qr';
}

export class VerifyPaymentDto {
  @ApiProperty({
    example: 'pay_xyz123',
    description: 'Paystack transaction reference to verify',
  })
  @IsNotEmpty()
  @IsString()
  transactionRef: string;
}
