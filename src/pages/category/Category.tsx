import { Link } from 'react-router-dom';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import CategorySkeleton from '@/components/skeletons/CategorySkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useCategory from '@/features/useCategory';

export default function CategoryPage() {
  const { isLoading, categories } = useCategory();

  return (
    <>
      <div className='flex justify-end mb-4'>
        <Link
          to='/categories/create'
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          Create a Category
        </Link>
      </div>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-xl'>List of Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <CategorySkeleton />
          ) : (
            <Accordion type='single' collapsible className='w-full'>
              {categories?.map((category, index) => (
                <AccordionItem value={`item-${index}`} key={category.id}>
                  <AccordionTrigger className='font-normal hover:no-underline group'>
                    <div className='flex flex-col items-start space-y-1'>
                      <h2 className='text-base font-semibold group-hover:underline'>
                        {category.name}
                      </h2>
                      <p className='text-muted-foreground'>
                        {category?.description}
                      </p>
                    </div>
                  </AccordionTrigger>
                  {category?.subcategories?.map((subcategory) => (
                    <AccordionContent
                      key={subcategory.id}
                      className='ml-4 font-semibold'
                    >
                      {subcategory.name}
                    </AccordionContent>
                  ))}
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </>
  );
}
