import * as React from 'react';
import { supabase } from '@/config/supabase';
import { SavingInstitution } from '@/types/collection';

const useSavingInstitution = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [savingInstitutionData, setSavingInstitutionData] = React.useState<
    SavingInstitution[]
  >([]);

  const fetchSavingInstitutions = React.useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase.from('saving_institutions').select();

    if (data) {
      setSavingInstitutionData(data);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    fetchSavingInstitutions();
  }, [fetchSavingInstitutions]);

  return {
    isLoading,
    savingInstitutions: savingInstitutionData,
    refetch: fetchSavingInstitutions,
  };
};

export default useSavingInstitution;
