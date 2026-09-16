import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto, UpdateCartDto } from './dto/cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { User } from './../user/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateCartDto, userId: string) {
    if (!userId) throw new BadRequestException('User id is required');

    const profile = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (
      !profile?.companyName ||
      !profile?.address ||
      !profile?.phoneNumber ||
      !profile?.city ||
      !profile?.state ||
      !profile?.country ||
      !profile?.zipCode
    ) {
      throw new BadRequestException(
        'Profile is incomplete, update your account',
      );
    }

    const newCart = this.cartRepo.create({
      ...dto,
      price: Math.round(
        dto?.metadata?.regPeriod
          ? dto?.metadata.regPeriod * dto.price
          : dto.price,
      ),
      user: { id: userId },
    });
    const result = await this.cartRepo.save(newCart);
    return { message: 'Cart created successfully', result };
  }

  async findAll(userId: string) {
    if (!userId) throw new BadRequestException('User id is required');

    const result = await this.cartRepo.find({
      where: { user: { id: userId } },
    });
    return {
      message: 'Carts fetched successfully',
      result,
    };
  }

  async findOne(id: string) {
    if (!id) throw new BadRequestException('Cart id is required');

    const existingCart = await this.cartRepo.findOne({
      where: { id },
    });
    if (!existingCart) {
      throw new NotFoundException('Cart not found');
    }

    return { message: 'Cart fetched successfully', result: existingCart };
  }

  async update(id: string, userId: string, dto: UpdateCartDto) {
    if (!id) throw new BadRequestException('Cart id is required');
    if (!userId) throw new BadRequestException('User id is required');

    const existingCart = await this.cartRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!existingCart) {
      throw new NotFoundException('Cart not found');
    }

    // Handle service type update
    if (dto.serviceType) {
      existingCart.serviceType = dto.serviceType;
    }

    // Handle price update or regPeriod change
    if (
      dto.price !== undefined ||
      (dto.metadata && dto.metadata.regPeriod !== undefined)
    ) {
      const oldRegPeriod = existingCart.metadata?.regPeriod ?? 1;
      const newRegPeriod = dto.metadata?.regPeriod ?? oldRegPeriod;

      let unitPrice: number;
      if (dto.price !== undefined) {
        unitPrice = dto.price;
      } else {
        unitPrice = existingCart.price / oldRegPeriod;
      }
      existingCart.price = Math.round(unitPrice * newRegPeriod);
    }

    // Handle metadata update (merge with existing)
    if (dto.metadata !== undefined) {
      existingCart.metadata = { ...existingCart.metadata, ...dto.metadata };
    }

    const result = await this.cartRepo.save(existingCart);
    return { message: 'Cart updated successfully', result };
  }

  async remove(id: string, userId: string) {
    if (!id) throw new BadRequestException('Cart id is required');
    if (!userId) throw new BadRequestException('User id is required');

    const existingCart = await this.cartRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!existingCart) {
      throw new NotFoundException('Cart not found');
    }

    await this.cartRepo.remove(existingCart);
    return { message: 'Cart deleted successfully' };
  }
}
