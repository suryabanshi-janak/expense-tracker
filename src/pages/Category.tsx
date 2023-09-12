// import * as React from 'react';
// import { supabase } from '@/config/supabase';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

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
        <Link
          to='/categories/create'
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          Create a Category
        </Link>
      </div>
    </>
  );
}
