import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategorySkeleton() {
  return (
    <Accordion type='single' collapsible className='w-full'>
      {Array.from({ length: 4 }, (_, i) => i)?.map((item) => (
        <AccordionItem value={`item-${item}`} key={item}>
          <AccordionTrigger>
            <Skeleton className='w-2/5 h-3 rounded-lg' />
          </AccordionTrigger>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
