import { Skeleton } from '../ui/skeleton';

export default function InstitutionSkeleton() {
  return (
    <ul className='pl-4 space-y-4'>
      {Array.from({ length: 5 }, (_, i) => i).map((ind) => (
        <li key={ind} className='pb-2 text-lg font-medium border-b'>
          <Skeleton className='w-1/2 h-4 rounded-md' />
        </li>
      ))}
    </ul>
  );
}
