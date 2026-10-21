import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { UserRole } from '../../common/enums/role.enum.js';

export class ListUserQueryDto {
  @ApiPropertyOptional({ description: 'Filter users by email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Filter users by role', enum: UserRole })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    default: 1,
  })
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of users per page', default: 20 })
  @IsNumber()
  limit?: number = 20;
}
