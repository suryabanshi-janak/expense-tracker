import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useSavingInstitution from '@/services/useSavingInstitution';
import CreateSavingInstitution from '@/pages/saving/institutions/CreateSavingInstitution';
import InstitutionSkeleton from '@/components/skeletons/InstitutionSkeleton';
import { Icons } from '@/components/Icons';
import { SavingInstitution } from '@/types/collection';
import useMutateSavingInstitution from '@/services/useMutateInstitution';

export default function SavingInstitutions() {
  const navigate = useNavigate();

  const { savingInstitutions, refetch, isLoading } = useSavingInstitution();
  const { deleteInstitution, isLoading: deleteLoading } =
    useMutateSavingInstitution();

  const [openCreate, setOpenCreate] = React.useState<boolean>(false);
  const [mutationData, setMutationData] =
    React.useState<SavingInstitution | null>(null);

  const onBack = () => navigate(-1);

  const onAdd = () => {
    setMutationData(null);
    setOpenCreate(true);
  };

  const onEdit = (institution: SavingInstitution) => {
    setMutationData(institution);
    setOpenCreate(true);
  };

  const onDelete = async (institution: SavingInstitution) => {
    setMutationData(institution);
    await deleteInstitution({ institutionId: institution.id });
    await refetch();
  };

  return (
    <div>
      <Button variant='outline' onClick={onBack} className='mb-4'>
        Back
      </Button>

      <div className='flex items-center justify-between'>
        <h4 className='text-2xl font-bold tracking-tight scroll-m-20'>
          Saving Institutions
        </h4>

        {savingInstitutions.length ? (
          <Button onClick={onAdd}>Add new</Button>
        ) : null}
      </div>

      <Card className='mt-4'>
        <CardContent className='p-6'>
          {isLoading ? (
            <InstitutionSkeleton />
          ) : savingInstitutions.length ? (
            <div className='pl-4 space-y-2'>
              {savingInstitutions?.map((institution, index) => (
                <div
                  key={institution.id}
                  className='flex items-center justify-between pb-1 border-b'
                >
                  <div className='flex items-center gap-2 text-lg font-medium'>
                    <p>{index + 1}.</p>
                    <p>{institution.name}</p>
                  </div>

                  <div className='space-x-4'>
                    <Button
                      variant='ghost'
                      className='p-0 hover:text-emerald-500'
                      onClick={() => onEdit(institution)}
                      disabled={deleteLoading}
                    >
                      <Icons.edit className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      className='p-0 hover:text-red-500'
                      onClick={() => onDelete(institution)}
                      disabled={deleteLoading}
                    >
                      {deleteLoading && mutationData?.id === institution.id ? (
                        <Icons.spinner className='w-4 h-4 animate-spin' />
                      ) : (
                        <Icons.delete className='w-4 h-4' />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center w-full gap-2 h-60'>
              <p className='text-muted-foreground'>
                No Institution created yet
              </p>
              <Button onClick={() => setOpenCreate(true)}>Add new</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateSavingInstitution
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        refetch={refetch}
        editData={mutationData}
      />
    </div>
  );
}
