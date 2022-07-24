// confirm Category ids are valid
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponse } from 'src/common/helpers/response';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryIdGuard implements CanActivate {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const categoryId = request.params.categoryId;

    return this.confirmCategoryId(categoryId);
  }

  async confirmCategoryId(categoryId: string) {
    const check = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    // if check does not exist, throw error
    if (!check) {
      throw new NotFoundException(
        ApiResponse.NotFoundRequest(
          'Category not found',
          'The category with the provided id was not found',
          '404',
        ),
      );
    }

    return true;
  }
}
