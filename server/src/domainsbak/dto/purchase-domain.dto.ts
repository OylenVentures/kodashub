import {
  IsArray,
  IsBoolean,
  IsFQDN,
  IsOptional,
  ArrayMinSize,
  ArrayMaxSize,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PurchaseDomainDto {
  @ApiProperty({
    description: 'The domain name to purchase (e.g. example.com).',
    example: 'example.com',
  })
  @IsString()
  @IsFQDN({}, { message: 'A valid domain name is required (e.g. example.com)' })
  domainName: string;

  @ApiPropertyOptional({
    description:
      "The list of nameservers for the domain. Minimum 2, maximum 5. If not provided, the package's default nameservers will be used.",
    type: [String],
    example: ['ns1.example.com', 'ns2.example.com'],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2, { message: 'At least 2 nameservers are required' })
  @ArrayMaxSize(5, { message: 'No more than 5 nameservers are allowed' })
  @IsFQDN(
    {},
    { each: true, message: 'Each nameserver must be a valid hostname' },
  )
  nameservers?: string[];

  @ApiPropertyOptional({
    description:
      'Whether to enable auto-renewal for the domain. Defaults to true if not provided.',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  autoRenew?: boolean = true;

  @ApiPropertyOptional({
    description:
      'Whether to enable ID protection/privacy protection for the domain. Defaults to false if not provided.',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  idProtection?: boolean = false;
}
