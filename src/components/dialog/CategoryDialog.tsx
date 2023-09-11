import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CategoryFormData, CategoryValidator } from '@/lib/validator/category';

export function CategoryDialog() {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(CategoryValidator),
    defaultValues: {
      name: '',
      subcategories: [],
    },
  });

  const onSubmit = (data: CategoryFormData) => {};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Category</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create a category</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit'>Create</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
