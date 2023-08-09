'use client';
import Image from 'next/image';
import userimgplaceholder from '../../../../assets/images/user-img-placeholder.png';
import downicon from '../../../../assets/images/icons/chevron-down-icon.svg';
import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { imagePath } from '@/config';
import Link from 'next/link';

import NotificationOutsideComponent from './NotificationOutsideComponent';
const HeaderNotification = () => {
  const { data } = useSession();
  const [drop, setdrop] = useState(false);
  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: '/' });
    setdrop(false);
    sessionStorage.clear()
  };
 
  
  return (
    <div className="flex md:order-2 ms-[auto]">
      <div className="c-loggedin-header">
        <NotificationOutsideComponent data={data}/>
       
        <div className="c-loggedin-user">
          <div className="c-user-img">
            <Image
              src={
                data?.user?.profile_image !== 'null'
                  ? imagePath + data?.user?.profile_image
                  : userimgplaceholder
              }
              width={500}
              height={500}
              alt=""
            />
          </div>
          <div className="c-user-dropdown">
            <div className="dropdown dropdown-bottom dropdown-end">
              <div>
                <label tabIndex={0} className="c-user-dropdown-label">
                  <button className="username">
                    {data?.user?.first_name} {data?.user?.last_name}
                  </button>
                  <span className="down-arrow">
                    <Image
                      src={downicon}
                      onClick={() => setdrop(!drop)}
                      alt=""
                    />
                  </span>
                </label>
              </div>

              {drop && (
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li
                    className="p-1 focus:!bg-transparent active:!bg-transparent hover:!bg-transparent focus:!text-[#001725] active:!text-[#001725] hover:!text-[#001725]"
                    onClick={() => handleLogout()}
                  >
                    Log out
                  </li>
                  <li className="focus:!bg-transparent active:!bg-transparent hover:!bg-transparent focus:!text-[#001725] active:!text-[#001725] hover:!text-[#001725]">
                    <Link
                      className="p-0 focus:!bg-transparent active:!bg-transparent hover:!bg-transparent focus:!text-[#001725] active:!text-[#001725] hover:!text-[#001725]"
                      href="/"
                    >
                      Home
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      <button
        data-collapse-toggle="navbar-sticky"
        type="button"
        className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        aria-controls="navbar-sticky"
        aria-expanded="false"
      >
        <span className="sr-only">Open main menu</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default HeaderNotification;
