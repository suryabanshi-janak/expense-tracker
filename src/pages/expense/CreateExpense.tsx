import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { supabase } from '@/config/supabase';
import { Icons } from '@/components/Icons';
import { ExpenseFormData, ExpenseValidator } from '@/lib/validator/expense';
import useCategory from '@/features/useCategory';
import { useAuthStore } from '@/store/useAuth';
import { DatePicker } from '@/components/DatePicker';

export default function CreateExpense() {
  const { auth } = useAuthStore();
  const { subcategories } = useCategory();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(ExpenseValidator),
    defaultValues: {
      category_id: '',
      amount: '',
      description: '',
      payment_date: undefined,
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    setIsLoading(true);
    const expense = {
      category_id: data.category_id,
      amount: +data.amount,
      description: data.description,
      user_id: auth?.user.id || '',
      payment_date: data.payment_date.toISOString(),
    };

    const { error } = await supabase.from('expenses').insert([expense]);

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    navigate('/expenses');
  };

  React.useEffect(() => {
    error && setError('');
  }, [form.watch()]);

  const onBack = () => navigate(-1);

  return (
    <>
      <Button variant='outline' onClick={onBack} className='mb-4'>
        Back
      </Button>

      {error && (
        <p className='text-sm font-semibold text-center text-red-400'>
          {error}
        </p>
      )}

      <h4 className='text-2xl font-bold tracking-tight scroll-m-20'>
        Create expense
      </h4>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='mt-4 space-y-4'>
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input type='text' placeholder='Description' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='category_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select a categpry' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {subcategories?.map((subcategory) => (
                          <SelectItem
                            value={subcategory.id}
                            key={subcategory.id}
                          >
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='amount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type='number' placeholder='Amount' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='payment_date'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of payment</FormLabel>
                <FormControl>
                  <DatePicker date={field.value} setDate={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
