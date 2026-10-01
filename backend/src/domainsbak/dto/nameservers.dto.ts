import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsFQDN } from 'class-validator';

export class NameserversDto {
  @ApiProperty({
    description:
      'The list of nameservers for the domain. Minimum 2, maximum 5.',
    type: [String],
    example: ['ns1.example.com', 'ns2.example.com'],
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
