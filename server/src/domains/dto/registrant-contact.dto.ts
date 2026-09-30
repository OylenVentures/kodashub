import { IsEmail, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';

/**
 * Required for domain registration/transfer regardless of registrar — this
 * is WHOIS/registrant contact data mandated by ICANN and local registries,
 * not something we can default or omit.
 */
export class RegistrantContactDto {
  @IsString()
  @MaxLength(200)
  fullName: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @Matches(/^\d{1,4}$/, { message: 'Phone country code should be digits only, e.g. "234"' })
  phoneCountryCode: string;

  @IsString()
  @Matches(/^\d{4,14}$/, { message: 'Phone number should be digits only, no spaces or symbols' })
  phone: string;

  @IsString()
  @MaxLength(255)
  addressLine1: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressLine2?: string;

  @IsString()
  @MaxLength(100)
  city: string;

  @IsString()
  @MaxLength(100)
  state: string;

  @IsString()
  @Length(2, 2, { message: 'Country must be a 2-letter ISO code, e.g. "NG"' })
  country: string;

  @IsString()
  @MaxLength(20)
  zipCode: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  company?: string;
}
