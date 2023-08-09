import React from 'react';
import UpdateProfile from '@/components/module/user/lawfirm/AccountSettings/UpdateProfile';
import ChangePassword from '@/components/module/user/lawfirm/AccountSettings/ChangePassword';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Profilepicture from '@/components/module/user/lawfirm/AccountSettings/Profilepicture';
const Accountsettings = async () => {
  const data = await getServerSession(authOptions);
  return (
    <div className="m-card-bottom">
      <div className="tab-box">
        <div className="w-full">
          <div className="flex flex-wrap gap-6">
            <Profilepicture />
            <div className="flex-1 w-50">
              <h3 className="m-title">Update Profile</h3>
              <UpdateProfile />
            </div>
            <div className="flex-1 w-50">
              <h3 className="m-title">Change Password</h3>
              <ChangePassword id={data?.user?.id} />
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accountsettings;
