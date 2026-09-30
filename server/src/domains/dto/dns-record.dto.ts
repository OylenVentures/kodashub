import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import type { DnsRecordType } from '../registrars/interfaces/registrar-provider.interface.js';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const RECORD_TYPES: DnsRecordType[] = [
  'A',
  'AAAA',
  'CNAME',
  'MX',
  'TXT',
  'NS',
  'SRV',
];

export class CreateDnsRecordDto {
  @ApiProperty({
    description: 'The type of DNS record (e.g. A, CNAME, MX, etc.)',
    enum: RECORD_TYPES,
  })
  @IsString()
  @IsIn(RECORD_TYPES)
  type: DnsRecordType;

  @ApiProperty({
    description: 'The name of the DNS record (e.g. "www" or "@")',
  })
  @IsString()
  name: string; // e.g. "www" or "@"

  @ApiProperty({
    description:
      'The value of the DNS record (e.g. "192.168.1.1" or "example.com")',
  })
  @IsString()
  value: string;

  @ApiPropertyOptional({
    description: 'The TTL of the DNS record (e.g. 3600)',
    type: 'integer',
    minimum: 60,
    maximum: 86400,
  })
  @IsOptional()
  @IsInt()
  @Min(60)
  @Max(86400)
  @Type(() => Number)
  ttl?: number;

  @ApiPropertyOptional({
    description: 'The priority of the DNS record (e.g. 10 for MX records)',
    type: 'integer',
    minimum: 0,
    maximum: 65535,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(65535)
  @Type(() => Number)
  priority?: number; // required in practice for MX/SRV - validated in service layer
}

export class UpdateDnsRecordDto extends CreateDnsRecordDto {
  @ApiPropertyOptional({
    description: 'The ID of the DNS record (e.g. "12345")',
  })
  @IsOptional()
  @IsString()
  id?: string; // the registrar's record id - required by most providers to identify the record being changed
}

export class DeleteDnsRecordDto {
  @ApiProperty({
    description: 'The type of DNS record to delete (e.g. A, CNAME, MX, etc.)',
    enum: RECORD_TYPES,
  })
  @IsIn(RECORD_TYPES)
  type: DnsRecordType;

  @ApiPropertyOptional({
    description: 'The name of the DNS record to delete (e.g. "www" or "@")',
  })
  @IsOptional()
  @IsString()
  value?: string; // some registrars (e.g. ResellerClub) want the current value as a confirmation check on delete
}
