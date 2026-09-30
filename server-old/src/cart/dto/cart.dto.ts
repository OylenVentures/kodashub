import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsObject } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    example: 'domain',
    description: 'Service type (domain, hosting, ssl, email, etc)',
  })
  @IsString()
  @IsNotEmpty()
  serviceType: string;

  @ApiProperty({ example: 14800.0, description: 'Total price for the service' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: {
      name: 'google.com',
      regPeriod: 1,
      nameservers: ['ns1.google.com', 'ns2.google.com'],
    },
    description: 'Service-specific metadata (structure depends on serviceType)',
  })
  @IsObject()
  @IsNotEmpty()
  metadata: Record<string, any>;
}

export class UpdateCartDto extends PartialType(CreateCartDto) {}
