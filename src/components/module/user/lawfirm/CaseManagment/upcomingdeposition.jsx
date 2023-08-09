'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import updepositionicon from '../../../../../assets/images/case-icon/up-deposition-icon.svg';
import previcon from '../../../../../assets/images/icons/table-grey-prev-icon.svg';
import nexticon from '../../../../../assets/images/icons/table-grey-next-icon.svg';
import soliddownicon from '../../../../../assets/images/icons/grey-solid-down-icon.svg';
import previewcaseicon from '../../../../../assets/images/icons/preview-case-icon.svg';
import editactionbtn from '../../../../../assets/images/icons/edit-action-btn.svg';
import binicon from '../../../../../assets/images/icons/bin-icon.png';
import DepositiondetailsModal from '../Modal/DepositiondetailsModal';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import useSWR from 'swr';
import {
  durationextractor,
  getFormattedDate,
  minuteextractor,
} from '@/helpers/mischelper';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
const Upcomingdeposition = ({ caseid, axiosAuth }) => {
  const [row, setrow] = useState(false);
  const [rowvalue, setrowvalue] = useState(4);
  const {data}=useSession()
  const [startpagecount, setstartpagecount] = useState(1);
  const [endpagecount, setendpagecount] = useState(4);
  const [upcomingdepomodal, setupcomingdepomodal] = useState('');
  const [modalstatus, setmodalstatus] = useState('');
  const {
    data: getupcomingdepodata,
    error,
    isLoading,
  } = useSWR(
    [
      `/case/getUpcomingDepositionList/${caseid}?startCount=${startpagecount}&endCount=${endpagecount}`,
      axiosAuth,
    ],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        return { data };
      },
    }
  );
  const handleRow = (number) => {
    setrowvalue(number);
    setstartpagecount(1);
    setendpagecount(number);
    setrow(false);
  };
  const handleprev = () => {
    if (
      startpagecount < getupcomingdepodata?.data?.totalCount - rowvalue &&
      startpagecount !== 1
    ) {
      setstartpagecount((prev) => prev - rowvalue);
      setendpagecount((prev) => prev - rowvalue);
    } else if (
      startpagecount < getupcomingdepodata?.data?.totalCount ||
      startpagecount === getupcomingdepodata?.data?.totalCount
    ) {
      let temppagecount = startpagecount - rowvalue;
      let temppage2count = temppagecount + (rowvalue - 1);
      setstartpagecount(temppagecount);
      setendpagecount(temppage2count);
    }
  };
  const handlenext = () => {
    if (endpagecount < getupcomingdepodata?.data?.totalCount - rowvalue) {
      setstartpagecount((prev) => prev + rowvalue);
      setendpagecount((prev) => prev + rowvalue);
    } else if (endpagecount < getupcomingdepodata?.data?.totalCount) {
      setstartpagecount((prev) => prev + rowvalue);
      setendpagecount(getupcomingdepodata?.data?.totalCount);
    }
  };
  const handlemodal = (id, status) => {
    setupcomingdepomodal(id);
    setmodalstatus(status);
  };
  const handlechange = () => {
    setupcomingdepomodal('');
  };
  return (
    <div className="bg-white rounded-xl p-6 mt-8">
      <div className="flex flex-wrap items-center gap-4 pb-5">
        <Image src={updepositionicon} alt="" />
        <h4>Upcoming Depositions</h4>
      </div>
      {getupcomingdepodata !== undefined ? (
        <>
          <div className="c-table overflow-auto">
            <div className="overflow-visible">
              <table className="table w-full">
                {/* head */}
                <thead>
                  <tr>
                    <th>Deponent Name</th>
                    <th>Schedule Date</th>
                    <th>Schedule Time</th>
                    <th>Duration</th>
                    <th>Attendees Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getupcomingdepodata?.data?.totalCount > 0 ? (
                    getupcomingdepodata?.data?.upcomingDepoList?.map(
                      (updepo, i) => (
                        <tr key={i}>
                          <td>{updepo?.deponent_name ? updepo?.deponent_name : '--'}</td>
                          <td>{getFormattedDate(updepo?.start_time)}</td>
                          <td>
                            {updepo?.start_time !== null
                              ? minuteextractor(updepo?.start_time)
                              : '--'}
                          </td>
                          <td>
                            {updepo?.start_time !== null
                              ? durationextractor(
                                updepo?.start_time,
                                updepo?.end_time
                              )
                              : '--'}
                          </td>
                          <td>
                            {updepo?.case_invitees[0]?.email}
                            <div className="dropdown dropdown-bottom dropdown-end">
                              <label tabIndex="0" className="attend-count">
                                +{updepo?.case_invitees?.length - 1}
                              </label>

                              <ul
                                tabindex="0"
                                className="dropdown-content menu attend-count-ul"
                              >
                                {updepo?.case_invitees?.map((item2, i2) => (
                                  <li
                                    className="attend-count-li !flex !flex-nowrap !justify-between"
                                    key={i2}
                                  >
                                    <div
                                      className="tooltip"
                                      data-tip={item2?.email}
                                    >
                                      <span className="user-email truncate max-w-[11rem] !block">
                                        {item2?.email}
                                      </span>
                                    </div>
                                    <span className="user-pos">
                                      {item2?.role_name}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </td>
                          <td>
                            <span className="text-waiting">
                              {updepo?.status === '1'
                                ? 'Pending'
                                : updepo?.status === '2'
                                  ? 'Scheduled'
                                  : updepo?.status === '3'
                                    ? 'Completed'
                                    : updepo?.status === '4'
                                      ? 'Refund completed'
                                      : updepo?.status === '0' && 'Refund Pending'}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div
                                className="tooltip text-left"
                                data-tip="View"
                              >
                                <label
                                  htmlFor="payment"
                                  className="w-5 overflow-hidden flex items-center justify-center flex-[0_0_1.25rem] cursor-pointer"
                                  onClick={() =>
                                    handlemodal(updepo?.id, updepo?.status)
                                  }
                                >
                                  <Image
                                    src={previewcaseicon}
                                    alt="View icon"
                                    className="w-full h-auto"
                                  />
                                </label>
                              </div>
                              <div
                                className="tooltip text-left"
                                data-tip="Edit"
                              >
                                <Link 
                                  href={`${data?.user?.role_id === "6" ? "/AttorneyAssistant" : "/Attorney"}/mydepositionlistmanagement/editdeposition/${updepo?.id}`}
                                  //href={`/Attorney/mydepositionlistmanagement/editdeposition/${updepo?.id}`}
                                  className="w-5 overflow-hidden flex items-center justify-center flex-[0_0_1.25rem] cursor-pointer"
                                >
                                  <Image
                                    src={editactionbtn}
                                    alt="View icon"
                                    className="w-full h-auto"
                                  />
                                </Link>
                              </div>
                              <div
                                className="tooltip text-left"
                                data-tip="Cancel"
                              >
                                <div className="w-5 overflow-hidden flex items-center justify-center flex-[0_0_1.25rem] cursor-pointer">
                                  <Image
                                    src={binicon}
                                    alt="View icon"
                                    className="w-full h-auto"
                                  />
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td className="text-center !border-none" colSpan={7}>
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {getupcomingdepodata?.data?.totalCount > 4 && (
            <div className="table-meta-wrap">
              {getupcomingdepodata?.data?.totalCount > 7 && (
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
                          onClick={() => handleRow(4)}
                        >
                          4
                        </li>
                        <li
                          data-value="2"
                          className="select-dropdown__list-item"
                          onClick={() => handleRow(8)}
                        >
                          8
                        </li>
                        {getupcomingdepodata?.data?.totalCount > 11 && (
                          <li
                            data-value="3"
                            className="select-dropdown__list-item"
                            onClick={() => handleRow(12)}
                          >
                            12
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              <div className="table-pagination">
                <span className="table-pagination-text">
                  {startpagecount}-{endpagecount} of{' '}
                  {getupcomingdepodata?.data?.totalCount}
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
                  disabled={
                    endpagecount === getupcomingdepodata?.data?.totalCount
                  }
                  onClick={handlenext}
                >
                  <Image src={nexticon} alt="" />
                </button>
              </div>
            </div>
          )}
          {upcomingdepomodal !== '' && (
            <DepositiondetailsModal
              status={modalstatus}
              handlechange={handlechange}
              depoid={upcomingdepomodal}
              axiosAuth={axiosAuth}
            />
          )}
        </>
      ) : (
        'Loading ....'
      )}
    </div>
  );
};

export default Upcomingdeposition;
