'use client';
import React, { useState, useEffect } from 'react';
import previcon from '../../../../../assets/images/icons/table-grey-prev-icon.svg';
import nexticon from '../../../../../assets/images/icons/table-grey-next-icon.svg';
import soliddownicon from '../../../../../assets/images/icons/grey-solid-down-icon.svg';
import Image from 'next/image';
import Link from 'next/link';
import NotificationSearchbar from './NotificationSearchbar';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import {
  WithTokenGetApi,
  WithTokenTriggerGetApi,
} from '@/services/module/api/getapi';
import useSWR from 'swr';
import Loader from '../Loader';
import { getFormattedDate, minuteextractor } from '@/helpers/mischelper';
import AscendingIcon from '../../../../../assets/images/case-management/ascending-icon.svg';
import DecendingIcon from '../../../../../assets/images/case-management/decending-icon.svg';
import { useSession } from 'next-auth/react';
import useSWRMutation from 'swr/mutation';
const NotificationManagementtable = () => {
  const axiosAuth = useAxiosAuth();
  const [notificationlist, setnotificationlist] = useState([]);
  const { data } = useSession();
  const [notificationcount, setnotificationcount] = useState(0);
  const [startpagecount, setstartpagecount] = useState(1);
  const [endpagecount, setendpagecount] = useState(10);
  const [row, setrow] = useState(false);
  const [rowvalue, setrowvalue] = useState(10);
  const [searchvalue, setSearchvalue] = useState('');
  const [startdatevalue, setstartdatevalue] = useState('');
  const [enddatevalue, setenddatevalue] = useState('');
  const [status, setstatus] = useState(2);
  const [sortName, setSortName] = useState('created_at');
  const [asc, setAsc] = useState('DESC');
  const {
    data: notificationData,
    error,
    isLoading: getdataLoading,
    mutate,
  } = useSWR(
    [
      `/notification/getReceivedNotificationsList?order=${asc}&startDate=${startdatevalue}&endDate=${enddatevalue}&purpose=${status}&startCount=${startpagecount}&endCount=${endpagecount}`,
      axiosAuth,
    ],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );
  const {
    trigger: notificationtrigger,
    data: getnotificationdata,
    error: notificationionerror,
  } = useSWRMutation(
    `/notification/updateNotification`,
    WithTokenTriggerGetApi
  );
  useEffect(() => {
    if (notificationData?.status === 200) {
      setnotificationlist(notificationData?.data?.list);
      setnotificationcount(notificationData?.data?.totalCount);
    }
  }, [notificationData]);
  const handlesort = (sort, condition) => {
    setAsc(condition);
    setSortName(sort);
    setstartpagecount(1);
    setendpagecount(rowvalue);
  };
  const handleSearchvalue = (value) => {
    setenddatevalue(
      value?.enddate === '' ? '' : getFormattedDate(value?.enddate)
    );
    setstartdatevalue(
      value?.startdate === '' ? '' : getFormattedDate(value?.startdate)
    );
    setstatus(value?.status);
    setSearchvalue('');
    setstartpagecount(1);
    setendpagecount(rowvalue);
    setSortName('created_at');
    setAsc('DESC');
  };
  const handleRow = (number) => {
    setrowvalue(number);
    setstartpagecount(1);
    setendpagecount(number);
    setrow(false);
  };
  const handleprev = () => {
    if (startpagecount < notificationcount - rowvalue && startpagecount !== 1) {
      setstartpagecount((prev) => prev - rowvalue);
      setendpagecount((prev) => prev - rowvalue);
      window.scroll(40, 40);
    } else if (
      startpagecount < notificationcount ||
      startpagecount === notificationcount
    ) {
      let temppagecount = startpagecount - rowvalue;
      let temppage2count = temppagecount + (rowvalue - 1);
      setstartpagecount(temppagecount);
      setendpagecount(temppage2count);
      window.scroll(40, 40);
    }
  };

  const handlenext = () => {
    if (endpagecount < notificationcount - rowvalue) {
      setstartpagecount((prev) => prev + rowvalue);
      setendpagecount((prev) => prev + rowvalue);
    } else if (endpagecount < notificationcount) {
      setstartpagecount((prev) => prev + rowvalue);
      setendpagecount(notificationcount);
    }
  };
  let handleclick = (id, condition) => {
    if (!condition) {
      notificationtrigger({
        id,
        axios: axiosAuth,
      });
    }
  };
  return (
    <>
      <div className="m-card p-5">
        <NotificationSearchbar
          handleSearchvalue={handleSearchvalue}
          data={data}
        />

        <div className="m-card-table">
          <div className="c-table overflow-auto">
            <div className="overflow-visible">
              <table className="table w-full">
                {/* head */}
                <thead>
                  <tr>
                    <th className="w-2/12">
                      Date
                      <button
                        className="ml-1"
                        type="button"
                        onClick={() => handlesort('created_at', 'ASC')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${
                          sortName === 'created_at' && asc === 'ASC'
                            ? 'bg-blue-200'
                            : null
                        }`}
                        >
                          <Image src={AscendingIcon} alt="Ascending icon" />
                        </span>
                      </button>
                      <button
                        className="ml-1"
                        type="button"
                        onClick={() => handlesort('created_at', 'DESC')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${
                          sortName === 'created_at' && asc === 'DESC'
                            ? 'bg-blue-200'
                            : null
                        }`}
                        >
                          <Image src={DecendingIcon} alt="Decending icon" />
                        </span>
                      </button>
                    </th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {notificationData === undefined ? (
                    <tr>
                      <td colSpan={6} className="text-center">
                        <Loader />
                      </td>
                    </tr>
                  ) : notificationlist?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center">
                        Sorry no data found
                      </td>
                    </tr>
                  ) : (
                    notificationlist?.map((item, i) => (
                      <tr
                        className={`${
                          !item?.is_read ? 'bg-[#EBF4FD]' : ''
                        } cursor-pointer`}
                        key={i}
                        onClick={() => handleclick(item?.id, item?.is_read)}
                      >
                        <td>
                          <Link
                            href={`${
                              data?.user?.role_id === '6'
                                ? '/AttorneyAssistant'
                                : data?.user?.role_id === '3'
                                ? '/Attorney'
                                : data?.user?.role_id === '4'
                                ? '/Physician'
                                : data?.user?.role_id === '5'
                                ? '/CourtReporter'
                                : 'Expert'
                            }/${item?.link}`}
                          >
                            {getFormattedDate(item?.created_at)}&nbsp;
                            {minuteextractor(item?.created_at)}
                          </Link>
                        </td>
                        <td className="whitespace-normal">
                          <Link
                            href={`${
                              data?.user?.role_id === '6'
                                ? '/AttorneyAssistant'
                                : data?.user?.role_id === '3'
                                ? '/Attorney'
                                : data?.user?.role_id === '4'
                                ? '/Physician'
                                : data?.user?.role_id === '5'
                                ? '/CourtReporter'
                                : 'Expert'
                            }/${item?.link}`}
                          >
                            {item?.title} {item?.purpose === 'Case Edit'
                                ? 'Click here to edit case '
                                : item?.purpose === 'Case Request'
                                ? 'Click here to check in case request list'
                                : item?.purpose === 'Deposition Edit'
                                ? 'Click here to edit deposition'
                                : item?.purpose === 'Deposition Request'
                                ? 'Click here to check in deposition request list'
                                : item?.purpose === 'Cancellation & Refund'
                                ? 'Click here to check in cancellation & refund list'
                                : item?.purpose === 'Payment History'
                                ? 'Click here to check in payment history list'
                                : item?.purpose === 'Transcript'
                                ? 'Click here to check details'
                                : item?.purpose === 'Deposition List'
                                ? 'Click here to check in deposition list'
                                : item?.purpose === 'Zoom Link' &&
                                  item?.purpose?.includes !== 'had a zoom call'
                                ? 'Click here to join'
                                : 'Click here to check details'}
                           
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination start */}
      {notificationcount > 10 && (
        <div className="table-meta-wrap">
          {notificationcount > 19 && (
            <div className="meta-row-count">
              <span className="meta-label">Rows per page:</span>
              <div className="select-dropdown">
                <button
                  role="button"
                  data-value=""
                  className="select-dropdown__button active"
                  onClick={() => setrow(!row)}
                >
                  <span>{rowvalue}</span>
                  <Image
                    src={soliddownicon}
                    className="i-chevron-down"
                    alt=""
                  />
                </button>
                {row && (
                  <ul className="select-dropdown__list active">
                    <li
                      data-value="1"
                      className="select-dropdown__list-item"
                      onClick={() => handleRow(10)}
                    >
                      10
                    </li>
                    <li
                      data-value="2"
                      className="select-dropdown__list-item"
                      onClick={() => handleRow(20)}
                    >
                      20
                    </li>

                    {notificationcount > 49 && (
                      <li
                        data-value="3"
                        className="select-dropdown__list-item"
                        onClick={() => handleRow(50)}
                      >
                        50
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          )}

          <div className="table-pagination">
            <span className="table-pagination-text">
              {startpagecount}-{endpagecount} of {notificationcount}
            </span>
            <button
              className="table-pagination-prev"
              onClick={handleprev}
              disabled={startpagecount === 1}
            >
              <Image src={previcon} alt="" />
            </button>
            <button
              className="table-pagination-next"
              disabled={endpagecount === notificationcount}
              onClick={handlenext}
            >
              <Image src={nexticon} alt="" />
            </button>
          </div>
        </div>
      )}
      {/* Pagination end */}
    </>
  );
};

export default NotificationManagementtable;
