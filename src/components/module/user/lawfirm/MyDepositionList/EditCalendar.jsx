'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import EditDepositionTime from '../Deposition/EditdepositionTime';
const EditCalendar = () => {
  const { data } = useSession();
  return (
    <div className="right-container !flex-[0_0_calc(100vw-21.5625rem)] max-w-[calc(100vw-21.5625rem)] !p-0 min-h-[100vh]">
      <EditDepositionTime
        userid={data.user.id}
        email={data.user.email}
        //   formdata={formdata}
      />
    </div>
  );
};

export default EditCalendar;
