import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CheckDomainDto {
  @ApiProperty({ description: 'Domain name to check', example: 'google' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Domain tld to check', example: '.com' })
  @IsString()
  @IsNotEmpty()
  tld: string;
}

export class SearchDomainDto {
  @ApiProperty({ description: 'Domain name to search', example: 'google.com' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class OrderDomainDto extends SearchDomainDto {
  @ApiProperty({ description: 'Domain registration period', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  regPeriod: number;

  @ApiProperty({ description: 'Domain price', example: 14800.0 })
  @IsDecimal()
  @IsNotEmpty()
  price: number;
}

export class UpdateNameserverDto {
  @ApiProperty({
    description: 'Domain ID',
    example: '6ebac467-7340-45f3-90fc-9f59eb0c217a',
  })
  @IsString()
  @IsNotEmpty()
  domainId: string;

  @ApiProperty({ description: 'Nameserver 1', example: 'ns1.google.com' })
  @IsString()
  @IsNotEmpty()
  nameserver1: string;

  @ApiProperty({ description: 'Nameserver 2', example: 'ns2.google.com' })
  @IsString()
  @IsNotEmpty()
  nameserver2: string;

  @ApiPropertyOptional({
    description: 'Nameserver 3',
    example: 'ns3.google.com',
  })
  @IsString()
  @IsOptional()
  nameserver3?: string;

  @ApiPropertyOptional({
    description: 'Nameserver 4',
    example: 'ns4.google.com',
  })
  @IsString()
  @IsOptional()
  nameserver4?: string;
}

export class UpdateContactDetailsDto {
  @ApiProperty({
    description: 'Domain ID',
    example: '6ebac467-7340-45f3-90fc-9f59eb0c217a',
  })
  @IsString()
  @IsNotEmpty()
  domainId: string;

  @ApiProperty({ description: 'First Name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last Name', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Company Name', example: 'Kodashub' })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ description: 'Email', example: 'jd@xample.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Address', example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'City', example: 'Ketu' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'State', example: 'Lagos' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: 'Zip Code', example: '12345' })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty({ description: 'Country', example: 'NG' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ description: 'Phone Number', example: '+2348034567890' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class UpdateDomainStatusDto {
  @ApiProperty({
    description: 'Domain ID',
    example: '6ebac467-7340-45f3-90fc-9f59eb0c217a',
  })
  @IsString()
  @IsNotEmpty()
  domainId: string;

  @ApiProperty({ description: 'Domain status', example: 'grace' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({
    description: 'Domain expiry date',
    example: '2026-12-31',
  })
  @IsDate()
  @IsOptional()
  expiryDate?: Date;
}
