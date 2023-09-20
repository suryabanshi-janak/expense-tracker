import * as React from 'react';
import { supabase } from '@/config/supabase';

import { getCategoryWithSubcategory, getSubcategory } from '@/lib/modifier';
import { CategoryWithSubCategory } from '@/types';
import { Category } from '@/types/collection';

const useCategory = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [categories, setCategories] = React.useState<CategoryWithSubCategory[]>(
    []
  );
  const [subcategories, setSubcategories] = React.useState<Category[]>([]);

  const fetchCategories = React.useCallback(async () => {
    const { data } = await supabase.from('categories').select();
    if (data) {
      const categories = getCategoryWithSubcategory(data);
      const subcategories = getSubcategory(data);
      setCategories(categories);
      setSubcategories(subcategories);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { isLoading, categories, subcategories };
};

export default useCategory;
