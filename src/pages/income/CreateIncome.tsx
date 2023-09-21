import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type PostgrestSingleResponse } from '@supabase/supabase-js';

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

import { supabase } from '@/config/supabase';
import { Icons } from '@/components/Icons';
import { useAuthStore } from '@/store/useAuth';
import { DatePicker } from '@/components/DatePicker';
import { Separator } from '@/components/ui/separator';
import { useIncomeStore } from '@/store/useIncome';
import {
  IncomeFormData,
  IncomeValidator,
  SingleIncomeFormData,
} from '@/lib/validator/income';
import { Income } from '@/types/collection';
import { getTransactionPayload } from '@/lib/modifier';
import { TransactionType } from '@/types';

const getIncomePayload = (income: SingleIncomeFormData, userId: string) => {
  return {
    amount: +income.amount,
    description: income.description,
    user_id: userId,
    income_date: income.income_date.toISOString(),
  };
};

export default function CreateIncome() {
  const { auth } = useAuthStore();
  const { incomes } = useIncomeStore();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const income = React.useMemo(() => {
    const incomeId = searchParams.get('income_id');
    if (incomeId) {
      return incomes.find((income) => income.id === incomeId);
    }

    return null;
  }, [searchParams, incomes]);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const form = useForm<IncomeFormData>({
    resolver: zodResolver(IncomeValidator),
    defaultValues: {
      incomes: [
        {
          amount: String(income?.amount) ?? '',
          description: income?.description ?? '',
          income_date: income?.income_date
            ? new Date(income?.income_date)
            : new Date(),
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'incomes',
  });

  const onSubmit = async (data: IncomeFormData) => {
    setIsLoading(true);
    let res: PostgrestSingleResponse<Income[]> | null = null;

    if (income) {
      const incomeData = getIncomePayload(data.incomes[0], auth!.user.id);
      res = await supabase
        .from('incomes')
        .update(incomeData)
        .eq('id', income.id)
        .select('*');
    } else {
      const newIncome = data.incomes.map((income) =>
        getIncomePayload(income, auth!.user.id)
      );
      res = await supabase.from('incomes').insert(newIncome).select('*');

      if (res.data) {
        const transactions = res.data.map((income) =>
          getTransactionPayload({
            type: TransactionType.INCOME,
            data: income,
          })
        );
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert(transactions);
        if (transactionError) {
          // show toaster message
        }
      }
    }

    if (res?.error) {
      setError(res.error.message);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    navigate('/incomes');
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
        {income ? 'Edit' : 'Create'} income
      </h4>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='mt-4 space-y-4'>
          {fields.map((arrayField, index) => (
            <div key={arrayField.id} className='flex flex-col gap-4'>
              <FormField
                control={form.control}
                name={`incomes.${index}.description`}
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
                name={`incomes.${index}.amount`}
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
                name={`incomes.${index}.income_date`}
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

              {!income ? (
                <>
                  <div className='flex items-center gap-2'>
                    {index === fields.length - 1 && (
                      <Button
                        type='button'
                        className='px-2'
                        onClick={() =>
                          append({
                            amount: '',
                            description: '',
                            income_date: new Date(),
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
            <Button type='submit' className='px-8 mt-8' disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className='w-4 h-4 mr-2 animate-spin' />
              )}
              {income ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
