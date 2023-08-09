import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import MyCalendarComponent from '@/components/module/user/lawfirm/Calendar/mycalendar';

const Calendar = async () => {
  const data = await getServerSession(authOptions);
  return (
    <div className="right-container !flex-[0_0_calc(100vw-21.5625rem)] max-w-[calc(100vw-21.5625rem)] !pb-0 min-h-[100vh]">
      <MyCalendarComponent userid={data.user.id} />
    </div>
  );
};

export default Calendar;
