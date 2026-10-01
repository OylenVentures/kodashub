import {
  IsBoolean,
  IsFQDN,
  IsInt,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RegistrantContactDto } from './registrant-contact.dto.js';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NameserversDto } from './nameservers.dto.js';

export class PurchaseDomainDto extends NameserversDto {
  @ApiProperty({
    description: 'The domain name to be purchased (e.g. example.com)',
  })
  @IsFQDN({}, { message: 'A valid domain name is required (e.g. example.com)' })
  domainName: string;

  @ApiProperty({
    description: 'The number of years to register the domain for (1-10)',
    type: 'integer',
    minimum: 1,
    maximum: 10,
  })
  @IsInt()
  @Min(1)
  @Max(10)
  years: number;

  @ApiProperty({
    description: 'The registrant contact information for the domain',
    type: RegistrantContactDto,
  })
  @ValidateNested()
  @Type(() => RegistrantContactDto)
  registrant: RegistrantContactDto;

  @ApiPropertyOptional({
    description:
      'Whether to enable auto-renewal for the domain. Defaults to true.',
    type: 'boolean',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  autoRenew?: boolean = true;

  @ApiPropertyOptional({
    description:
      'Whether to enable ID protection for the domain. Defaults to false.',
    type: 'boolean',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  idProtection?: boolean = false;
}
