import CaseRequestTable from '@/components/module/user/lawfirm/CaseRequest/CaseRequestTable'
import React from 'react'

const ReviewCase = () => {
  return (
    <div className="right-container">
       <div className="p-title-flex flex items-center justify-between flex-wrap mb-6">
        <h2 className="c-page-title">Case Request List</h2>
      </div>
    <CaseRequestTable />
</div>
  )
}

export default ReviewCase