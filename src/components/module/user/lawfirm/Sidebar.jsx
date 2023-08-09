'use client';
import React from 'react';
import Dashboardicon from '../../../../assets/images/icons/dashboard-dark-icon.svg';
import Attendmanageicon from '../../../../assets/images/icons/attend-mng-icon.svg';
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
            href={`${data?.user?.role_id === "6" ? "/AttorneyAssistant" : "/Attorney"}/dashboard`}
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
            href={`${data?.user?.role_id === "6" ? "/AttorneyAssistant" : "/Attorney"}/accountsettings`}
              className="block c-lsidebar-item"
            >
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Account Settings
            </Link>
          </div>
          {data?.user?.role_id !=="6" && 
            <div
            className={`c-lsidebar-item-wrap ${path.includes('usermanagement') ? 'active' : null
              }`}
          >
            <Link 
            href={`/Attorney/usermanagement`}
            className="block c-lsidebar-item">
              <span className="block">
                <Image src={Usermanageicon} alt="" />
              </span>
              User Management
            </Link>
          </div>
          }
        
          <div
            className={`c-lsidebar-item-wrap ${path.includes('casemanagement') ? 'active' : null
              }`}
          >
            <Link
            href={`${data?.user?.role_id === "6" ? "/AttorneyAssistant" : "/Attorney"}/casemanagement`}
            // href="/Attorney/casemanagement"
             className="block c-lsidebar-item">
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Case Management
            </Link>
          </div>
          <div className={`c-lsidebar-item-wrap ${path.includes('mydepositionlistmanagement')
            ? 'active'
            : null
            }`}>
            <Link
            href={`${data?.user?.role_id === "6" ? "/AttorneyAssistant" : "/Attorney"}/mydepositionlistmanagement`}
              className="block c-lsidebar-item"
            >
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              My Deposition
            </Link>
          </div>
          <div
            className={`c-lsidebar-item-wrap ${path.includes('depositionmanagement') ? 'active' : null
              }`}
          >
            <Link
            href={`${data?.user?.role_id === "6" ? "/AttorneyAssistant" : "/Attorney"}/depositionmanagement`}
              className="block c-lsidebar-item"
            >
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Deposition Requests
            </Link>
          </div>

          {/* <div className={`c-lsidebar-item-wrap ${
              path.includes('/Attorney/rescheduleandrefunds') ? 'active' : null
            }`}>
            <Link href="/Attorney/rescheduleandrefunds" className="block c-lsidebar-item">
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Cancellation and Rescheduling Request
            </Link>
          </div> */}
          <div className={`c-lsidebar-item-wrap ${path.includes('caserequest') ? 'active' : null
            }`}>
            <Link 
            href={`${data?.user?.role_id === "6" ? "/AttorneyAssistant" : "/Attorney"}/caserequest`}
             className="block c-lsidebar-item">
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Case Requests
            </Link>
          </div>

          <div className={`c-lsidebar-item-wrap ${path.includes('cancellationandrefund')
            ? 'active'
            : null
            }`}>
            <Link 
            href={`${data?.user?.role_id === "6" ? "/AttorneyAssistant" : "/Attorney"}/cancellationandrefund`}
           className="block c-lsidebar-item">
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Cancellations & Refunds
            </Link>
          </div>

          <div
            className={`c-lsidebar-item-wrap ${path.includes('notificationmanagement')
              ? 'active'
              : null
              }`}
          >
            <Link
            href={`${data?.user?.role_id === "6" ? "/AttorneyAssistant" : "/Attorney"}/notificationmanagement`}
              className="block c-lsidebar-item"
            >
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Alerts & Notifications
            </Link>
          </div>
          <div
            className={`c-lsidebar-item-wrap ${path.includes('calendar')
              ? 'active'
              : null
              }`}
          >
            <Link
            href={`${data?.user?.role_id === "6" ? "/AttorneyAssistant" : "/Attorney"}/calendar`}
              className="block c-lsidebar-item"
            >
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              My Calendar
            </Link>
          </div>

          <div
            className={`c-lsidebar-item-wrap ${path.includes('paymenthistorymanagement')
              ? 'active'
              : null
              }`}
          >
            <Link 
             href={`${data?.user?.role_id === "6" ? "/AttorneyAssistant" : "/Attorney"}/paymenthistorymanagement`}
              className="block c-lsidebar-item"
            >
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Payment History
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default LeftNav;
