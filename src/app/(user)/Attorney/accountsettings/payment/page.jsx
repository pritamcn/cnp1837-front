import React from 'react';
import Cards from '@/components/module/user/lawfirm/AccountSettings/Cards';
import Bank from '@/components/module/user/lawfirm/AccountSettings/Bank';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

const Paymentsetting = async () => {
  const data = await getServerSession(authOptions);
  return (
    <div className="m-card-bottom">
      <div className="tab-box">
        <Cards userid={data?.user?.id} />
        <Bank userid={data?.user?.id} />
      </div>
    </div>
  );
};

export default Paymentsetting;
