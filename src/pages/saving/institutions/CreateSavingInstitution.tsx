import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  SavingInstitutionFormData,
  SavingInstitutionValidator,
} from '@/lib/validator/institution';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import useMutateSavingInstitution from '@/services/useMutateInstitution';
import { SavingInstitution } from '@/types/collection';

interface CreateSavingInstitutionProps {
  open: boolean;
  editData: SavingInstitution | null;
  onClose: () => void;
  refetch: () => void;
}

export default function CreateSavingInstitution({
  open,
  editData,
  onClose,
  refetch,
}: CreateSavingInstitutionProps) {
  const { createInstitution, updateInstitution, isLoading } =
    useMutateSavingInstitution();

  const [error, setError] = React.useState<string>('');

  const form = useForm<SavingInstitutionFormData>({
    resolver: zodResolver(SavingInstitutionValidator),
    defaultValues: {
      name: '',
    },
  });

  React.useEffect(() => {
    if (editData) {
      form.reset({ name: editData.name });
    }
  }, [editData]);

  const onSubmit = async (data: SavingInstitutionFormData) => {
    if (editData) {
      await updateInstitution({
        setError,
        data,
        institutionId: editData.id,
      });
    } else {
      await createInstitution({ data, setError });
    }
    refetch();
    handleClose();
  };

  const handleClose = () => {
    form.reset();
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit' : 'Create'} Institution</DialogTitle>
        </DialogHeader>

        {error && (
          <p className='text-sm font-semibold text-center text-red-400'>
            {error}
          </p>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution Name</FormLabel>
                  <FormControl>
                    <Input type='text' placeholder='Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className='w-4 h-4 mr-2 animate-spin' />
              )}
              {editData ? 'Update' : 'Create'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
