import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchDomainDto {
  @ApiProperty({
    description: 'The search term for the domain (e.g. "myawesomebrand")',
    example: 'myawesomebrand',
  })
  @IsString()
  @Matches(/^[a-z0-9-]{1,63}$/i, {
    message:
      'Search term must be a valid domain label (letters, numbers, hyphens)',
  })
  query: string; // e.g. "myawesomebrand" - checked against each TLD below

  @ApiProperty({
    description:
      'The list of TLDs to search for the domain (e.g. ["com", "ng", "io"])',
    type: 'array',
    items: {
      type: 'string',
    },
    example: ['com', 'ng', 'io'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  tlds: string[]; // e.g. ["com","ng","io"] - each routed to the registrar configured for that TLD
}
