import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsFQDN } from 'class-validator';

export class NameserversDto {
  @ApiProperty({
    description:
      'An array of nameservers for the domain. Each nameserver must be a valid hostname.',
    type: 'array',
    items: { type: 'string' },
    minItems: 2,
    maxItems: 5,
  })
  @IsArray()
  @ArrayMinSize(2, { message: 'At least 2 nameservers are required' })
  @ArrayMaxSize(5)
  @IsFQDN(
    {},
    { each: true, message: 'Each nameserver must be a valid hostname' },
  )
  nameservers: string[];
}
