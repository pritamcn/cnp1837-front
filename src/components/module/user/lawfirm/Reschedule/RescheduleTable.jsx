'use client';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import previcon from '../../../../../assets/images/icons/table-grey-prev-icon.svg';
import nexticon from '../../../../../assets/images/icons/table-grey-next-icon.svg';
import soliddownicon from '../../../../../assets/images/icons/grey-solid-down-icon.svg';
import editactionbtn from '../../../../../assets/images/icons/edit-action-btn.svg';
import previewcaseicon from '../../../../../assets/images/icons/preview-case-icon.svg';
import AscendingIcon from '../../../../../assets/images/case-management/ascending-icon.svg';
import DecendingIcon from '../../../../../assets/images/case-management/decending-icon.svg';
import Link from 'next/link';
import RescheduleSearchbar from './RescheduleSearchbar';
import useSWR from 'swr';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import { getFormattedDate, minuteextractor } from '@/helpers/mischelper';
import Loader from '../Loader';
const RescheduleTable = () => {
  const axiosAuth = useAxiosAuth();
  const [cancellist, setcancellist] = useState([]);
  const [cancelcount, setcancelcount] = useState(0);
  const [startpagecount, setstartpagecount] = useState(1);
  const [endpagecount, setendpagecount] = useState(10);
  const [row, setrow] = useState(false);
  const [rowvalue, setrowvalue] = useState(10);
  const [searchvalue, setSearchvalue] = useState('');
  const [startdatevalue, setstartdatevalue] = useState('');
  const [enddatevalue, setenddatevalue] = useState('');
  const [status, setstatus] = useState(3);
  const [sortName, setSortName] = useState('request_time');
  const [asc, setAsc] = useState('asc');
  const [cancelid, setcancelid] = useState("");
  const [modalstatus, setmodalstatus] = useState('');
  const { data: getcanceldata, isLoading } = useSWR(
    [
      `/case/getCancelRescheduleInviteeListForAttorney?search=${searchvalue}&startCount=${startpagecount}&endCount=${endpagecount}&start_date=${startdatevalue}&end_date=${enddatevalue}&status=${status}&sort_name=${sortName}&sort_order=${asc}`,
      axiosAuth,
    ],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );
  useEffect(() => {
    if (getcanceldata?.status === 200 && getcanceldata?.data?.data?.length > 0) {
      setcancellist(getcanceldata?.data?.data);
      // setcancelcount(21)
      setcancelcount(getcanceldata?.data?.totalCount);
    }
    if (getcanceldata?.status === 200 && getcanceldata?.data?.data?.length === 0) {
      setcancellist([]);
      setcancelcount(0);
    }
  }, [getcanceldata]);
  const handleSearchvalue = (value) => {
    if (value?.searchcondition === true) {
      setSearchvalue(value?.search);
      setenddatevalue('');
      setstartdatevalue('');
      setstatus(3);
    } else {
      setenddatevalue(
        value?.enddate === '' ? '' : getFormattedDate(value?.enddate)
      );
      setstartdatevalue(
        value?.startdate === '' ? '' : getFormattedDate(value?.startdate)
      );
      setstatus(value?.status);
      setSearchvalue('');
    }
    setstartpagecount(1);
    setendpagecount(rowvalue);
    setSortName('request_time');
    setAsc('asc');
  }
  const handleprev = () => {
    if (startpagecount < cancelcount - rowvalue && startpagecount !== 1) {
      setstartpagecount((prev) => prev - rowvalue);
      setendpagecount((prev) => prev - rowvalue);
      window.scroll(40, 40)
    } else if (startpagecount < cancelcount || startpagecount === cancelcount) {
      let temppagecount = startpagecount - rowvalue;
      let temppage2count = temppagecount + (rowvalue - 1);
      setstartpagecount(temppagecount);
      setendpagecount(temppage2count);
      window.scroll(40, 40)
    }
  };
  const handlenext = () => {
    if (endpagecount < cancelcount - rowvalue) {
      setstartpagecount((prev) => prev + rowvalue);
      setendpagecount((prev) => prev + rowvalue);
      window.scroll(40, 20)
    } else if (endpagecount < cancelcount) {
      setstartpagecount((prev) => prev + rowvalue);
      setendpagecount(cancelcount);
      window.scroll(40, 20)
    }
  };
  const handleRow = (number) => {
    setrowvalue(number);
    setstartpagecount(1);
    setendpagecount(number);
    setrow(false);
  };
  const handlesort = (sort, condition) => {
    setAsc(condition);
    setSortName(sort);
    setstartpagecount(1);
    setendpagecount(rowvalue);
  };
  const handlechange = () => {
    setmodalstatus("")
  }
  const handleview = (value) => {
    setmodalstatus(value?.status)
    setcancelid(item?.id)
  }
  return (
    <>
      {isLoading || getcanceldata === undefined ?
        <Loader />
        :
        <div className='m-card p-5'>
          <RescheduleSearchbar handleSearchvalue={handleSearchvalue} />
          <div className='m-card-table'>
            <div className='c-table'>
              <div className="overflow-visible">
                <table className="table w-full">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Actions</th>
                      <th>
                        Case No
                        <button
                          className="ml-1"
                          type="button"
                          onClick={() => handlesort('case_number', 'asc')}
                        >
                          <span
                            className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'case_number' && asc === 'asc'
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
                          onClick={() => handlesort('case_number', 'desc')}
                        >
                          <span
                            className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'case_number' && asc === 'desc'
                                ? 'bg-blue-200'
                                : null
                              }`}
                          >
                            <Image src={DecendingIcon} alt="Decending icon" />
                          </span>
                        </button>
                      </th>
                      <th>Deposition No
                        <button
                          className="ml-1"
                          type="button"
                          onClick={() => handlesort('deposition_number', 'asc')}
                        >
                          <span
                            className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'deposition_number' && asc === 'asc'
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
                          onClick={() => handlesort('deposition_number', 'desc')}
                        >
                          <span
                            className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'deposition_number' && asc === 'desc'
                                ? 'bg-blue-200'
                                : null
                              }`}
                          >
                            <Image src={DecendingIcon} alt="Decending icon" />
                          </span>
                        </button>

                      </th>
                      <th>Date
                        <button
                          className="ml-1"
                          type="button"
                          onClick={() => handlesort('request_time', 'asc')}
                        >
                          <span
                            className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'request_time' && asc === 'asc'
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
                          onClick={() => handlesort('request_time', 'desc')}
                        >
                          <span
                            className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'request_time' && asc === 'desc'
                                ? 'bg-blue-200'
                                : null
                              }`}
                          >
                            <Image src={DecendingIcon} alt="Decending icon" />
                          </span>
                        </button>

                      </th>
                      <th>Time</th>
                      <th>Created by</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cancellist?.length > 0 ?
                      cancellist?.map((item, i) => (
                        <tr key={i}>
                          <td>
                            <div className="flex items-center gap-2">
                              <div
                                className="tooltip text-left"
                                data-tip="View"
                              >
                                <div
                                  onClick={() => handleview(item)}
                                >
                                  <Image src={previewcaseicon} alt="" />
                                </div>
                              </div>
                              {item?.changeable &&
                                <div
                                  className="tooltip text-left"
                                  data-tip="Edit"
                                >
                                  <Link
                                    href="#"
                                  >
                                    <Image src={editactionbtn} alt="" />
                                  </Link>
                                </div>

                              }

                            </div>
                          </td>
                          <td>{item?.case_number}</td>
                          <td>{item?.deposition_number}</td>
                          <td>{getFormattedDate(item?.request_time)}</td>
                          <td>{minuteextractor(item?.request_time)}</td>
                          <td>
                            {item?.request_creator_full_name}({item?.request_creator_role_name})
                          </td>
                          <td>
                            <span
                              className={`${item?.status === '1'
                                ? 'text-accept'
                                : 'text-decline'
                                }`}
                            >
                              {
                                item?.status === '2'
                                  ? 'Refund'
                                  : item?.status === '1'
                                    ? 'Reschedule '
                                    : item?.status === '0' && 'Canceled'}
                            </span>
                          </td>
                        </tr>
                      )) :
                      <tr>
                        <td colSpan={6} className="p-0">
                          Sorry no data found
                        </td>
                      </tr>

                    }

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
      {/* Pagination start */}
      {cancelcount > 10 && (
        <div className="table-meta-wrap">
          {cancelcount > 19 && (
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

                    {cancelcount > 49 && (
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
              {startpagecount}-{endpagecount} of {cancelcount}
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
              disabled={endpagecount === cancelcount}
              onClick={handlenext}
            >
              <Image src={nexticon} alt="" />
            </button>
          </div>
        </div>
      )}
      {/* Pagination end */}
      {/* {modalstatus !== '' && (
        <Depositioncancelandreschedulemodal
          status={modalstatus}
          handlechange={handlechange}
          id={cancelid}
          axiosAuth={axiosAuth}
        />
      )} */}
    </>
  )
}

export default RescheduleTable