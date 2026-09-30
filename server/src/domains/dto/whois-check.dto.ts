import { ApiProperty } from '@nestjs/swagger';
import { IsFQDN } from 'class-validator';

export class WhoisCheckDto {
  @ApiProperty({
    description:
      'The domain name to check for WHOIS information (e.g. example.com)',
    example: 'example.com',
  })
  @IsFQDN({}, { message: 'A valid domain name is required (e.g. example.com)' })
  domainName: string;
}
