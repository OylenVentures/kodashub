import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
  BadRequestException,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto, UpdateCartDto } from './dto/cart.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';

@ApiBearerAuth()
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseGuards(JwtGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Create Cart', description: 'Create a new cart' })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post()
  create(@Req() req: any, @Body() dto: CreateCartDto) {
    if (!req?.user?.id) {
      throw new UnauthorizedException('User not authorized');
    }

    return this.cartService.create(dto, req.user.id);
  }

  @ApiOperation({ summary: 'Get All Carts', description: 'Retrieve all carts' })
  @ApiOkResponse({ description: 'Ok' })
  @Get()
  findAll(@Req() req: any) {
    if (!req?.user?.id) {
      throw new BadRequestException('User ID is required');
    }
    return this.cartService.findAll(req?.user?.id);
  }

  @ApiOperation({ summary: 'Get Cart', description: 'Retrieve a cart by ID' })
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('ID parameter is required');
    }

    return this.cartService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Cart', description: 'Update a cart by ID' })
  @ApiOkResponse({ description: 'Updated' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateCartDto) {
    if (!id) {
      throw new BadRequestException('ID parameter is required');
    }
    if (!req?.user?.id) {
      throw new UnauthorizedException('User not authorized');
    }

    return this.cartService.update(id, req.user.id, dto);
  }

  @ApiOperation({ summary: 'Delete Cart', description: 'Delete a cart by ID' })
  @ApiOkResponse({ description: 'Deleted' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Req() req: any, @Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('ID parameter is required');
    }
    if (!req?.user?.id) {
      throw new UnauthorizedException('User not authorized');
    }

    return this.cartService.remove(id, req.user.id);
  }
}
