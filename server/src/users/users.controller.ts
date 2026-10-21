import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { STAFF_ROLES } from '../common/enums/role.enum.js';
import { ListUserQueryDto } from './dto/list-user.dto.js';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

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
    summary: 'List users',
    description:
      'Returns a paginated list of users, optionally filtered by email or role. Only accessible to staff users.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the list of users',
    type: User,
    example: {
      data: [
        {
          id: '1234567890abcdef',
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      ],
      total: 10,
      page: 1,
      limit: 20,
    },
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden - the user does not have permission to view the list of users',
  })
  @UseGuards(RolesGuard)
  @Roles(...STAFF_ROLES)
  @Get()
  listUsers(@Query() query: ListUserQueryDto): Promise<PaginatedResult<User>> {
    return this.usersService.listUsers(query);
  }

  @ApiOperation({
    summary: 'Create a new user',
    description: 'Allows the admin user to create a new user.',
  })
  @ApiCreatedResponse({
    description: 'Successfully created a new user',
    type: User,
    example: {
      id: '1234567890abcdef',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden — the user does not have permission to create a new user',
  })
  @UseGuards(RolesGuard)
  @Roles(STAFF_ROLES.at(0)!) // Only allow the first role in STAFF_ROLES to create users
  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

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

  @ApiOperation({
    summary: 'View a user',
    description: 'Allows the operator user to view a user.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved a user',
    type: User,
    example: {
      id: '1234567890abcdef',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request',
  })
  @UseGuards(RolesGuard)
  @Roles(...STAFF_ROLES)
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @ApiOperation({
    summary: 'Update a user',
    description: 'Allows the admin user to update a user.',
  })
  @ApiOkResponse({
    description: 'Successfully updated a user',
    type: User,
    example: {
      id: '1234567890abcdef',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden — the user does not have permission to update a user',
  })
  @UseGuards(RolesGuard)
  @Roles(STAFF_ROLES.at(0)!) // Only allow the first role in STAFF_ROLES to update users
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @ApiOperation({
    summary: 'Delete a user',
    description: 'Allows the admin user to delete a user.',
  })
  @ApiOkResponse({
    description: 'Successfully deleted a user',
  })
  @ApiBadRequestResponse({
    description: 'Invalid request',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden — the user does not have permission to delete a user',
  })
  @UseGuards(RolesGuard)
  @Roles(STAFF_ROLES.at(0)!) // Only allow the first role in STAFF_ROLES to delete users
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
