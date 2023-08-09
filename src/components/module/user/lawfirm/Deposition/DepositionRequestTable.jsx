'use client';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import moment from 'moment';
import soliddownicon from '../../../../../assets/images/icons/grey-solid-down-icon.svg';
import downicon from '../../../../../assets/images/icons/chevron-down-icon.svg';
import previcon from '../../../../../assets/images/icons/table-grey-prev-icon.svg';
import AscendingIcon from '../../../../../assets/images/deposition-request/ascending-icon.svg';
import DecendingIcon from '../../../../../assets/images/deposition-request/decending-icon.svg';
import MoreVeticalIcon from '../../../../../assets/images/chat/more-vertical-icon.svg';
import nexticon from '../../../../../assets/images/icons/table-grey-next-icon.svg';
import AcceptModal from '../../Physician/Modal/AcceptModal';
import RejectReasonModal from '../../Physician/Modal/RejectReasonModal';
import RescheduleModal from '../../Physician/Modal/RescheduleModal';
import DepositionRequestSearchbar from './DepositionRequestSearchbar';
import { durationextractor, getFormattedDate } from '@/helpers/mischelper';
import ChatIcon from '../../../../../assets/images/deposition-requests-and-scheduling/chat-icon.svg';
import NoChatIcon from '../../../../../assets/images/deposition-requests-and-scheduling/no-chat-icon.svg';
import VideoIcon from '../../../../../assets/images/deposition-requests-and-scheduling/video-call-icon.svg';
import Link from 'next/link';
import Loader from '../Loader';
import DownloadTranscriptFile from '../Modal/DownloadTranscriptFile';
import DownloadIcon from '../../../../../assets/images/deposition-requests-and-scheduling/download-icon.svg';
import { useSession } from 'next-auth/react';

const DepositionRequestTable = () => {
  const axiosAuth = useAxiosAuth();
  const [depositionList, setDepositionList] = useState([]);
  const [depocount, setdepocount] = useState(0);
 const {data}=useSession()
  const [sortName, setSortName] = useState('updated_at');
  const [asc, setAsc] = useState('desc');
  const [startpagecount, setstartpagecount] = useState(1);
  const [endpagecount, setendpagecount] = useState(10);
  const [searchCaseValue, setSearchCaseValue] = useState('');
  const [searchDepoValue, setSearchDepoValue] = useState('');
  const [startdatevalue, setstartdatevalue] = useState('');
  const [enddatevalue, setenddatevalue] = useState('');
  const [rowvalue, setrowvalue] = useState(10);
  const [row, setrow] = useState(false);
  const [status, setstatus] = useState(5);

  const [downloadDepoId, setDownloadDepoId] = useState('');

  const [acceptData, setAcceptData] = useState({
    status: false,
    deposition_id: '',
    invitees_id: '',
  });

  const [rejectData, setRejectData] = useState({
    status: false,
    deposition_id: '',
    invitees_id: '',
  });

  const [scheduleData, setScheduleData] = useState({
    status: false,
    deposition_id: '',
    invitees_id: '',
    startDate: '',
    endDate: '',
  });

  const {
    data: depositionData,
    error,
    isLoading: getdataLoading,
    mutate,
  } = useSWR(
    [
      `/case/getDepoCallListForInvitee?sort_name=${sortName}&sort_order=${asc}&size=${endpagecount}&page=${startpagecount}&start_date=${startdatevalue}&end_date=${enddatevalue}&case_name=${searchCaseValue}&deponent_name=${searchDepoValue}&status=${status}`,
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
          case_id: item?.case?.case_number,
          case_name: item?.case?.case_name ? item?.case?.case_name?.toLowerCase()?.split(' vs ') : '--',
          depo_id: item?.deposition_number,
          deponent_name: item?.deponent_name,
          case_invitees: item?.case_invitees,
          start_time: item?.start_time,
          end_time: item?.end_time,
          duration: item.start_time
            ? durationextractor(item.start_time, item?.end_time)
            : '--',
          invitees_by: item?.user?.first_name + ' ' + item?.user?.last_name,
          depo_status: parseInt(item?.status),
          status:
            item?.case_invitees.length > 0
              ? parseInt(item?.case_invitees[0]?.status)
              : 2,
          zoom_link: item?.zoom_link,
          isShow: false,
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
  const handleRow = (number) => {
    setrowvalue(number);
    setstartpagecount(1);
    setendpagecount(number);
    setrow(false);
  };

  // Sort handler
  const handlesort = (sort, condition) => {
    setAsc(condition);
    setSortName(sort);
    setstartpagecount(1);
    setendpagecount(rowvalue);
  };

  const handleSearchvalue = (value) => {
    if (value?.searchcondition === true) {
      setSearchCaseValue(value?.casesearch);
      setSearchDepoValue(value?.deposearch);
      setenddatevalue('');
      setstartdatevalue('');
      setstatus(5);
    } else {
      setenddatevalue(
        value?.enddate === '' ? '' : getFormattedDate(value?.enddate)
      );
      setstartdatevalue(
        value?.startdate === '' ? '' : getFormattedDate(value?.startdate)
      );
      setstatus(value?.status);
      setSearchCaseValue('');
      setSearchDepoValue('');
    }
    setstartpagecount(1);
    setendpagecount(rowvalue);
    setSortName('case_name');
    setAsc('asc');
  };

  const depoStatusHandler = (event, depoId, inviteeId) => {
    let value = event.target.getAttribute('data-value');
    if (value == 0)
      setRejectData((preData) => {
        return {
          ...preData,
          deposition_id: depoId,
          invitees_id: inviteeId,
          status: true,
        };
      });
    if (value == 3) {
      let dateInfo = depositionList.find((item) => (item.id = depoId));
      setScheduleData((preData) => {
        return {
          ...preData,
          deposition_id: depoId,
          invitees_id: inviteeId,
          status: true,
          startDate: dateInfo.start_time,
          endDate: dateInfo.end_time,
        };
      });
    }
    if (value == 1) {
      setAcceptData((preData) => {
        return {
          ...preData,
          deposition_id: depoId,
          invitees_id: inviteeId,
          status: true,
        };
      });
    }
  };

  const acceptHandler = () => {
    setAcceptData((preData) => {
      return { ...preData, status: false };
    });
    mutate();
  };

  const rejectHandler = () => {
    setRejectData((preData) => {
      return { ...preData, status: false };
    });
    mutate();
  };

  const scheduleHandler = () => {
    setScheduleData((preData) => {
      return { ...preData, status: false };
    });
    mutate();
  };

  const showMenu = (Id) => {
    setDepositionList((preData) => {
      return preData.map((depoItem) => {
        if (parseInt(depoItem.id) === parseInt(Id)) {
          if ([0, 1, 3].includes(parseInt(depoItem.case_invitees[0].status))) {
            return { ...depoItem, isShow: false };
          } else {
            return { ...depoItem, isShow: !depoItem?.isShow };
          }
        } else {
          return { ...depoItem, isShow: false };
        }
      });
    });
  };

  const handleclose = () => {
    setDownloadDepoId('');
    mutate();
  };

  const getStatus = (item) => {
    let statusName = '';
    let status = parseInt(item.case_invitees[0].status);
    if (status === 1) {
      statusName = 'Accepted';
    } else if (status === 2) {
      statusName = 'pending';
    } else if (status === 0) {
      statusName = 'Rejected';
    } else if (status === 3) {
      statusName = 'Reschedule request';
    } else {
      statusName = 'Waiting for payment';
    }
    return statusName;
  };

  return (
    <>
      <DepositionRequestSearchbar handleSearchvalue={handleSearchvalue} />
      <div className="m-card-table">
        <div className="c-table overflow-auto">
          <div className="overflow-visible">
            <table className="table w-full">
              {/* head */}
              <thead>
                <tr>
                  <th className="w-1/6">Actions</th>
                  <th className="w-1/6">Status</th>
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
                  <th className="w-1/6">Invited By</th>
                </tr>
              </thead>
              {getdataLoading || depositionData === undefined ? (
                <tr>
                  <td colSpan={7} className="text-center">
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
                                className="btn !bg-transparent !rounded-none !h-auto outline-none !min-h-0 !p-0 !pr-0 tooltip tooltip-right normal-case"
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
                                    {![0, 3].includes(item?.depo_status) ? (
                                      <div
                                        className="tooltip tooltip-right"
                                        data-tip="Click to chat"
                                      >
                                        <Link
                                        href={`${data?.user?.role_id === "6" ? "/AttorneyAssistant" : "/Attorney"}/mydepositionlistmanagement/chat/${item?.id}`}
                                          className="w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem]"
                                        >
                                          <Image
                                            src={ChatIcon}
                                            alt="Chat icon"
                                            className="w-full h-auto"
                                          />
                                        </Link>
                                      </div>
                                    ) : (
                                      <div
                                        className="tooltip tooltip-right"
                                        data-tip="Chat is disabled"
                                      >
                                        <button
                                          disabled={true}
                                          className={`w-9 overflow-hidden flex items-center justify-center p-2 cursor-not-allowed flex-[0_0_0.5625rem]`}
                                        >
                                          <Image
                                            src={NoChatIcon}
                                            alt="No chat icon"
                                            className="w-full h-auto"
                                          />
                                        </button>
                                      </div>
                                    )}

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

                                    <div
                                      className={`tooltip tooltip-right ${item?.depo_status == 5
                                        ? 'hidden'
                                        : 'block'
                                        }`}
                                      data-tip="Click to sync up in zoom call"
                                    >
                                      <a>
                                        <Link
                                          target="_blank"
                                          href={
                                            item?.zoom_link
                                              ? item?.zoom_link
                                              : ''
                                          }
                                          className="w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem]"
                                        >
                                          <Image
                                            src={VideoIcon}
                                            alt="Video icon"
                                            width={500}
                                            height={500}
                                            className="w-full h-auto"
                                          />
                                        </Link>
                                      </a>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </details>
                          </td>
                          <td>
                            <div className="select-dropdown mb-0 small-height flex-[0_0_7.5rem]">
                              <button
                                href="#"
                                onClick={() => showMenu(item?.id)}
                                role="button"
                                data-value=""
                                className={`select-dropdown__button !px-2 ${item?.isShow && 'active'
                                  }`}
                              >
                                <div
                                  className="tooltip tooltip-right"
                                  data-tip={getStatus(item)}
                                >
                                  <span className="truncate inline-block text-left w-[7.1875rem] pr-4">
                                    {getStatus(item)}
                                  </span>
                                </div>
                                <Image
                                  src={downicon}
                                  className="i-chevron-down !right-[0.125rem]"
                                  alt=""
                                />
                              </button>

                              <ul
                                className={`select-dropdown__list ${item?.isShow && 'active'
                                  }`}
                              >
                                <li
                                  data-value="1"
                                  className="select-dropdown__list-item"
                                >
                                  <label
                                    onClick={(e) =>
                                      depoStatusHandler(
                                        e,
                                        item?.id,
                                        item?.case_invitees[0].id
                                      )
                                    }
                                    htmlFor="add-accept-modal"
                                    data-value="1"
                                    className={`${item.case_invitees[0].status == 1 &&
                                      `font-bold`
                                      }`}
                                  >
                                    Accept
                                  </label>
                                </li>

                                <li
                                  data-value="3"
                                  className="select-dropdown__list-item"
                                >
                                  <label
                                    htmlFor="add-schedule-modal"
                                    data-value="3"
                                    className={`${item.case_invitees[0].status == 3 &&
                                      `font-bold`
                                      }`}
                                    onClick={(e) =>
                                      depoStatusHandler(
                                        e,
                                        item?.id,
                                        item?.case_invitees[0].id
                                      )
                                    }
                                  >
                                    Reschedule
                                  </label>
                                </li>

                                <li
                                  data-value="0"
                                  className="select-dropdown__list-item"
                                >
                                  <label
                                    htmlFor="add-reject-modal"
                                    className={`${item.case_invitees[0].status == 0 &&
                                      `font-bold`
                                      }`}
                                    data-value="0"
                                    onClick={(e) =>
                                      depoStatusHandler(
                                        e,
                                        item?.id,
                                        item?.case_invitees[0].id
                                      )
                                    }
                                  >
                                    Reject
                                  </label>
                                </li>

                                <li
                                  data-value="2"
                                  className="select-dropdown__list-item disable"
                                >
                                  <label
                                    htmlFor="add-schedule-modal"
                                    data-value="2"
                                    className={`${item.case_invitees[0].status == 2 &&
                                      `font-bold`
                                      }`}
                                  >
                                    Pending
                                  </label>
                                </li>
                              </ul>
                            </div>
                          </td>
                          <td>
                            {typeof item?.case_name == 'string' ? item?.case_name : <>{item?.case_name[0]}
                              <span className="block">vs</span>
                              {item?.case_name[1]}</>}
                          </td>
                          <td>
                            {item?.deponent_name ? item?.deponent_name : '--'}
                          </td>
                          <td>
                            {item?.start_time
                              ? moment(item?.start_time).format(
                                'MM/DD/yyyy H:mm'
                              )
                              : '--'}
                          </td>
                          <td>{item?.duration}</td>
                          <td>{item?.invitees_by}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center">
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

      {acceptData.status && (
        <>
          <input
            type="checkbox"
            id="add-accept-modal"
            className="modal-toggle"
          />
          <AcceptModal
            depo_id={acceptData.deposition_id}
            invitee_id={acceptData.invitees_id}
            handlemodal={acceptHandler}
          />
        </>
      )}

      {rejectData.status && (
        <>
          <input
            type="checkbox"
            id="add-reject-modal"
            className="modal-toggle"
          />
          <RejectReasonModal
            depo_id={rejectData.deposition_id}
            invitee_id={rejectData.invitees_id}
            handlemodal={rejectHandler}
          />
        </>
      )}

      {scheduleData.status && (
        <>
          <input
            type="checkbox"
            id="add-schedule-modal"
            className="modal-toggle"
          />
          <RescheduleModal
            depo_id={scheduleData.deposition_id}
            invitee_id={scheduleData.invitees_id}
            handlemodal={scheduleHandler}
            startdate={scheduleData.startDate}
            enddate={scheduleData.endDate}
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

export default DepositionRequestTable;
