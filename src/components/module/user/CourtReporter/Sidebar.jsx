'use client';
import React from 'react';
import Dashboardicon from '../../../../assets/images/icons/dashboard-dark-icon.svg';
import Usermanageicon from '../../../../assets/images/icons/user-manag-icon.svg';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const LeftNav = () => {
  const path = usePathname();
  return (
    <div className="c-lsidebar h-[100vh] flex-[0_0_16rem] overflow-auto">
      <div className="flex c-lsidebar-wrap h-full">
        <nav className="flex flex-col items-center c-lsidebar-nav">
          <div
            className={`c-lsidebar-item-wrap ${path === '/CourtReporter/dashboard' ? 'active' : null
              }`}
          >
            <Link
              href="/CourtReporter/dashboard"
              className="block c-lsidebar-item"
            >
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Dashboard
            </Link>
          </div>
          <div
            className={`c-lsidebar-item-wrap ${path.includes('/CourtReporter/accountsettings') ? 'active' : null
              }`}
          >
            <Link
              href="/CourtReporter/accountsettings"
              className="block c-lsidebar-item"
            >
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Account Settings
            </Link>
          </div>
          <div className={`c-lsidebar-item-wrap ${path.includes('/CourtReporter/depositionmanagement') ? 'active' : null
            }`}>
            <Link href="/CourtReporter/depositionmanagement" className="block c-lsidebar-item">
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Deposition Requests & Scheduling
            </Link>
          </div>
          <div className={`c-lsidebar-item-wrap ${path.includes('/CourtReporter/transcripts') ? 'active' : null
            }`}>
            <Link href="/CourtReporter/transcripts" className="block c-lsidebar-item">
              <span className="block">
                <Image src={Usermanageicon} alt="" />
              </span>
              Transcripts
            </Link>
          </div>
          <div className={`c-lsidebar-item-wrap ${path.includes('/CourtReporter/commissionmanagement') ? 'active' : null
            }`}>
            <Link href="/CourtReporter/commissionmanagement" className="block c-lsidebar-item">
              <span className="block">
                <Image src={Usermanageicon} alt="" />
              </span>
              Download Commission Management
            </Link>
          </div>
          <div className={`c-lsidebar-item-wrap ${path.includes('/CourtReporter/cancellationandrefund')
            ? 'active'
            : null
            }`}>
            <Link href="/CourtReporter/cancellationandrefund" className="block c-lsidebar-item">
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Cancellations & Refunds
            </Link>
          </div>
          <div className={`c-lsidebar-item-wrap ${path.includes('/CourtReporter/notificationmanagement') ? 'active' : null
            }`}>
            <Link href="/CourtReporter/notificationmanagement" className="block c-lsidebar-item">
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              Alerts & Notifications
            </Link>
          </div>
          <div className={`c-lsidebar-item-wrap ${path.includes('/CourtReporter/calendar') ? 'active' : null
            }`}>
            <Link href="/CourtReporter/calendar" className="block c-lsidebar-item">
              <span className="block">
                <Image src={Dashboardicon} alt="" />
              </span>
              My Calendar
            </Link>
          </div>
          <div className={`c-lsidebar-item-wrap ${path.includes('/CourtReporter/paymenthistorymanagement') ? 'active' : null
            }`}>
            <Link
              href="/CourtReporter/paymenthistorymanagement"
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
