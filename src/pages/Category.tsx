import * as React from 'react';
import { supabase } from '@/config/supabase';

export default function Category() {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  console.log('🚀 ~ file: Category.tsx:6 ~ Category ~ isLoading:', isLoading);
  const [categories, setCategories] = React.useState<any>([]);
  console.log('🚀 ~ file: Category.tsx:8 ~ Category ~ categories:', categories);

  React.useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select();
      if (data) {
        setCategories(data);
      }
      setIsLoading(false);
    };

    fetchCategories();
  }, []);

  return <div>Category</div>;
}
