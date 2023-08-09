import React from 'react';
import CommissionManagementTable from '@/components/module/user/CourtReporter/CommissionManagement/CommissionManagementTable';
const DownloadCommissionManagement = () => {
    return (
        <div className="right-container !flex-[0_0_calc(100vw-21.5625rem)] max-w-[calc(100vw-21.5625rem)] !pb-0 min-h-[100vh]">
            <div className="flex items-center min-h-12 mb-6">
                <h2 className="c-page-title !mb-0">Commission Management</h2>
            </div>
            <CommissionManagementTable />
        </div>
    )
}

export default DownloadCommissionManagement;