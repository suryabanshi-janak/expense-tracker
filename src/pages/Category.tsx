// import * as React from 'react';
// import { supabase } from '@/config/supabase';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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

      <div>
        <Accordion type='single' collapsible className='w-full'>
          <AccordionItem value='item-1'>
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that matches the other
              components&apos; aesthetic.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-3'>
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              Yes. It&apos;s animated by default, but you can disable it if you
              prefer.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
