import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import type { DnsRecordType } from '../blesta/interfaces/dns-provider.interface.js';
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
    description: 'The type of the DNS record.',
    enum: RECORD_TYPES,
  })
  @IsString()
  @Type(() => String)
  @IsIn(RECORD_TYPES)
  type: DnsRecordType;

  @ApiProperty({
    description: 'The name of the DNS record. Use "@" for the root domain.',
    example: 'www',
  })
  @IsString()
  name: string; // e.g. "www" or "@"

  @ApiProperty({
    description: 'The value of the DNS record.',
    example: '192.168.1.1',
  })
  @IsString()
  value: string;

  @ApiPropertyOptional({
    description:
      'The TTL (Time To Live) of the DNS record in seconds. Minimum is 60, maximum is 86400.',
    minimum: 60,
    maximum: 86_400,
  })
  @IsOptional()
  @IsInt()
  @Min(60)
  @Max(86_400)
  @Type(() => Number)
  ttl?: number;

  @ApiPropertyOptional({
    description:
      'The priority of the DNS record. Required for MX and SRV records. Minimum is 0, maximum is 65535.',
    minimum: 0,
    maximum: 65_535,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(65_535)
  @Type(() => Number)
  priority?: number; // required in practice for MX/SRV — validated in service layer
}

export class UpdateDnsRecordDto extends CreateDnsRecordDto {}
