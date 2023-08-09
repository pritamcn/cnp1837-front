'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import sitelogo from '../../../../assets/images/site-logo.png';
import notifyicon from '../../../../assets/images/icons/notification-icon.svg';
import userimgplaceholder from '../../../../assets/images/user-img-placeholder.png';
import downicon from '../../../../assets/images/icons/chevron-down-icon.svg';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { imagePath } from '@/config';
import NotificationOutsideComponent from './NotificationOutsideComponent';
const Header = () => {
  const path = usePathname();
  const { data } = useSession();
  const [drop, setdrop] = useState(false);
  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: '/' });
    setdrop(false);
    sessionStorage.clear()
  };
  return (
    <header className="c-header fixed bg-white w-full z-30 top-0 left-0 border-b border-gray-200 dark:border-gray-600 ">
      <nav className="nav-main container">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
          <Link href="/" className="flex items-center">
            <Image className="h-8 w-auto" src={sitelogo} alt="" />
          </Link>

          <div className="flex md:order-2">
            {data === null ? (
              <>
                <Link
                  href="/Signin"
                  className={`primary-btn ${
                    path !== '/Signin' ? 'btn-outline' : null
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/Signup"
                  className={`primary-btn ml-2.5 ${
                    path !== '/Signup' ? 'btn-outline' : null
                  }`}
                >
                  Register
                </Link>
              </>
            ) : (
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
                          {path !== '/Success' && (
                            <li className="focus:!bg-transparent active:!bg-transparent hover:!bg-transparent focus:!text-[#001725] active:!text-[#001725] hover:!text-[#001725]">
                              <Link
                                className="p-0 focus:!bg-transparent active:!bg-transparent hover:!bg-transparent focus:!text-[#001725] active:!text-[#001725] hover:!text-[#001725]"
                                href="/Success"
                              >
                                Main Page
                              </Link>
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="navbar flex flex-col p-4 md:p-0 mt-4 font-medium md:flex-row md:space-x-10 md:mt-0 md:border-0">
              <li>
                <Link
                  href="/"
                  className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Services
                </Link>
              </li>
              {data === null && (
                <li>
                  <Link
                    href="/membersubscription"
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Membership Subscription
                  </Link>
                </li>
              )}

              <li>
                <Link
                  href="/individualdepocost"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Individual Depo Cost
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
