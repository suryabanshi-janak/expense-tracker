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
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Icons } from '@/components/Icons';
import { DatePicker } from '@/components/DatePicker';
import { Separator } from '@/components/ui/separator';
import useTransaction from '@/services/useTransaction';
import { SavingFormData, SavingValidator } from '@/lib/validator/saving';
import useMutateSaving from '@/services/useMutateSaving';
import { useSavingStore } from '@/store/useSavingStore';
import useSavingInstitution from '@/services/useSavingInstitutions';

export default function CreateSaving() {
  const { savings } = useSavingStore();

  const { transactions } = useTransaction();
  const { savingInstitutions, isLoading: isInstitutionLoading } =
    useSavingInstitution();
  const { createSaving, updateSaving } = useMutateSaving();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const saving = React.useMemo(() => {
    const savingId = searchParams.get('saving_id');
    if (savingId) {
      return savings.find((saving) => saving.id === savingId);
    }

    return null;
  }, [searchParams, savings]);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const form = useForm<SavingFormData>({
    resolver: zodResolver(SavingValidator),
    defaultValues: {
      savings: [
        {
          institution: '',
          amount: String(saving?.amount) ?? '',
          description: saving?.description ?? '',
          saving_date: saving?.saving_date
            ? new Date(saving?.saving_date)
            : new Date(),
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'savings',
  });

  const onSubmit = async (data: SavingFormData) => {
    if (saving) {
      updateSaving({ data, saving, setIsLoading, setError, transactions });
    } else {
      createSaving({ data, setIsLoading, setError });
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
        {saving ? 'Edit' : 'Create'} saving
      </h4>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='mt-4 space-y-4'>
          {fields.map((arrayField, index) => (
            <div key={arrayField.id} className='flex flex-col gap-4'>
              <FormField
                control={form.control}
                name={`savings.${index}.description`}
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
                name={`savings.${index}.amount`}
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
                name={`savings.${index}.institution`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      {isInstitutionLoading ? (
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
                              {savingInstitutions?.map((institution) => (
                                <SelectItem
                                  value={institution.id}
                                  key={institution.id}
                                >
                                  {institution.name}
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
                name={`savings.${index}.saving_date`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Saving</FormLabel>
                    <FormControl>
                      <DatePicker date={field.value} setDate={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!saving ? (
                <>
                  <div className='flex items-center gap-2'>
                    {index === fields.length - 1 && (
                      <Button
                        type='button'
                        className='px-2'
                        onClick={() =>
                          append({
                            institution: '',
                            amount: '',
                            description: '',
                            saving_date: new Date(),
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
              {saving ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
