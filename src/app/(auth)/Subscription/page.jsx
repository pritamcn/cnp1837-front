import React from 'react';
import Footer from '@/components/module/common/client/Footer';
import RegisterHeader from '@/components/module/common/server/registerHeader';
import SubscriptionClient from '@/components/module/auth/client/subcriptionclient';

const MembershipSubscription = () => {
  return (
    <div className="App">
     <RegisterHeader/>
      <SubscriptionClient/>
      <Footer/>
    </div>
  );
};

export default MembershipSubscription;
