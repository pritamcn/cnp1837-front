
import React from 'react';
import Casedetails from '@/components/module/user/lawfirm/CaseManagment/casedetails';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
const casedetails = async (context) => {
  const data = await getServerSession(authOptions);
  return (
    <div className="right-container !flex-[0_0_calc(100vw-21.5625rem)] max-w-[calc(100vw-21.5625rem)] !pb-0 min-h-[100vh]">
     
      <Casedetails data={data} />
    </div>
  );
};

export default casedetails;
