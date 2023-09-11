// import * as React from 'react';
// import { supabase } from '@/config/supabase';
import { CategoryDialog } from '@/components/dialog/CategoryDialog';

export default function Category() {
  // const [isLoading, setIsLoading] = React.useState<boolean>(true);
  // const [categories, setCategories] = React.useState<any>([]);

  // React.useEffect(() => {
  //   const fetchCategories = async () => {
  //     const { data } = await supabase.from('categories').select();
  //     if (data) {
  //       setCategories(data);
  //     }
  //     setIsLoading(false);
  //   };

  //   fetchCategories();
  // }, []);

  return (
    <>
      <div className='flex justify-end'>
        <CategoryDialog />
      </div>
    </>
  );
}
