import React from 'react'
import RescheduleTable from '@/components/module/user/lawfirm/Reschedule/RescheduleTable';
const Resechedule = () => {
  return (
    <div className='right-container'>
    <div className='p-title-flex flex items-center justify-between flex-wrap mb-6'>
      <h2 className='c-page-title'>Cancellation and rescheduling request</h2>
    </div>
    <RescheduleTable/>
  </div>
  )
}

export default Resechedule