'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import previcon from '../../../../../assets/images/icons/table-grey-prev-icon.svg';
import nexticon from '../../../../../assets/images/icons/table-grey-next-icon.svg';
import soliddownicon from '../../../../../assets/images/icons/grey-solid-down-icon.svg';
import previewcaseicon from '../../../../../assets/images/icons/preview-case-icon.svg';
import MoreVeticalIcon from '../../../../../assets/images/chat/more-vertical-icon.svg';
import {
  WithTokenGetApi,
} from '@/services/module/api/getapi';
import useSWR from 'swr';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import AscendingIcon from '../../../../../assets/images/case-management/ascending-icon.svg';
import DecendingIcon from '../../../../../assets/images/case-management/decending-icon.svg';
import CaseReviewSearch from '../../Physician/CaseReviewDeposition/CaseReviewSearch';
import { useSession } from 'next-auth/react';
import moment from 'moment';
import CaseReviewDetailsModal from '../../Physician/Modal/CaseReviewDetailsModal';
import Loader from '../Loader';

const CaseRequestTable = () => {
  const { data: session, update } = useSession();
  const axiosAuth = useAxiosAuth();
  const [caselist, setcaselist] = useState([]);
  const [casecount, setcasecount] = useState(0);
  const [startpagecount, setstartpagecount] = useState(1);
  const [endpagecount, setendpagecount] = useState(10);
  const [row, setrow] = useState(false);
  const [rowvalue, setrowvalue] = useState(10);
  const [searchvalue, setSearchvalue] = useState('');
  const [sortName, setSortName] = useState('created_at');
  const [asc, setAsc] = useState('DESC');
  const [casemodal, setcasemodal] = useState('');
  const [startdatevalue, setstartdatevalue] = useState('');
  const [enddatevalue, setenddatevalue] = useState('');

  const { data: getcasedata, isLoading } = useSWR(
    [
      `/getDepoRequestListByUserId/${session?.user?.id}?search=${searchvalue}&startCount=${startpagecount}&endCount=${endpagecount}&sort_order=${asc}&sort_name=${sortName}&startDate=${startdatevalue}&endDate=${enddatevalue}`,
      axiosAuth,
    ],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (getcasedata?.status === 200 && getcasedata?.data?.list?.length > 0) {
      setcaselist(getcasedata?.data?.list);
      setcasecount(getcasedata?.data?.totalCount);
    }
    if (getcasedata?.status === 200 && getcasedata?.data?.data?.length === 0) {
      setcaselist([]);
      setcasecount(0);
    }
  }, [getcasedata]);

  const handleRow = (number) => {
    setrowvalue(number);
    setstartpagecount(1);
    setendpagecount(number);
    setrow(false);
  };

  const handleprev = () => {
    if (startpagecount < casecount - rowvalue && startpagecount !== 1) {
      setstartpagecount((prev) => prev - rowvalue);
      setendpagecount((prev) => prev - rowvalue);
      window.scroll(40, 40);
    } else if (startpagecount < casecount || startpagecount === casecount) {
      let temppagecount = startpagecount - rowvalue;
      let temppage2count = temppagecount + (rowvalue - 1);
      setstartpagecount(temppagecount);
      setendpagecount(temppage2count);
      window.scroll(40, 40);
    }
  };

  const handlenext = () => {
    if (endpagecount < casecount - rowvalue) {
      setstartpagecount((prev) => prev + rowvalue);
      setendpagecount((prev) => prev + rowvalue);
    } else if (endpagecount < casecount) {
      setstartpagecount((prev) => prev + rowvalue);
      setendpagecount(casecount);
    }
  };

  const searchHandler = (value) => {
    setstartdatevalue(value?.startcalendarvalue ? moment(value?.startcalendarvalue).format('YYYY-MM-DD') : '');
    setenddatevalue(value?.endcalendarvalue ? moment(value?.endcalendarvalue).format('YYYY-MM-DD') : '');
    setSearchvalue(value?.searchValue);
  }

  const handlesort = (sort, condition) => {
    setAsc(condition);
    setSortName(sort);
    setstartpagecount(1);
    setendpagecount(rowvalue);
  };

  const handlemodal = (id) => {
    setcasemodal(id);
  }

  const handlechange = () => {
    setcasemodal('');
  }

  return (
    <>
      <div className='m-card p-5'>
        <form action="">
          <div className='m-card-search mb-4'>
            <CaseReviewSearch searchHandler={searchHandler} />
          </div>
        </form>
        <div className='m-card-table'>
          <div className='c-table'>
            <div className="overflow-visible">
              <table className="table w-full">
                {/* head */}
                <thead>
                  <tr>
                    <th className='w-1/6'>Action</th>
                    <th className='w-2/12'>Case Name
                      <button
                        className="ml-1"
                        type="button"
                        onClick={() => handlesort('case_name', 'ASC')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'case_name' && asc === 'ASC'
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
                        onClick={() => handlesort('case_name', 'DESC')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'case_name' && asc === 'DESC'
                              ? 'bg-blue-200'
                              : null
                            }`}
                        >
                          <Image src={DecendingIcon} alt="Decending icon" />
                        </span>
                      </button>
                    </th>
                    <th className='w-1/6'>Defendant Lawyers</th>
                    <th className='w-1/6'>Plaintiff Lawyers</th>
                    <th className='w-1/6'>Request Time
                      <button
                        className="ml-1"
                        type="button"
                        onClick={() => handlesort('created_at', 'ASC')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'created_at' && asc === 'ASC'
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
                        ${sortName === 'created_at' && asc === 'DESC'
                              ? 'bg-blue-200'
                              : null
                            }`}
                        >
                          <Image src={DecendingIcon} alt="Decending icon" />
                        </span>
                      </button>
                    </th>
                  </tr>
                </thead>
                {isLoading || getcasedata === undefined ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      <Loader />
                    </td>
                  </tr>) :
                  <tbody>
                    {caselist?.length > 0 ? (caselist.map((item, index) => {
                      let caseName = item?.case_name ? item?.case_name.toLowerCase().split(' vs ') : '--';
                      return <tr key={index}>
                        <td>

                          <details className="dropdown">
                            <summary
                              className="btn !bg-transparent !rounded-none !h-auto outline-none !min-h-0 !p-0 !pr-0 tooltip normal-case"
                              data-tip="More"
                            >
                              <i className="w-[1.125rem] flex items-center justify-center">
                                <Image
                                  src={MoreVeticalIcon}
                                  alt="More vetical icon"
                                  className="w-full h-auto"
                                />
                              </i>
                            </summary>
                            <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box">
                              <li className="!p-0 focus:!bg-transparent active:!bg-transparent">
                                <div className="items-center !p-0">

                                  <div className="tooltip text-left" data-tip="View">
                                    {/* <button className="w-12 overflow-hidden flex items-center justify-center p-3"> */}
                                    <a>
                                      <label className="w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem]" htmlFor='reviewmodal' onClick={() =>
                                        handlemodal(
                                          item?.id,
                                          item?.status
                                        )
                                      }>
                                        <Image src={previewcaseicon} alt="" />
                                      </label>
                                    </a>
                                    {/* </button> */}
                                  </div>

                                </div>
                              </li>
                            </ul>
                          </details>

                        </td>
                        <td>
                          {typeof caseName == 'string' ? caseName : <>{caseName[0]}
                            <span className="block">vs</span>
                            {caseName[1]}</>}
                        </td>
                        <td>
                          {item?.defendant_lawyers.length > 0 && item?.defendant_lawyers[0]?.email}
                          <div className="dropdown dropdown-bottom dropdown-end">
                            <label tabIndex="0" className="attend-count">+{item?.defendant_lawyers?.length > 1 ? item?.defendant_lawyers?.length : 0}</label>
                            <ul tabIndex="0" className="dropdown-content menu attend-count-ul">
                              {item?.defendant_lawyers.length > 0 && item?.defendant_lawyers?.map((defendant, i) => {
                                return <li key={i} className='attend-count-li'>
                                  <span className='user-email'>{defendant?.email}</span>
                                </li>
                              })
                              }
                            </ul>
                          </div>
                        </td>
                        <td>
                          {item?.plaintiff_lawyers.length > 0 && item?.plaintiff_lawyers[0]?.email}
                          <div className="dropdown dropdown-bottom dropdown-end">
                            <label tabIndex="0" className="attend-count">+{item?.plaintiff_lawyers?.length > 1 ? item?.plaintiff_lawyers?.length : 0}</label>
                            <ul tabIndex="0" className="dropdown-content menu attend-count-ul">
                              {item?.plaintiff_lawyers.length > 0 && item?.plaintiff_lawyers?.map((plaintiff, i) => {
                                return <li key={i} className='attend-count-li'>
                                  <span className='user-email'>{plaintiff?.email}</span>
                                </li>
                              })
                              }
                            </ul>
                          </div>
                        </td>
                        <td>{item?.created_at ? moment(item?.created_at).format('MM/DD/YYYY HH:MM') : '--'}</td>
                      </tr>
                    })
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center">
                          Sorry no data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                }
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination start */}
      {casecount > 10 && (
        <div className="table-meta-wrap">
          {casecount > 19 && (
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

                    {casecount > 49 && (
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
              {startpagecount}-{endpagecount} of {casecount}
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
              disabled={endpagecount === casecount}
              onClick={handlenext}
            >
              <Image src={nexticon} alt="" />
            </button>
          </div>
        </div>
      )}
      {/* Pagination end */}
      {casemodal !== '' && (
        <CaseReviewDetailsModal
          handlechange={handlechange}
          caseid={casemodal}
          axiosAuth={axiosAuth}
        />
      )}
    </>
  )
}

export default CaseRequestTable;