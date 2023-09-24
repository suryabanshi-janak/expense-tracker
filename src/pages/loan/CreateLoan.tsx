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

import { Icons } from '@/components/Icons';
import { DatePicker } from '@/components/DatePicker';
import { Separator } from '@/components/ui/separator';
import useTransaction from '@/services/useTransaction';
import { useLoanStore } from '@/store/useLoanStore';
import useMutateLoan from '@/services/useMutateLoan';
import { LoanFormData, LoanValidator } from '@/lib/validator/loan';
import { LoanStatus, LoanTransactionType } from '@/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CreateLoan() {
  const { loans } = useLoanStore();

  const { transactions } = useTransaction();
  // const { createIncome, updateIncome } = useMutateIncome();
  const { createLoan, updateLoan, isLoading } = useMutateLoan();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const loan = React.useMemo(() => {
    const loanId = searchParams.get('loan_id');
    if (loanId) {
      return loans.find((loan) => loan.id === loanId);
    }

    return null;
  }, [searchParams, loans]);

  const form = useForm<LoanFormData>({
    resolver: zodResolver(LoanValidator),
    defaultValues: {
      loans: [
        {
          amount: String(loan?.amount) ?? '',
          description: loan?.description ?? '',
          payee_payor: loan?.payee_payor ?? '',
          status: (loan?.status as LoanStatus) ?? LoanStatus.PENDING,
          loan_transaction_type:
            (loan?.loan_transaction_type as LoanTransactionType) ||
            LoanTransactionType.LEND,
          loan_date: loan?.loan_date ? new Date(loan?.loan_date) : new Date(),
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'loans',
  });

  const onSubmit = async (data: LoanFormData) => {
    if (loan) {
      updateLoan({ data, loanId: loan.id, transactions });
    } else {
      createLoan({ data });
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

      <h4 className='text-2xl font-bold tracking-tight scroll-m-20'>
        {loan ? 'Edit' : 'Create'} loan
      </h4>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='mt-4 space-y-4'>
          {fields.map((arrayField, index) => (
            <div key={arrayField.id} className='flex flex-col gap-4'>
              <FormField
                control={form.control}
                name={`loans.${index}.description`}
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
                name={`loans.${index}.amount`}
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
                name={`loans.${index}.payee_payor`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payee/Payor</FormLabel>
                    <FormControl>
                      <Input type='text' placeholder='Name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`loans.${index}.status`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
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
                            {Object.values(LoanStatus).map((status) => (
                              <SelectItem value={status} key={status}>
                                {status}
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
                name={`loans.${index}.loan_transaction_type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
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
                            {Object.values(LoanTransactionType).map((type) => (
                              <SelectItem value={type} key={type}>
                                {type}
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
                name={`loans.${index}.loan_date`}
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

              {!loan ? (
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
                            loan_date: new Date(),
                            payee_payor: '',
                            status: LoanStatus.PENDING,
                            loan_transaction_type: LoanTransactionType.LEND,
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
              {loan ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
