import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class SearchDomainDto {
  @ApiProperty({
    description: 'The domain name to search for availability (without TLD).',
    example: 'myawesomebrand',
  })
  @IsString()
  @Matches(/^[a-z0-9-]{1,63}$/i, {
    message:
      'Search term must be a valid domain label (letters, numbers, hyphens)',
  })
  query: string; // e.g. "myawesomebrand" — checked against each TLD below

  @ApiPropertyOptional({
    description:
      'Optional list of TLDs to check availability for. If omitted, all configured/offered TLDs will be checked.',
    type: [String],
    example: ['com', 'net', 'io'],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  tlds?: string[]; // defaults to all configured/offered TLDs if omitted
}
