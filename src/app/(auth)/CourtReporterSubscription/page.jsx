import React from 'react';
import RegisterHeader from '@/components/module/common/server/registerHeader';
import Footer from '@/components/module/common/client/Footer';
import SubscriptionCourtReporter from '@/components/module/auth/client/subscriptioncourtreporter';

const CourtReporterSubscription = () => {
    return (
        <div className="App">
            <RegisterHeader />
            <SubscriptionCourtReporter />
            <Footer />
        </div>
    )
}

export default CourtReporterSubscription;