import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Icons } from '@/components/Icons';
import { ExpenseFormData, ExpenseValidator } from '@/lib/validator/expense';
import useCategory from '@/services/useCategory';
import { DatePicker } from '@/components/DatePicker';
import { useExpenseStore } from '@/store/useExpenseStore';
import { Separator } from '@/components/ui/separator';
import useTransaction from '@/services/useTransaction';
import { Skeleton } from '@/components/ui/skeleton';
import useMutateExpense from '@/services/useMutateExpense';

export default function CreateExpense() {
  const { expenses } = useExpenseStore();

  const { subcategories, isLoading: isCategoryLoading } = useCategory();
  const { transactions } = useTransaction();
  const { createExpense, updateExpense } = useMutateExpense();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const expense = React.useMemo(() => {
    const expenseId = searchParams.get('expense_id');
    if (expenseId) {
      const exp = expenses.find((expense) => expense.id === expenseId);
      return exp;
    }

    return null;
  }, [searchParams, expenses]);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(ExpenseValidator),
    defaultValues: {
      expenses: [
        {
          category_id: expense?.category_id ?? '',
          amount: String(expense?.amount) ?? '',
          description: expense?.description ?? '',
          payment_date: expense?.payment_date
            ? new Date(expense?.payment_date)
            : new Date(),
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'expenses',
  });

  const onSubmit = async (data: ExpenseFormData) => {
    if (expense) {
      updateExpense({ data, expense, setIsLoading, setError, transactions });
    } else {
      createExpense({ data, setIsLoading, setError });
    }
  };

  // React.useEffect(() => {
  //   error && setError('');
  // }, [form.watch()]);

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
        {expense ? 'Edit' : 'Create'} expense
      </h4>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='mt-4 space-y-4'>
          {fields.map((arrayField, index) => (
            <div key={arrayField.id} className='flex flex-col gap-4'>
              <FormField
                control={form.control}
                name={`expenses.${index}.description`}
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
                name={`expenses.${index}.category_id`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      {isCategoryLoading ? (
                        <Skeleton className='w-full h-8 rounded-md' />
                      ) : (
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
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`expenses.${index}.amount`}
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
                name={`expenses.${index}.payment_date`}
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

              {!expense ? (
                <>
                  <div className='flex items-center gap-2'>
                    {index === fields.length - 1 && (
                      <Button
                        type='button'
                        className='px-2'
                        onClick={() =>
                          append({
                            category_id: '',
                            amount: '',
                            description: '',
                            payment_date: new Date(),
                          })
                        }
                      >
                        Add new
                      </Button>
                    )}
                    {fields.length > 1 && (
                      <Button
                        type='button'
                        className='px-2'
                        onClick={() => remove(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  {fields.length - 1 !== index && (
                    <Separator className='my-4' />
                  )}
                </>
              ) : null}
            </div>
          ))}

          <div className='flex justify-center'>
            <Button
              type='submit'
              className='px-8 mt-8'
              disabled={isLoading || isCategoryLoading}
            >
              {isLoading && (
                <Icons.spinner className='w-4 h-4 mr-2 animate-spin' />
              )}
              {expense ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
