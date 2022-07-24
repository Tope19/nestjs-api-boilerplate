import {
  Body,
  Controller,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
  Delete,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '../common/helpers/response/Response';
import { Ok } from 'src/common/helpers/response/ResponseType';
import { CategoryService } from './category.service';
import { Category } from '../entities/category.entity';
import { CreateCategoriesDto } from './dto/categories.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryservice: CategoryService) {}

  @Post('create')
  @ApiOperation({ summary: 'Creates a new category for an api' })
  @UsePipes(ValidationPipe)
  async createCategories(
    @Body()
    post: CreateCategoriesDto,
  ): Promise<Ok<Category>> {
    const category = await this.categoryservice.createCategory(post);
    return ApiResponse.Ok(category, 'category Created', '201');
  }

  @Get()
  @ApiOperation({ summary: 'fetches all categories present in the Database' })
  async getCategory(): Promise<Ok<Category[]>> {
    const allCategories = await this.categoryservice.getCategory();
    return ApiResponse.Ok(allCategories, 'Ok', '200');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a single category with the matched id' })
  async deleteCategogry(@Param('id', new ParseUUIDPipe()) id: string) {
    const category = await this.categoryservice.deleteCategogry(id);
    return ApiResponse.Ok(category, 'Ok', '200');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetches a single category with the matched id' })
  async findOneById(@Param('id', new ParseUUIDPipe()) id: string) {
    const category = await this.categoryservice.findOneById(id);
    return ApiResponse.Ok(category, 'Ok', '200');
  }
}
