'use client';

import Image from 'next/image';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const Documents = () => {
  const { user } = useUser();
  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4'>
      <Image
        src='/empty.png'
        alt='Empty '
        width={300}
        height={300}
        className='dark:hidden'
      />
      <Image
        src='/empty-dark.png'
        alt='Empty'
        width={300}
        height={300}
        className='hidden dark:block'
      />

      <h2>Welcome to {user?.firstName}&apos;s Jotion</h2>

      <Button>
        <PlusCircle className='h-4 w-4 mr-2' />
        Create a Note
      </Button>
    </div>
  );
};

export default Documents;
