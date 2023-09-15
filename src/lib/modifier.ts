import { CategoryWithSubCategory } from '@/types';
import { Category } from '@/types/collection';

export function getCategoryWithSubcategory(categoryData: Category[]) {
  // first data are sorted, so parent categories come before sub categories
  const sortedCategory = categoryData.sort((a, b) => {
    if (a.parent_id === null && b.parent_id !== null) {
      return -1;
    }
    if (a.parent_id !== null && b.parent_id === null) {
      return 1;
    }
    return 0;
  });

  const categories: CategoryWithSubCategory[] = sortedCategory.reduce(
    (acc: CategoryWithSubCategory[], category: Category) => {
      if (!category.parent_id) {
        acc.push({
          ...category,
          subcategories: [],
        });
      } else {
        const parentCategory = acc.find((cat) => cat.id === category.parent_id);
        if (parentCategory) {
          parentCategory.subcategories.push(category);
        }
      }
      return acc;
    },
    []
  );

  return categories;
}

export function getSubcategory(categoryData: Category[]) {
  return categoryData.reduce((acc: Category[], subcategory: Category) => {
    if (subcategory?.parent_id) {
      acc.push(subcategory);
    }
    return acc;
  }, []);
}
