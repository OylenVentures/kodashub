import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class VoltCalcToolDto {
  @ApiProperty({
    example: 9.26,
    description: 'Previous meter reading',
  })
  @IsNotEmpty()
  @IsNumber()
  previousReading: number;

  @ApiProperty({
    example: 20.04,
    description: 'Current meter reading',
  })
  @IsNotEmpty()
  @IsNumber()
  currentReading: number;

  @ApiProperty({
    example: 'Band A',
    description: 'Tariff band',
  })
  @IsNotEmpty()
  @IsString()
  tariffBand: string;
}

export class StorageSyncDto {
  @ApiProperty({
    example: 'image',
    description: 'File type (image, video or raw)',
  })
  @IsNotEmpty()
  @IsString()
  fileType: string;

  @ApiProperty({
    example: 'dqzjyhmel',
    description: 'Previous storage name',
  })
  @IsNotEmpty()
  @IsString()
  prevStorageName: string;

  @ApiProperty({
    example: 'BKIAWPXO3YSOAHMT7IUM',
    description: 'Previous storage api key',
  })
  @IsNotEmpty()
  @IsString()
  prevApiKey: string;

  @ApiProperty({
    example: '68L-ghe0sa75bwlCPnujICghzKc',
    description: 'Previous storage secret key',
  })
  @IsNotEmpty()
  @IsString()
  prevSecretKey: string;

  @ApiPropertyOptional({
    example: 'eu-west-2',
    description: 'Previous storage region (Optional)',
  })
  @IsOptional()
  @IsString()
  prevRegion?: string;

  @ApiPropertyOptional({
    example: '1234567890',
    description: 'Previous storage account id (Optional)',
  })
  @IsOptional()
  @IsString()
  prevAccountId?: string;

  @ApiProperty({
    example: 'dqzjyhmel',
    description: 'Current storage name',
  })
  @IsNotEmpty()
  @IsString()
  newStorageName: string;

  @ApiProperty({
    example: 'BKIAWPXO3YSOAHMT7IUM',
    description: 'Current storage api key',
  })
  @IsNotEmpty()
  @IsString()
  newApiKey: string;

  @ApiProperty({
    example: '68L-ghe0sa75bwlCPnujICghzKc',
    description: 'Current storage secret key',
  })
  @IsNotEmpty()
  @IsString()
  newSecretKey: string;

  @ApiPropertyOptional({
    example: 'eu-west-2',
    description: 'Current storage region (Optional)',
  })
  @IsOptional()
  @IsString()
  newRegion?: string;

  @ApiPropertyOptional({
    example: '1234567890',
    description: 'Current storage account id (Optional)',
  })
  @IsOptional()
  @IsString()
  newAccountId?: string;
}
