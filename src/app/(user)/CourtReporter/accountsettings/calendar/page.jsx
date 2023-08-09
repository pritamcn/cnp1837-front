import React from 'react';
import previewicon from './../../../../../assets/images/icons/preview-icon.svg';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import AvailabilitySet from '@/components/module/user/lawfirm/AccountSettings/AvailabilitySet';
import { authOptions } from '@/lib/auth';

const Calendersettings = async () => {
  const data = await getServerSession(authOptions);
  return (
    <div className="m-card-bottom">
      <div className="tab-box">
        <div className="calender-wrap max-w-3xl">
          <div className="flex items-center justify-between">
            <h3 className="calender-wrap-title">Set General Unavailability</h3>
            <button className="calender-wrap-prev">
              <Image src={previewicon} alt="" />
              Preview
            </button>
          </div>
          <AvailabilitySet userid={data?.user?.id} />
        </div>
      </div>
    </div>
  );
};

export default Calendersettings;
