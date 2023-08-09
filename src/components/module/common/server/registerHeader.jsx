import Image from 'next/image';
import React from 'react';
import sitelogo from './../../../../assets/images/site-logo.png';
import Link from 'next/link';
import HeaderNotification from '../client/HeaderNotification';
const RegisterHeader = () => {
  return (
    <header className="c-header logged-in fixed bg-white w-full z-50 top-0 left-0">
      <nav className="nav-main container-fluid">
        <div className="flex flex-wrap items-center justify-start mx-auto">
          <div className="c-header-logo me-[7rem]">
            <Link href="/" className="flex items-center">
              <Image className="h-8 w-auto" src={sitelogo} alt="" />
            </Link>
          </div>
          <HeaderNotification />
        </div>
      </nav>
    </header>
  );
};

export default RegisterHeader;
