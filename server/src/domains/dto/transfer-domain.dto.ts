import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsFQDN,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RegistrantContactDto } from './registrant-contact.dto.js';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WhoisCheckDto } from './whois-check.dto.js';

export class TransferDomainDto extends WhoisCheckDto {
  @ApiProperty({
    description:
      'The EPP/auth code required for transferring the domain. This is usually provided by the current registrar.',
  })
  @IsString()
  @MinLength(4, { message: 'EPP/auth code looks too short - double check it' })
  eppCode: string;

  @ApiProperty({
    description: 'The registrant contact information for the domain',
    type: RegistrantContactDto,
  })
  @ValidateNested()
  @Type(() => RegistrantContactDto)
  registrant: RegistrantContactDto;

  @ApiPropertyOptional({
    description:
      'The list of nameservers to be set for the domain after transfer. Must be valid FQDNs. If not provided, the current nameservers will be retained.',
    type: 'array',
    items: { type: 'string' },
    minItems: 2,
    maxItems: 5,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(5)
  @IsFQDN({}, { each: true })
  nameservers?: string[];
}
