import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { ApiResponse } from '../common/helpers/response';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async checkUserExists(userId) {
    const userExists = await this.usersRepo.findOneBy({ id: userId });
    if (!userExists) {
      throw new NotFoundException(
        ApiResponse.NotFoundRequest(
          'Not found',
          `User with id : ${userId} does not exist`,
          '404',
        ),
      );
    }
    return userExists;
  }

  async findById(id: string) {
    //check if user exists
    const user = await this.checkUserExists(id);
    //return user
    return user;
  }

  async editUserById(dto: UpdateUserDto, id: string) {
    //check if user exists
    await this.checkUserExists(id);

    //update user details
    return await this.usersRepo.update(id, dto).catch((err) => {
      throw new BadRequestException(
        ApiResponse.BadRequest(
          'Internal server error',
          'User not updated',
          '500',
        ),
      );
    });
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(
        ApiResponse.NotFoundRequest(
          'Internal server error',
          'user not found',
          '404',
        ),
      );
    }
    Object.assign(user, attrs);
    const updatedUser = this.usersRepo.save(user);
    return updatedUser;
  }
}
