import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLogDto {
  @ApiProperty({ example: 'User created', description: 'Action performed' })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({
    example: 'User created',
    description: 'Description of the action',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
