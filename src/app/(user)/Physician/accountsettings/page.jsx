import React from 'react';
import bigprofileimg from '../../../../assets/images/big-profile-img.png';
import userimgplaceholder from '../../../../assets/images/user-img-placeholder.png';
import editpencilicon from './../../../../assets/images/icons/edit-pencil.svg';
import Image from 'next/image';
import UpdateProfile from '@/components/module/user/Physician/AccountSettings/UpdateProfile';
import ChangePassword from '@/components/module/user/lawfirm/AccountSettings/ChangePassword';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Profilepicture from '@/components/module/user/lawfirm/AccountSettings/Profilepicture';
const AccountSettings = async () => {
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

export default AccountSettings;