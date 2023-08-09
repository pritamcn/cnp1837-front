import MyCalendarComponent from '@/components/module/user/lawfirm/Calendar/mycalendar';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react';

const Calendar = async () => {
  const data = await getServerSession(authOptions);
  return (
    <div className="right-container !pb-0 min-h-[100vh]">
      <MyCalendarComponent userid={data.user.id} />
    </div>
  );
};

export default Calendar;
