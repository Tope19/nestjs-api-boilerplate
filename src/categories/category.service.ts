import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiResponse } from '../common/helpers/response';
import { Category } from '../entities/category.entity';
import { CreateCategoriesDto } from './dto/categories.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(payload: CreateCategoriesDto): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { name: payload.name },
      });

      if (category) {
        throw new BadRequestException(
          ApiResponse.BadRequest(
            'Existing Values',
            'A Categorty with this name already exists',
            '400',
          ),
        );
      }

      const newCategory = this.categoryRepository.create({
        ...payload,
      });
      const savedCategory = await this.categoryRepository.save(newCategory);
      return savedCategory;
    } catch (error) {
      throw new BadRequestException(
        ApiResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }

  async getCategory(): Promise<Category[]> {
    try {
      const allCategories = await this.categoryRepository.find({
        select: ['id', 'name', 'description'],
      });
      return allCategories;
    } catch (error) {
      throw new BadRequestException(
        ApiResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }

  async deleteCategogry(id: string): Promise<string> {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (category) {
        await this.categoryRepository.remove(category);
        return `${category.name} category successfully deleted`;
      }
      throw new NotFoundException(
        ApiResponse.NotFoundRequest(
          'Not Found',
          'Category does not exist',
          '404',
        ),
      );
    } catch (error) {
      throw new BadRequestException(
        ApiResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }

  async findOneById(id: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        throw new NotFoundException(
          ApiResponse.NotFoundRequest(
            'Not Found',
            'Category does not exist',
            '404',
          ),
        );
      }
      return category;
    } catch (error) {
      throw new BadRequestException(
        ApiResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }
}
