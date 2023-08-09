import React from 'react';
import RateAndPaymentTerms from '@/components/module/user/Physician/AccountSettings/RateAndPaymentTerms';
import BankDetails from '@/components/module/user/Physician/AccountSettings/BankDetails';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

const Paymentsetting = async () => {
  const data = await getServerSession(authOptions);
  return (
    <div className="m-card-bottom">
      <div className="tab-box">
        <RateAndPaymentTerms userid={data?.user?.id} />
        <BankDetails userid={data?.user?.id} />
      </div>
    </div>
  );
};

export default Paymentsetting;
