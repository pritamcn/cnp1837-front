import React from 'react';
import SubscriptionPhysician from '@/components/module/auth/client/subscriptionphysician';
import Footer from '@/components/module/common/client/Footer';
import RegisterHeader from '@/components/module/common/server/registerHeader';

const PhysicianSubscription = () => {
    return (
        <div className="App">
            <RegisterHeader />
            <SubscriptionPhysician />
            <Footer />
        </div>
    )
}

export default PhysicianSubscription;