import { SetMetadata } from '@nestjs/common';

// export interface CategoryDecoratorParams {
//   categoryId: string;
// }

// export const Category = (params: CategoryDecoratorParams | string) =>
//   SetMetadata(
//     'categoryParams',
//     typeof params === 'string' ? { categoryId: params } : params,
//   );

export const Categories = (...categories: string[]) =>
  SetMetadata('categories', categories);
