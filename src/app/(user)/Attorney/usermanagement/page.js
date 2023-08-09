import React from 'react';
import UserManagementTable from '@/components/module/user/lawfirm/UserManagement/UserManagementTable';

const UserManagement = () => {
  return (
    <div className="right-container !flex-[0_0_calc(100vw-21.5625rem)] max-w-[calc(100vw-21.5625rem)] !pb-0 min-h-[100vh]">
      <UserManagementTable />
    </div>
  );
};

export default UserManagement;
