'use client';
import React from 'react';
import Dashboardicon from '../../../../assets/images/icons/dashboard-dark-icon.svg';
import Usermanageicon from '../../../../assets/images/icons/user-manag-icon.svg';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const LeftNav = () => {
  const path = usePathname();
  const { data } = useSession();
  return (
    <div className="c-lsidebar h-[100vh] flex-[0_0_16rem] overflow-auto">
      <div className="flex c-lsidebar-wrap h-full">
        <nav className="flex flex-col items-center c-lsidebar-nav">
          <div
            className={`c-lsidebar-item-wrap ${path.includes('dashboard') ? 'active' : null
              }`}
          >
            <Link
              href={`${data?.user?.role_id === "8" ? "/Expert" : "/Physician"}/dashboard`}
              className="block c-lsidebar-item">
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Dashboard
            </Link>
          </div>
          <div
            className={`c-lsidebar-item-wrap ${path.includes('accountsettings') ? 'active' : null
              }`}
          >
            <Link
              href={`${data?.user?.role_id === "8" ? "/Expert" : "/Physician"}/accountsettings`}
              //href="/Physician/accountsettings"
              className="block c-lsidebar-item"
            >
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Account Settings
            </Link>
          </div>
          <div
            className={`c-lsidebar-item-wrap ${path.includes('depositionrequests') ? 'active' : null
              }`}
          >
            <Link
              href={`${data?.user?.role_id === "8" ? "/Expert" : "/Physician"}/depositionrequests`}
              //  href="/Physician/depositionrequests"
              className="block c-lsidebar-item"
            >
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Deposition Requests & Scheduling
            </Link>
          </div>
          {/* <div className="c-lsidebar-item-wrap">
            <Link href="#" className="block c-lsidebar-item">
              <span className="block">
                <Image src={Usermanageicon} alt="" />
              </span>
              My Deposition Calls
            </Link>
          </div> */}
          <div className={`c-lsidebar-item-wrap ${path.includes('cancellationandrefund') ? 'active' : null
            }`}>
            <Link href={`${data?.user?.role_id === "8" ? "/Expert" : "/Physician"}/cancellationandrefund`} className="block c-lsidebar-item">
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Cancellations & Refunds
            </Link>
          </div>
          <div className={`c-lsidebar-item-wrap ${path.includes('notification') ? 'active' : null
            }`}>
            <Link
              href={`${data?.user?.role_id === "8" ? "/Expert" : "/Physician"}/notificationmanagement`}
              // href="/Physician/notification"
              className="block c-lsidebar-item"
            >
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Alerts & Notifications
            </Link>
          </div>
          <div className={`c-lsidebar-item-wrap ${!path.includes('accountsettings') && path.includes('calendar') ? 'active' : null
            }`}>
            <Link
              href={`${data?.user?.role_id === "8" ? "/Expert" : "/Physician"}/calendar`}
              // href="/Physician/calendar" 

              className="block c-lsidebar-item">
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              My Calendar
            </Link>
          </div>
          <div className={`c-lsidebar-item-wrap ${path.includes('paymenthistorymanagement') ? 'active' : null
            }`}>
            <Link
              href={`${data?.user?.role_id === "8" ? "/Expert" : "/Physician"}/paymenthistorymanagement`}
              //  href="/Physician/paymenthistorymanagement"
              className="block c-lsidebar-item"
            >
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Payment History
            </Link>
          </div>
          <div
            className={`c-lsidebar-item-wrap ${path.includes('caserequest') ? 'active' : null
              }`}
          >
            <Link
              href={`${data?.user?.role_id === "8" ? "/Expert" : "/Physician"}/caserequest`}
              //href="/Physician/caserequest" 
              className="block c-lsidebar-item">
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Case Review Deposition
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default LeftNav;
