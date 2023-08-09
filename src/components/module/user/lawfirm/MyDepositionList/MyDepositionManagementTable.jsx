'use client';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import moment from 'moment';
import soliddownicon from '../../../../../assets/images/icons/grey-solid-down-icon.svg';
import previcon from '../../../../../assets/images/icons/table-grey-prev-icon.svg';
import AscendingIcon from '../../../../../assets/images/deposition-request/ascending-icon.svg';
import DecendingIcon from '../../../../../assets/images/deposition-request/decending-icon.svg';
import nexticon from '../../../../../assets/images/icons/table-grey-next-icon.svg';
import editactionbtn from '../../../../../assets/images/icons/edit-action-btn.svg';
import previewcaseicon from '../../../../../assets/images/icons/preview-case-icon.svg';
import MoreVeticalIcon from '../../../../../assets/images/chat/more-vertical-icon.svg';
import CancelReasonModal from '../Modal/CancelReasonModal';
import MyDepositionManagementSearchbar from './MyDepositionManagementSearchbar';
import VideoIcon from '../../../../../assets/images/deposition-requests-and-scheduling/video-call-icon.svg';
import ChatIcon from '../../../../../assets/images/deposition-requests-and-scheduling/chat-icon.svg';
import { durationextractor, getFormattedDate } from '@/helpers/mischelper';
import Link from 'next/link';
import MyDepositionDetailsModal from '../Modal/MyDepositionDetailsModal';
import Loader from '../Loader';
import DownloadIcon from '../../../../../assets/images/deposition-requests-and-scheduling/download-icon.svg';
import CancelIcon from '../../../../../assets/images/my-deposition-list/cancel-icon.svg';
import DownloadTranscriptFile from '../Modal/DownloadTranscriptFile';
import { useSession } from 'next-auth/react';

const MyDepositionManagementTable = () => {
  const axiosAuth = useAxiosAuth();
  const {data}=useSession()
  const [depositionList, setDepositionList] = useState([]);
  const [depocount, setdepocount] = useState(0);

  const [sortName, setSortName] = useState('updated_at');
  const [asc, setAsc] = useState('desc');
  const [startpagecount, setstartpagecount] = useState(1);
  const [endpagecount, setendpagecount] = useState(10);
  const [rowvalue, setrowvalue] = useState(10);
  const [row, setrow] = useState(false);
  const [searchCaseValue, setSearchCaseValue] = useState('');
  const [searchDepoValue, setSearchDepoValue] = useState('');
  const [startdatevalue, setstartdatevalue] = useState('');
  const [enddatevalue, setenddatevalue] = useState('');
  const [downloadDepoId, setDownloadDepoId] = useState('');

  const [cancelModalData, setCancelModalData] = useState({
    isOpen: false,
    depo_id: '',
  });

  const [detailsModalData, setDetailsModalData] = useState({
    depo_id: '',
  });

  const {
    data: depositionData,
    error,
    isLoading: getdataLoading,
    mutate,
  } = useSWR(
    [
      `/case/myDepoCallList?sort_name=${sortName}&sort_order=${asc}&startCount=${startpagecount}&endCount=${endpagecount}&start_date=${startdatevalue}&end_date=${enddatevalue}&case_name=${searchCaseValue}&deponent_name=${searchDepoValue}`,
      axiosAuth,
    ],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (
      depositionData?.status === 200 &&
      depositionData?.data?.data?.length > 0
    ) {
      let modifyData = depositionData?.data?.data.map((item) => {
        return {
          id: item?.id,
          case_no: item?.case?.case_name ? item?.case?.case_name?.toLowerCase()?.split(' vs ') : '--',
          case_id: item?.case_id,
          deponent_name: item?.deponent_name,
          start_time: item?.start_time,
          end_time: item?.end_time,
          duration:
            item.start_time &&
            durationextractor(item.start_time, item?.end_time),
          status: parseInt(item?.status),
          zoom_link: item?.zoom_link,
        };
      });

      setDepositionList(modifyData);
      setdepocount(depositionData?.data?.totalCount);
    }
    if (
      depositionData?.status === 200 &&
      depositionData?.data?.data?.length === 0
    ) {
      setDepositionList([]);
      setdepocount(0);
    }
  }, [depositionData]);

  // Sort handler
  const handlesort = (sort, condition) => {
    setAsc(condition);
    setSortName(sort);
    setstartpagecount(1);
    setendpagecount(rowvalue);
  };

  const handleRow = (number) => {
    setrowvalue(number);
    setstartpagecount(1);
    setendpagecount(number);
    setrow(false);
  };

  const handleprev = () => {
    if (startpagecount < depocount - rowvalue && startpagecount !== 1) {
      setstartpagecount((prev) => prev - rowvalue);
      setendpagecount((prev) => prev - rowvalue);
      window.scroll(40, 40);
    } else if (startpagecount < depocount || startpagecount === depocount) {
      let temppagecount = startpagecount - rowvalue;
      let temppage2count = temppagecount + (rowvalue - 1);
      setstartpagecount(temppagecount);
      setendpagecount(temppage2count);
      window.scroll(40, 40);
    }
  };

  const handlenext = () => {
    if (endpagecount < depocount - rowvalue) {
      setstartpagecount((prev) => prev + rowvalue);
      setendpagecount((prev) => prev + rowvalue);
    } else if (endpagecount < depocount) {
      setstartpagecount((prev) => prev + rowvalue);
      setendpagecount(depocount);
    }
  };

  const handleSearchvalue = (value) => {
    if (value?.searchcondition === true) {
      setSearchCaseValue(value?.casesearch);
      setSearchDepoValue(value?.deposearch);
      setenddatevalue('');
      setstartdatevalue('');
    } else {
      setenddatevalue(
        value?.enddate === '' ? '' : moment(value?.enddate).format('YYYY-MM-DD')
      );
      setstartdatevalue(
        value?.startdate === ''
          ? ''
          : moment(value?.startdate).format('YYYY-MM-DD')
      );
      setSearchCaseValue('');
      setSearchDepoValue('');
    }
    setstartpagecount(1);
    setendpagecount(rowvalue);
    setSortName('case_name');
    setAsc('asc');
  };

  const cancelModalHandler = (depo_id) => {
    setCancelModalData({
      isOpen: true,
      depo_id: depo_id,
    });
  };

  const cancelHandler = () => {
    setCancelModalData({
      ...cancelModalData,
      isOpen: false,
      depo_id: '',
    });
    mutate();
  };

  const detailsModal = (id) => {
    setDetailsModalData({
      ...cancelModalData,
      depo_id: id,
    });
  };

  const closeDetailsHandler = () => {
    setDetailsModalData({
      ...cancelModalData,
      depo_id: '',
    });
  };

  const handleclose = () => {
    setDownloadDepoId('');
    mutate();
  };
  return (
    <>
      <div className="m-card p-5">
        <MyDepositionManagementSearchbar
          handleSearchvalue={handleSearchvalue}
        />
        <div className="m-card-table">
          <div className="c-table overflow-auto">
            <div className="overflow-visible">
              <table className="table w-full">
                {/* head */}
                <thead>
                  <tr>
                    <th className="w-1/6">Actions</th>
                    <th className="w-2/12">
                      Case Name
                      <button
                        className="ml-1"
                        type="button"
                        onClick={() => handlesort('case_name', 'asc')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'case_name' && asc === 'asc'
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
                        onClick={() => handlesort('case_name', 'desc')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'case_name' && asc === 'desc'
                              ? 'bg-blue-200'
                              : null
                            }`}
                        >
                          <Image src={DecendingIcon} alt="Decending icon" />
                        </span>
                      </button>
                    </th>
                    <th className="w-2/12">
                      Deponent Name
                      <button
                        className="ml-1"
                        type="button"
                        onClick={() => handlesort('deponent_name', 'asc')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'deponent_name' && asc === 'asc'
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
                        onClick={() => handlesort('deponent_name', 'desc')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'deponent_name' && asc === 'desc'
                              ? 'bg-blue-200'
                              : null
                            }`}
                        >
                          <Image src={DecendingIcon} alt="Decending icon" />
                        </span>
                      </button>
                    </th>

                    <th className="w-1/6">
                      Start Time
                      <button
                        className="ml-1"
                        type="button"
                        onClick={() => handlesort('updated_at', 'asc')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'updated_at' && asc === 'asc'
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
                        onClick={() => handlesort('updated_at', 'desc')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'updated_at' && asc === 'desc'
                              ? 'bg-blue-200'
                              : null
                            }`}
                        >
                          <Image src={DecendingIcon} alt="Decending icon" />
                        </span>
                      </button>
                    </th>
                    <th className="w-1/6">Duration</th>
                  </tr>
                </thead>
                {getdataLoading || depositionList === undefined ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      <Loader />
                    </td>
                  </tr>
                ) :
                  <tbody>
                    {depositionList.length > 0 ? (
                      depositionList.map((item, index) => {
                        return (
                          <tr key={index}>
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
                                      <div
                                        className={`tooltip tooltip-right ${item?.status !== 5
                                          ? 'hidden'
                                          : 'block'
                                          }`}
                                        data-tip="Click to sync up in zoom call"
                                      >
                                        <Link
                                          target="_blank"
                                          href={
                                            item?.zoom_link
                                              ? item?.zoom_link
                                              : ''
                                          }
                                          className="w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem] cursor-pointer"
                                        >
                                          <Image
                                            src={VideoIcon}
                                            alt="Video icon"
                                            width={500}
                                            height={500}
                                            className="w-full h-auto"
                                          />
                                        </Link>
                                      </div>

                                      <div
                                        className={`tooltip tooltip-right ${[0, 3].includes(item?.status)
                                          ? 'hidden'
                                          : 'block'
                                          }`}
                                        data-tip="Click to chat"
                                      >
                                        <Link 
                                        href={`${data?.user?.role_id === "6" ? "/AttorneyAssistant" : "/Attorney"}/mydepositionlistmanagement/chat/${item?.id}`}
                                          className="w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem] cursor-pointer"
                                        >
                                          <Image
                                            src={ChatIcon}
                                            alt="Chat icon"
                                            className="w-full h-auto"
                                          />
                                        </Link>
                                      </div>

                                      <div
                                        className={`tooltip tooltip-right text-left`}
                                        data-tip="View"
                                      >
                                        <button className="w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem] cursor-pointer">
                                          <label
                                            htmlFor="detailsmodal"
                                            onClick={() =>
                                              detailsModal(item?.id)
                                            }
                                          >
                                            <Image
                                              src={previewcaseicon}
                                              alt=""
                                            />
                                          </label>
                                        </button>
                                      </div>

                                      <div
                                        className={`tooltip tooltip-right text-left ${[0, 4, 3].includes(item?.status)
                                          ? 'hidden'
                                          : 'block'
                                          }`}
                                        data-tip="Edit"
                                      >
                                        {/* <button className="w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem]"> */}
                                        <Link
                                          href={`${data?.user?.role_id === "6" ? "/AttorneyAssistant" : "/Attorney"}/mydepositionlistmanagement/editdeposition/${item?.id}`}
                                         // href={`/Attorney/mydepositionlistmanagement/editdeposition/${item?.id}`}
                                          className="w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem] cursor-pointer"
                                        >
                                          <Image src={editactionbtn} alt="" />
                                        </Link>
                                        {/* </button> */}
                                      </div>

                                      <div
                                        className={`tooltip tooltip-right text-left ${[0, 4, 3].includes(item?.status)
                                          ? 'hidden'
                                          : 'block'
                                          }`}
                                        data-tip="Cancel"
                                      >
                                        <button className="w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem]">
                                          <label
                                            htmlFor={`add-cancel-modal`}
                                            onClick={(e) =>
                                              cancelModalHandler(item?.id)
                                            }
                                          >
                                            <Image
                                              src={CancelIcon}
                                              alt="Cancel icon"
                                            />
                                          </label>
                                        </button>
                                      </div>

                                      <div
                                        className="tooltip tooltip-right"
                                        data-tip="Click to download"
                                      >
                                        <a>
                                          <label
                                            htmlFor="transcript-file-modal"
                                            className="w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem] cursor-pointer"
                                            onClick={() =>
                                              setDownloadDepoId(item?.id)
                                            }
                                          >
                                            <Image
                                              src={DownloadIcon}
                                              alt="Download icon"
                                              className="w-full h-auto"
                                            />
                                          </label>
                                        </a>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </details>
                            </td>

                            <td>
                              {typeof item.case_no == 'string' ? item.case_no : <>{item.case_no[0]}
                                <span className="block">vs</span>
                                {item.case_no[1]}</>}
                            </td>
                            <td>
                              {item?.deponent_name !==null ? item?.deponent_name : '--'}
                            </td>
                            <td>
                              {item?.start_time
                                ? moment(item?.start_time).format(
                                  'MM/DD/yyyy H:mm'
                                )
                                : '--'}
                            </td>
                            <td>{item?.duration ? item?.duration : '--'}</td>
                          </tr>
                        );
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
        {/* Pagination start */}
        {depocount > 10 && (
          <div className="table-meta-wrap">
            {depocount > 19 && (
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

                      {depocount > 49 && (
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
                {startpagecount}-{endpagecount} of {depocount}
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
                disabled={endpagecount === depocount}
                onClick={handlenext}
              >
                <Image src={nexticon} alt="" />
              </button>
            </div>
          </div>
        )}
        {/* Pagination end */}
      </div>

      {cancelModalData.isOpen && (
        <>
          <input
            type="checkbox"
            id="add-cancel-modal"
            className="modal-toggle"
          />
          <CancelReasonModal
            depo_id={cancelModalData.depo_id}
            handlemodal={cancelHandler}
          />
        </>
      )}

      {detailsModalData.depo_id !== '' && (
        <>
          <MyDepositionDetailsModal
            depoid={detailsModalData.depo_id}
            handlechange={closeDetailsHandler}
            axiosAuth={axiosAuth}
          />
        </>
      )}

      {downloadDepoId !== '' && (
        <>
          <DownloadTranscriptFile
            depoid={downloadDepoId}
            handlechange={handleclose}
            axiosAuth={axiosAuth}
          />
        </>
      )}
    </>
  );
};

export default MyDepositionManagementTable;
