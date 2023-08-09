import React from 'react'
import DepositionRequestTable from '@/components/module/user/Physician/DepositionRequestsScheduling/DepositionRequestTable';

const DepositionRequests = () => {
    return (
        <div className="right-container !flex-[0_0_calc(100vw-21.5625rem)] max-w-[calc(100vw-21.5625rem)] !pb-0 min-h-[100vh]">
            <h2 className="c-page-title">Deposition Requests & Scheduling</h2>
            <div className="m-card p-5">
                <DepositionRequestTable />
            </div>
        </div>
    )
}

export default DepositionRequests;