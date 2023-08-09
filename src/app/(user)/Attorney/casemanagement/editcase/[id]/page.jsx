import EditCase from '@/components/module/user/lawfirm/CaseManagment/editcase';
import React from 'react';

const EditCaseManagement = () => {
  return (
    <div className="right-container !flex-[0_0_calc(100vw-21.5625rem)] max-w-[calc(100vw-21.5625rem)] !pb-0 min-h-[100vh]">
      <div className="flex items-center min-h-12 mb-6">
        <h2 className="c-page-title !mb-0">Edit Case</h2>
      </div>
      <EditCase />
    </div>
  );
};

export default EditCaseManagement;
