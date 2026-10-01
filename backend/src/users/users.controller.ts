import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

// No @Public() here — the global JwtAuthGuard protects everything in this controller.
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized access — valid access token required',
})
@ApiInternalServerErrorResponse({
  description: 'Internal server error occurred while processing the request',
})
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: 'View my profile',
    description: 'Returns the profile information of the logged-in user.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the user profile',
    type: User,
    example: {
      id: '1234567890abcdef',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
    },
  })
  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @ApiOperation({
    summary: 'Update my profile',
    description:
      'Allows the logged-in user to update their profile information.',
  })
  @ApiOkResponse({
    description: 'Successfully updated the user profile',
    type: User,
    example: {
      id: '1234567890abcdef',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
    },
  })
  @ApiBadRequestResponse({
    description:
      'Invalid input data — the request body does not meet the required validation criteria',
  })
  @Patch('me')
  @HttpCode(HttpStatus.OK)
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(userId, dto);
  }
}
