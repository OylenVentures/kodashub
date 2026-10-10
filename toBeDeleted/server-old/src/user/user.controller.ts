import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateAdminDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto/user.dto';
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
import { JwtGuard } from '../auth/jwt.guard';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'You are not logged in' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Create admin',
    description: 'Create admin user (super admin only)',
  })
  @ApiCreatedResponse({ description: 'Admin created successfully' })
  @ApiBadRequestResponse({ description: 'Bad request sent' })
  @ApiForbiddenResponse({
    description: 'You are not authorized to create admin',
  })
  @Post()
  createAdmin(@Body() dto: CreateAdminDto, @Req() req: any) {
    if (req.user.role !== 'super_admin') {
      throw new ForbiddenException('You are not authorized to create admin');
    }
    return this.userService.createAdmin(dto);
  }

  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users (admin only)',
  })
  @ApiOkResponse({ description: 'Users retrieved successfully' })
  @ApiForbiddenResponse({
    description: 'You are not authorized to view all user',
  })
  @Get()
  findAll(@Req() req: any) {
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
      throw new ForbiddenException('You are not authorized to view all user');
    }
    return this.userService.findAll();
  }

  @ApiOperation({
    summary: 'Get current user',
    description: 'Get current user',
  })
  @ApiOkResponse({ description: 'User retrieved successfully' })
  @Get('me')
  findMe(@Req() req: any) {
    return this.userService.findMe(req.user.id);
  }

  @ApiOperation({ summary: 'Get user by id', description: 'Get user by id' })
  @ApiOkResponse({ description: 'User retrieved successfully' })
  @ApiBadRequestResponse({ description: 'Bad request sent' })
  @ApiForbiddenResponse({ description: 'You are not authorized to view user' })
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
      throw new ForbiddenException('You are not authorized to view all user');
    }
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Update user', description: 'Update user' })
  @ApiOkResponse({ description: 'User updated successfully' })
  @ApiBadRequestResponse({ description: 'Bad request sent' })
  @Patch('me')
  updateUser(@Body() dto: UpdateUserDto, @Req() req: any) {
    return this.userService.updateUser(req.user.id, dto, req);
  }

  @ApiOperation({ summary: 'Update password', description: 'Update password' })
  @ApiOkResponse({ description: 'Password updated successfully' })
  @ApiBadRequestResponse({ description: 'Bad request sent' })
  @Patch('me/password')
  updatePassword(@Req() req: any, @Body() dto: UpdatePasswordDto) {
    return this.userService.updatePassword(req.user.id, dto, req);
  }

  @ApiOperation({
    summary: 'Soft delete user',
    description: 'Soft delete user',
  })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiBadRequestResponse({ description: 'Bad request sent' })
  @Delete('me')
  softDelete(@Req() req: any) {
    return this.userService.softDelete(req.user.id, req);
  }

  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete user (admin only)',
  })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiBadRequestResponse({ description: 'Bad request sent' })
  @ApiForbiddenResponse({
    description: 'You are not authorized to delete user',
  })
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any) {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      throw new ForbiddenException('You are not authorized to delete user');
    }
    return this.userService.delete(id);
  }

  @ApiOperation({
    summary: 'Restore user',
    description: 'Restore user (admin only)',
  })
  @ApiOkResponse({ description: 'User restored successfully' })
  @ApiBadRequestResponse({ description: 'Bad request sent' })
  @ApiForbiddenResponse({
    description: 'You are not authorized to restore user',
  })
  @Patch(':id')
  restore(@Param('id') id: string, @Req() req: any) {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      throw new ForbiddenException('You are not authorized to restore user');
    }
    return this.userService.restore(id);
  }
}
