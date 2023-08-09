import React from 'react'
import CancellationRefundTable from '@/components/module/user/lawfirm/CancellationAndRefund/CancellationRefundTable';

const CancellationRefund = () => {
    return (
        <div className="right-container">
            <div className="p-title-flex flex items-center justify-between flex-wrap mb-6">
                <h2 className="c-page-title">My Cancellation & Refund</h2>
            </div>
            <CancellationRefundTable />
        </div>
    )
}

export default CancellationRefund;