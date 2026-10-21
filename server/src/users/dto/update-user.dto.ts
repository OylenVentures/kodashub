import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto.js';
import { UserStatus } from '../../common/enums/user-status.enum.js';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'The status of the user',
    enum: UserStatus,
    example: UserStatus.SUSPENDED,
  })
  @IsOptional()
  @IsEnum(UserStatus, {
    message: `status must be one of the following values: ${Object.values(
      UserStatus,
    ).join(', ')}`,
  })
  status?: string;
}
