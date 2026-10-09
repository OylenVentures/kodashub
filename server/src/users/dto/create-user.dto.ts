import { ApiPropertyOptional } from '@nestjs/swagger';
import { RegisterDto } from '../../auth/dto/register.dto.js';
import { UserRole } from '../../common/enums/role.enum.js';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateUserDto extends RegisterDto {
  @ApiPropertyOptional({
    description: 'The role of the new user',
    enum: UserRole,
    example: UserRole.SUPPORT_AGENT,
  })
  @IsNotEmpty()
  @IsEnum(UserRole, {
    message: `role must be one of the following values: ${Object.values(
      UserRole,
    ).join(', ')}`,
  })
  role?: UserRole;
}
