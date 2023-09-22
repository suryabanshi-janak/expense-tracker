import * as React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CategoryFormData, CategoryValidator } from '@/lib/validator/category';
import { Label } from '@/components/ui/label';
import { supabase } from '@/config/supabase';
import { slugify } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/Icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export default function CreateCategory() {
  const navigate = useNavigate();
  const { auth } = useAuthStore();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [categoryError, setCategoryError] = React.useState<string>('');
  const [subcategoryError, setSubcategoryError] = React.useState<string>('');

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(CategoryValidator),
    defaultValues: {
      name: '',
      description: '',
      subcategories: [{ name: '', description: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'subcategories',
  });

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);
    const { name, description, subcategories } = data;

    const newCategory = {
      name,
      description,
      slug: slugify(name),
      user_id: auth?.user.id || '',
    };
    const {
      data: category,
      error,
      status,
    } = await supabase.from('categories').insert([newCategory]).select();

    if (error) {
      let errorMessage = 'We are not able to create a new category.';
      if (status == 409) {
        errorMessage = 'Category name already exists, please try another name';
      }
      setCategoryError(errorMessage);
      setIsLoading(false);
      return;
    }

    if (category.length) {
      subcategories?.forEach(async (subcategory) => {
        const { error, status } = await supabase.from('categories').insert([
          {
            parent_id: category[0].id,
            name: subcategory.name,
            description: subcategory.description,
            slug: slugify(subcategory.name),
            user_id: auth?.user.id || '',
          },
        ]);

        if (error) {
          let errorMessage = 'We are not able to create a new category.';
          if (status == 409) {
            errorMessage = `Sub category with name ${subcategory.name} already exists, please try another name`;
          }
          setSubcategoryError(errorMessage);
          setIsLoading(false);

          navigate('/categories');
          return;
        }
      });
    }

    form.reset();

    setIsLoading(false);
  };

  React.useEffect(() => {
    setCategoryError('');
  }, [form.watch().name]);

  React.useEffect(() => {
    setSubcategoryError('');
  }, [form.watch().subcategories]);

  const onBack = () => navigate(-1);

  return (
    <>
      <Button variant='outline' onClick={onBack} className='mb-4'>
        Back
      </Button>

      {(categoryError || subcategoryError) && (
        <p className='mb-4 text-sm font-semibold text-center text-red-400'>
          {categoryError || subcategoryError}
        </p>
      )}

      <h4 className='text-2xl font-bold tracking-tight scroll-m-20'>
        Create a category
      </h4>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='mt-4 space-y-4'>
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
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder='Description' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Label>Subcategories</Label>
            <div className='mt-2 space-y-4'>
              {fields.map((field, index) => (
                <div key={field.id} className='flex flex-col gap-4'>
                  <Input
                    placeholder='Name'
                    type='text'
                    {...form.register(`subcategories.${index}.name`)}
                  />
                  <Textarea
                    placeholder='Description'
                    {...form.register(`subcategories.${index}.description`)}
                  />
                  <div className='flex items-center gap-2'>
                    <Button
                      type='button'
                      className='px-2'
                      onClick={() => append({ name: '', description: '' })}
                    >
                      Add another
                    </Button>
                    {index > 0 && (
                      <Button
                        type='button'
                        className='px-2'
                        onClick={() => remove(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='flex justify-center'>
            <Button type='submit' className='px-8 mt-8' disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className='w-4 h-4 mr-2 animate-spin' />
              )}
              Create
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
