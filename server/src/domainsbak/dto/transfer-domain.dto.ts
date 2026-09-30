import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsFQDN,
  IsOptional,
  IsString,
  MinLength,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';

export class TransferDomainDto {
  @ApiProperty({
    description: 'The domain name to transfer (e.g. example.com)',
    example: 'example.com',
  })
  @IsString()
  @MinLength(3, { message: 'Domain name looks too short — double check it' })
  @IsFQDN({}, { message: 'A valid domain name is required (e.g. example.com)' })
  domainName: string;

  @ApiProperty({
    description: 'The EPP/auth code for the domain transfer.',
    example: '1234567890abcdef',
  })
  @IsString()
  @MinLength(4, { message: 'EPP/auth code looks too short — double check it' })
  eppCode: string;

  @ApiPropertyOptional({
    description:
      'The list of nameservers for the domain. Minimum 2, maximum 5. If not provided, the current nameservers will be used.',
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
}
