import SetDepositionTime from '@/components/module/user/lawfirm/Deposition/SetDepositionTime';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react';

const page = async () => {
  const data = await getServerSession(authOptions);
  return (
    <div className="right-container !flex-[0_0_calc(100vw-21.5625rem)] max-w-[calc(100vw-21.5625rem)] !pb-0 min-h-[100vh]">
      <SetDepositionTime userid={data.user.id} email={data.user.email} />
    </div>
  );
};

export default page;
