import { Category } from './collection';

export interface CategoryWithSubCategory extends Category {
  subcategories: Category[];
}
