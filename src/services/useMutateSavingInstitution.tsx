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

  const createSavingInstitution = async ({
    setIsLoading,
    data,
    setError,
  }: {
    setIsLoading: (loading: boolean) => void;
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

  const updateSavingInstitution = async ({
    setIsLoading,
    data,
    institutionId,
    setError,
  }: {
    setIsLoading: (loading: boolean) => void;
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

  return { createSavingInstitution, updateSavingInstitution };
};

export default useMutateSavingInstitution;
