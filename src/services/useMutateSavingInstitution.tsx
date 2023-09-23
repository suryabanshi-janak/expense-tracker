import * as React from 'react';
import { supabase } from '@/config/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { SavingInstitutionFormData } from '@/lib/validator/institution';

const getSavingInstitutionPayload = (
  saving: SavingInstitutionFormData,
  userId: string
) => {
  return {
    name: saving.name,
    user_id: userId,
  };
};

const useMutateSavingInstitution = () => {
  const { auth } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const createInstitution = async ({
    data,
    setError,
  }: {
    data: SavingInstitutionFormData;
    setError: (error: string) => void;
  }) => {
    setIsLoading(true);

    const institution = getSavingInstitutionPayload(data, auth!.user.id);
    const res = await supabase
      .from('saving_institutions')
      .insert(institution)
      .select('*');

    if (res?.error) {
      setError(res.error.message);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  const updateInstitution = async ({
    data,
    institutionId,
    setError,
  }: {
    data: SavingInstitutionFormData;
    institutionId: string;
    setError: (error: string) => void;
  }) => {
    setIsLoading(true);

    const institution = getSavingInstitutionPayload(data, auth!.user.id);
    const res = await supabase
      .from('saving_institutions')
      .update(institution)
      .eq('id', institutionId)
      .select('*');

    if (res?.error) {
      setError(res.error.message);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  const deleteInstitution = async ({
    institutionId,
  }: {
    institutionId: string;
  }) => {
    setIsLoading(true);

    const { error } = await supabase
      .from('saving_institutions')
      .delete()
      .eq('id', institutionId);

    if (error) {
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  return {
    createInstitution,
    updateInstitution,
    deleteInstitution,
    isLoading,
  };
};

export default useMutateSavingInstitution;
