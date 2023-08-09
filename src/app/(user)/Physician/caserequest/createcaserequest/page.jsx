import React from 'react';
import CreateCaseReviewDeposition from '@/components/module/user/Physician/CaseReviewDeposition/CreateCaseReviewDeposition';

const AddReviewDeposition = () => {
  return (
    <div className="right-container !flex-[0_0_calc(100vw-21.5625rem)] max-w-[calc(100vw-21.5625rem)] !pb-0 min-h-[100vh]">
      <div className="flex items-center min-h-12 mb-6">
        <h2 className="c-page-title !mb-0">Create Case Review Deposition</h2>
      </div>
      <CreateCaseReviewDeposition />
    </div>
  );
};

export default AddReviewDeposition;
