'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import previcon from '../../../../../assets/images/icons/table-grey-prev-icon.svg';
import nexticon from '../../../../../assets/images/icons/table-grey-next-icon.svg';
import soliddownicon from '../../../../../assets/images/icons/grey-solid-down-icon.svg';
import addicon from '../../../../../assets/images/icons/white-add-icon.svg';
import editactionbtn from '../../../../../assets/images/icons/edit-action-btn.svg';
import previewcaseicon from '../../../../../assets/images/icons/preview-case-icon.svg';
import VideoIcon from '../../../../../assets/images/deposition-requests-and-scheduling/video-call-icon.svg';
import ChatIcon from '../../../../../assets/images/deposition-requests-and-scheduling/chat-icon.svg';
import DownloadIcon from '../../../../../assets/images/deposition-requests-and-scheduling/download-icon.svg';
import CancelIcon from '../../../../../assets/images/my-deposition-list/cancel-icon.svg';
import Link from 'next/link';
import {
  WithTokenGetApi,
  WithTokenTriggerGetApi,
} from '@/services/module/api/getapi';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import {
  durationextractor,
  getFormattedDate,
  minuteextractor,
} from '@/helpers/mischelper';
import AscendingIcon from '../../../../../assets/images/case-management/ascending-icon.svg';
import DecendingIcon from '../../../../../assets/images/case-management/decending-icon.svg';
import Casemanagmentsearchbar from './casemanagmentsearchbar';
import DepositiondetailsModal from '../Modal/DepositiondetailsModal';
import Loader from '../Loader';
import CancelReasonModal from '../Modal/CancelReasonModal';
import DownloadTranscriptFile from '../Modal/DownloadTranscriptFile';
import MoreVeticalIcon from '../../../../../assets/images/chat/more-vertical-icon.svg';
import { useSession } from 'next-auth/react';
const Casemanagmentatble = () => {
  const axiosAuth = useAxiosAuth();
  const { data } = useSession();
  const [caselist, setcaselist] = useState([]);
  const [casecount, setcasecount] = useState(0);
  const [startpagecount, setstartpagecount] = useState(1);
  const [endpagecount, setendpagecount] = useState(10);
  const [row, setrow] = useState(false);
  const [rowvalue, setrowvalue] = useState(10);
  const [searchvalue, setSearchvalue] = useState('');
  const [startdatevalue, setstartdatevalue] = useState('');
  const [enddatevalue, setenddatevalue] = useState('');
  const [status, setstatus] = useState(3);
  const [sortName, setSortName] = useState('created_at');
  const [depodata, setdepodata] = useState([]);
  const [asc, setAsc] = useState('desc');
  const [depoloading, setdepoloading] = useState(false);
  const [depomodal, setdepomodal] = useState('');
  const [modalstatus, setmodalstatus] = useState('');
  const [cancelModalData, setCancelModalData] = useState({
    isOpen: false,
    depo_id: '',
  });
  const [downloadDepoId, setDownloadDepoId] = useState('');

  const {
    data: getcasedata,
    isLoading,
    mutate,
  } = useSWR(
    [
      `/case/getAllCaseList?search=${searchvalue}&startCount=${startpagecount}&endCount=${endpagecount}&start_date=${startdatevalue}&end_date=${enddatevalue}&status=${status}&sort_name=${sortName}&sort_order=${asc}`,
      axiosAuth,
    ],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );
  const { trigger: depotrigger, data: getdepodata } = useSWRMutation(
    `/case/getDepoListByCaseId`,
    WithTokenTriggerGetApi
  );
  useEffect(() => {
    if (getdepodata?.status === 200) {
      setdepodata(getdepodata?.data?.data);
      setdepoloading(false);
    }
  }, [getdepodata]);
  useEffect(() => {
    if (getcasedata?.status === 200 && getcasedata?.data?.data?.length > 0) {
      setcaselist(getcasedata?.data?.data);
      setcasecount(getcasedata?.data?.totalCount);
      // setcasecount(93);
    }
    if (getcasedata?.status === 200 && getcasedata?.data?.data?.length === 0) {
      setcaselist([]);
      setcasecount(0);
    }
  }, [getcasedata]);
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
      window.scroll(40, 20);
    } else if (endpagecount < casecount) {
      setstartpagecount((prev) => prev + rowvalue);
      setendpagecount(casecount);
      window.scroll(40, 20);
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
    setSortName('case_name');
    setAsc('asc');
  };
  const handleDynamicTable = (id, index) => {
    let dynamicRowCheck = caselist?.find(
      (item) => item.dynamictableInput === 'yes'
    );
    if (dynamicRowCheck === undefined) {
      let temprow = [...caselist];
      const rowsInput = {
        dynamictableInput: 'yes',
        dynamicrowsunderid: id,
        case_name: null,
        case_number: '',
        created_at: '',
        created_by: '',
        details: '',
        id: '',
        status: '',
      };
      depotrigger({ id, axios: axiosAuth });
      temprow.splice(index + 1, 0, rowsInput);
      setcaselist(temprow);
      setdepoloading(true);
    }
    if (
      dynamicRowCheck !== undefined &&
      dynamicRowCheck?.dynamicrowsunderid === id
    ) {
      let temprow = [...caselist];
      let filteredRow = temprow?.filter(
        (item) => item?.dynamicrowsunderid !== id
      );
      setcaselist(filteredRow);
      setdepodata([]);
    }
    if (
      dynamicRowCheck !== undefined &&
      dynamicRowCheck?.dynamicrowsunderid !== id
    ) {
      let temprow = [...caselist];
      let rowsInput = {
        dynamictableInput: 'yes',
        dynamicrowsunderid: id,
        case_name: null,
        case_number: '',
        created_at: '',
        created_by: '',
        details: '',
        id: '',
        status: '',
      };
      depotrigger({ id, axios: axiosAuth });
      temprow.splice(index + 1, 0, rowsInput);
      let removableRow = temprow?.find(
        (item) =>
          item?.dynamicrowsunderid !== id && item?.dynamictableInput === 'yes'
      );
      let filteredRow = temprow?.filter(
        (item) => item?.dynamicrowsunderid !== removableRow?.dynamicrowsunderid
      );
      setcaselist(filteredRow);
      setdepoloading(true);
    }
  };
  const handlemodal = (id, status) => {
    setdepomodal(id);
    setmodalstatus(status);
  };
  const handlechange = () => {
    setdepomodal('');
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
  };

  const handleclose = () => {
    setDownloadDepoId('');
  };
  return (
    <>
      <div className="p-title-flex flex items-center justify-between flex-wrap mb-6">
        <h2 className="c-page-title">Case Management</h2>
        <Link
          href={`${
            data?.user?.role_id === '6' ? '/AttorneyAssistant' : '/Attorney'
          }/casemanagement/createcase`}
          htmlFor="create-user"
          className="primary-btn cursor-pointer"
        >
          <Image src={addicon} alt="" /> Add New Case
        </Link>
      </div>
      <div className="m-card p-5">
        <Casemanagmentsearchbar handleSearchvalue={handleSearchvalue} />

        <div className="m-card-table">
          <div className="c-table">
            <table className="table w-full">
              {/* head */}
              <thead>
                <tr>
                  <th className="w-4"></th>
                  <th className="w-8">Actions</th>
                  <th className="w-auto">
                    Case Name
                    <button
                      className="ml-1"
                      type="button"
                      onClick={() => handlesort('case_name', 'asc')}
                    >
                      <span
                        className={`w-3 overflow-hidden flex items-center justify-center
                        ${
                          sortName === 'case_name' && asc === 'asc'
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
                        ${
                          sortName === 'case_name' && asc === 'desc'
                            ? 'bg-blue-200'
                            : null
                        }`}
                      >
                        <Image src={DecendingIcon} alt="Decending icon" />
                      </span>
                    </button>
                  </th>
                  <th className="w-auto">Details</th>
                  <th className="w-auto">
                    Created At
                    <button
                      className="ml-1"
                      type="button"
                      onClick={() => handlesort('created_at', 'asc')}
                    >
                      <span
                        className={`w-3 overflow-hidden flex items-center justify-center
                        ${
                          sortName === 'created_at' && asc === 'asc'
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
                      onClick={() => handlesort('created_at', 'desc')}
                    >
                      <span
                        className={`w-3 overflow-hidden flex items-center justify-center
                        ${
                          sortName === 'created_at' && asc === 'desc'
                            ? 'bg-blue-200'
                            : null
                        }`}
                      >
                        <Image src={DecendingIcon} alt="Decending icon" />
                      </span>
                    </button>
                  </th>
                  <th className="w-auto">Status</th>
                </tr>
              </thead>
              {isLoading || getcasedata === undefined ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    <Loader />
                  </td>
                </tr>
              ) : (
                <tbody>
                  {caselist?.length > 0 ? (
                    caselist?.map((item, i) => {
                      let caseName = item?.case_name
                        ? item?.case_name?.toLowerCase()?.split(' vs ')
                        : '--';
                      return (
                        <tr key={i}>
                          {item?.dynamictableInput === 'yes' ? (
                            <td colSpan={6} className="p-0">
                              <div className="case-details-table">
                                {depoloading ? (
                                  <Loader />
                                ) : depodata?.length > 0 ? (
                                  <>
                                    <div className="grid grid-cols-8 case-details-tr">
                                      <div className="case-details-th">
                                        Actions
                                      </div>
                                      <div className="case-details-th">
                                        Deponent Name
                                      </div>
                                      <div className="case-details-th">
                                        Scheduled Date
                                      </div>
                                      <div className="case-details-th">
                                        Scheduled Time
                                      </div>
                                      <div className="case-details-th">
                                        Duration
                                      </div>
                                      <div className="case-details-th col-span-2">
                                        Attendees Email
                                      </div>
                                      <div className="case-details-th">
                                        Status
                                      </div>
                                    </div>
                                    {depodata?.map((item, i) => (
                                      <div
                                        className="grid grid-cols-8 case-details-tr"
                                        key={i}
                                      >
                                        <div className="case-details-td">
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
                                                    className="tooltip tooltip-right"
                                                    data-tip="Click to preview case"
                                                  >
                                                    <a>
                                                      <label
                                                        htmlFor="payment"
                                                        onClick={() =>
                                                          handlemodal(
                                                            item?.id,
                                                            item?.status
                                                          )
                                                        }
                                                        className="w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem] cursor-pointer"
                                                      >
                                                        <Image
                                                          src={previewcaseicon}
                                                          alt="View icon"
                                                          className="w-full h-auto"
                                                        />
                                                      </label>
                                                    </a>
                                                  </div>
                                                  <div
                                                    className={`tooltip tooltip-right ${
                                                      [0, 4, 3].includes(
                                                        parseInt(item?.status)
                                                      )
                                                        ? 'hidden'
                                                        : 'block'
                                                    }`}
                                                    data-tip="Click to edit"
                                                  >
                                                    <a>
                                                      <Link
                                                        href={`${
                                                          data?.user
                                                            ?.role_id === '6'
                                                            ? '/AttorneyAssistant'
                                                            : '/Attorney'
                                                        }/mydepositionlistmanagement/editdeposition/${
                                                          item?.id
                                                        }`}
                                                        className="w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem]"
                                                      >
                                                        <Image
                                                          src={editactionbtn}
                                                          alt="View icon"
                                                          className="w-full h-auto"
                                                        />
                                                      </Link>
                                                    </a>
                                                  </div>
                                                  <div
                                                    className={`tooltip tooltip-right ${
                                                      item?.status !== 5
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
                                                  <div
                                                    className={`tooltip tooltip-right ${
                                                      [0, 4, 3].includes(
                                                        parseInt(item?.status)
                                                      )
                                                        ? 'hidden'
                                                        : 'block'
                                                    }`}
                                                    data-tip="Click to chat"
                                                  >
                                                    <a>
                                                      <Link
                                                        href={`${
                                                          data?.user
                                                            ?.role_id === '6'
                                                            ? '/AttorneyAssistant'
                                                            : '/Attorney'
                                                        }/mydepositionlistmanagement/chat/${
                                                          item?.id
                                                        }
                                                       `}
                                                        className="w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem]"
                                                      >
                                                        <Image
                                                          src={ChatIcon}
                                                          alt="Chat icon"
                                                          className="w-full h-auto"
                                                        />
                                                      </Link>
                                                    </a>
                                                  </div>
                                                  <div
                                                    className={`tooltip tooltip-right text-left ${
                                                      [0, 4, 3].includes(
                                                        parseInt(item?.status)
                                                      )
                                                        ? 'hidden'
                                                        : 'block'
                                                    }`}
                                                    data-tip="Cancel"
                                                  >
                                                    <a>
                                                      <label
                                                        htmlFor={`add-cancel-modal`}
                                                        onClick={(e) =>
                                                          cancelModalHandler(
                                                            item?.id
                                                          )
                                                        }
                                                        className="w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem] cursor-pointer"
                                                      >
                                                        <Image
                                                          src={CancelIcon}
                                                          alt="Cancel icon"
                                                        />
                                                      </label>
                                                    </a>
                                                  </div>
                                                  <div
                                                    className="tooltip tooltip-right"
                                                    data-tip="Download Transcription File"
                                                  >
                                                    <a>
                                                      <label
                                                        htmlFor="transcript-file-modal"
                                                        className="w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem] cursor-pointer"
                                                        onClick={() =>
                                                          setDownloadDepoId(
                                                            item?.id
                                                          )
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
                                        </div>

                                        <div className="case-details-td">
                                          <div
                                            className="tooltip p-0"
                                            data-tip={
                                              item?.deponent_name
                                                ? item?.deponent_name
                                                : '--'
                                            }
                                          >
                                            <span className="truncate max-w-[10.5625rem] inline-block">
                                              {item?.deponent_name
                                                ? item?.deponent_name
                                                : '--'}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="case-details-td">
                                          {getFormattedDate(item?.start_time)}
                                        </div>
                                        <div className="case-details-td">
                                          {item?.start_time !== null
                                            ? minuteextractor(item?.start_time)
                                            : '--'}
                                        </div>
                                        <div className="case-details-td">
                                          <div
                                            className="tooltip tooltip-right"
                                            data-tip={
                                              item?.start_time !== null
                                                ? durationextractor(
                                                    item?.start_time,
                                                    item?.end_time
                                                  )
                                                : '--'
                                            }
                                          >
                                            <span className="truncate inline-block max-w-[5.3125rem]">
                                              {item?.start_time !== null
                                                ? durationextractor(
                                                    item?.start_time,
                                                    item?.end_time
                                                  )
                                                : '--'}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="case-details-td col-span-2">
                                          <div
                                            className="tooltip tooltip-right"
                                            data-tip={
                                              item?.case_invitees[0]?.email
                                            }
                                          >
                                            <span className="truncate inline-block max-w-[12.8125rem]">
                                              {item?.case_invitees[0]?.email}
                                            </span>
                                          </div>
                                          <div className="dropdown dropdown-bottom dropdown-end">
                                            <label
                                              tabindex="0"
                                              className="attend-count"
                                            >
                                              +{item?.case_invitees?.length - 1}
                                            </label>
                                            <ul
                                              tabindex="0"
                                              className="dropdown-content menu attend-count-ul"
                                            >
                                              {item?.case_invitees?.map(
                                                (item2, i2) => (
                                                  <li
                                                    className="attend-count-li"
                                                    key={i2}
                                                  >
                                                    <span className="user-email">
                                                      {item2?.email}
                                                    </span>
                                                    <span className="user-pos">
                                                      {item2?.role_name}
                                                    </span>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        </div>
                                        <div className="case-details-td">
                                          <span className="text-waiting">
                                            {item?.status === '1'
                                              ? 'Pending'
                                              : item?.status === '2'
                                              ? 'Scheduled'
                                              : item?.status === '3'
                                              ? 'Completed'
                                              : item?.status === '4'
                                              ? 'Refund completed'
                                              : item?.status === '0' &&
                                                'Refund Pending'}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </>
                                ) : (
                                  <div className="grid grid-cols-8 gap-4 case-details-tr">
                                    Sorry no data found
                                  </div>
                                )}
                              </div>
                            </td>
                          ) : (
                            <>
                              <td>
                                <div
                                  className="down-arrow"
                                  onClick={() =>
                                    handleDynamicTable(item?.id, i)
                                  }
                                ></div>
                              </td>
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
                                  <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box min-w-[4.375rem]">
                                    <li className="!p-0 focus:!bg-transparent active:!bg-transparent">
                                      <div className="items-center !p-0">
                                        <div
                                          className="tooltip text-left"
                                          data-tip="View"
                                        >
                                          <Link
                                            className="w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem] cursor-pointer"
                                            href={`${
                                              data?.user?.role_id === '6'
                                                ? '/AttorneyAssistant'
                                                : '/Attorney'
                                            }/casemanagement/casedetails/${
                                              item?.id
                                            }`}
                                          >
                                            <Image
                                              src={previewcaseicon}
                                              alt=""
                                            />
                                          </Link>
                                        </div>
                                        {item?.status === '1' && 
                                         <div
                                         className="tooltip text-left"
                                         data-tip="Edit"
                                       >
                                         <Link
                                           className="w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem] cursor-pointer"
                                           href={`${data?.user?.role_id === "6" ? "/AttorneyAssistant" : "/Attorney"}/casemanagement/editcase/${item?.id}`}
                                         >
                                           <Image src={editactionbtn} alt="" />
                                         </Link>
                                       </div>
                                        }
                                       
                                      </div>
                                    </li>
                                  </ul>
                                </details>
                              </td>
                              <td>
                                {typeof caseName == 'string' ? (
                                  caseName
                                ) : (
                                  <>
                                    {caseName[0]}
                                    <span className="block">vs</span>
                                    {caseName[1]}
                                  </>
                                )}
                              </td>
                              <td>
                                <p className="case-desc">{item?.details}</p>
                              </td>
                              <td>{getFormattedDate(item?.created_at)}</td>
                              <td>
                                <span className="text-accept">
                                  {item?.status === '1'
                                    ? 'active'
                                    : item?.status === '2'
                                      ? 'inactive'
                                      : null}
                                </span>
                              </td>
                            </>
                          )}
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
              )}
            </table>
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
      {depomodal !== '' && (
        <DepositiondetailsModal
          status={modalstatus}
          handlechange={handlechange}
          depoid={depomodal}
          axiosAuth={axiosAuth}
        />
      )}

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

      {downloadDepoId !== '' && (
        <>
          <DownloadTranscriptFile
            depoid={downloadDepoId}
            handlechange={handleclose}
            axiosAuth={axiosAuth}
          />
        </>
      )}

      {/* Pagination end */}
    </>
  );
};

export default Casemanagmentatble;
