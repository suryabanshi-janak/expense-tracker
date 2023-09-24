import { toast } from '@/components/ui/use-toast';
import { type PostgrestSingleResponse } from '@supabase/supabase-js';

interface ResponseProps<T> {
  setIsLoading: (value: boolean) => void;
  response: PostgrestSingleResponse<T>;
  successMessage: string;
}

export default function onResponse<T>({
  setIsLoading,
  response,
  successMessage,
}: ResponseProps<T>) {
  if (response.error) {
    toast({
      title: 'Something went wrong',
      description: response.error.message,
      variant: 'destructive',
    });
    setIsLoading(false);
    return { success: false };
  }

  toast({
    title: 'Success',
    description: successMessage,
  });

  setIsLoading(false);
  return { success: true };
}
