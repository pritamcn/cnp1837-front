'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import prevdepositionicon from '../../../../../assets/images/case-icon/prev-deposition-icon.svg';
import previcon from '../../../../../assets/images/icons/table-grey-prev-icon.svg';
import nexticon from '../../../../../assets/images/icons/table-grey-next-icon.svg';
import soliddownicon from '../../../../../assets/images/icons/grey-solid-down-icon.svg';
import previewcaseicon from '../../../../../assets/images/icons/preview-case-icon.svg';
import DepositiondetailsModal from '../Modal/DepositiondetailsModal';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import useSWR from 'swr';
import {
  durationextractor,
  getFormattedDate,
  minuteextractor,
} from '@/helpers/mischelper';
const Previousdeposition = ({ caseid, axiosAuth }) => {
  const [row, setrow] = useState(false);
  const [rowvalue, setrowvalue] = useState(4);
  const [startpagecount, setstartpagecount] = useState(1);
  const [endpagecount, setendpagecount] = useState(4);
  const [previousdepomodal, setpreviousdepomodal] = useState('');
  const [modalstatus, setmodalstatus] = useState('');
  const {
    data: getpreviousdepodata,
    error,
    isLoading,
  } = useSWR(
    [
      `/case/getPastDepositionList/${caseid}?startCount=${startpagecount}&endCount=${endpagecount}`,
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
      startpagecount < getpreviousdepodata?.data?.totalCount - rowvalue &&
      startpagecount !== 1
    ) {
      setstartpagecount((prev) => prev - rowvalue);
      setendpagecount((prev) => prev - rowvalue);
    } else if (
      startpagecount < getpreviousdepodata?.data?.totalCount ||
      startpagecount === getpreviousdepodata?.data?.totalCount
    ) {
      let temppagecount = startpagecount - rowvalue;
      let temppage2count = temppagecount + (rowvalue - 1);
      setstartpagecount(temppagecount);
      setendpagecount(temppage2count);
    }
  };
  const handlenext = () => {
    if (endpagecount < getpreviousdepodata?.data?.totalCount - rowvalue) {
      setstartpagecount((prev) => prev + rowvalue);
      setendpagecount((prev) => prev + rowvalue);
    } else if (endpagecount < getpreviousdepodata?.data?.totalCount) {
      setstartpagecount((prev) => prev + rowvalue);
      setendpagecount(getpreviousdepodata?.data?.totalCount);
    }
  };
  const handlechange = () => {
    setpreviousdepomodal('');
  };
  const handlemodal = (id, status) => {
    setpreviousdepomodal(id);
    setmodalstatus(status);
  };
  return (
    <div className="bg-white rounded-xl p-6 mt-8">
      <div className="flex flex-wrap items-center gap-4 pb-5">
        <Image src={prevdepositionicon} alt="" />
        <h4>Previous Depositions</h4>
      </div>

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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {getpreviousdepodata?.data?.totalCount > 0 ? (
                getpreviousdepodata?.data?.previousDepoList?.map(
                  (prevdepo, i) => (
                    <tr key={i}>
                      <td>{prevdepo?.deponent_name ? prevdepo?.deponent_name : '--'}</td>
                      <td>{getFormattedDate(prevdepo?.start_time)}</td>
                      <td>
                        {prevdepo?.start_time !== null
                          ? minuteextractor(prevdepo?.start_time)
                          : '--'}
                      </td>
                      <td>
                        {prevdepo?.start_time !== null
                          ? durationextractor(
                            prevdepo?.start_time,
                            prevdepo?.end_time
                          )
                          : '--'}
                      </td>
                      <td>
                        {prevdepo?.case_invitees[0]?.email}
                        <div className="dropdown dropdown-bottom dropdown-end">
                          <label tabindex="0" className="attend-count">
                            +{prevdepo?.case_invitees?.length - 1}
                          </label>
                          <ul
                            tabindex="0"
                            className="dropdown-content menu attend-count-ul"
                          >
                            {prevdepo?.case_invitees?.map((item2, i2) => (
                              <li className="attend-count-li" key={i2}>
                                <span className="user-email">
                                  {item2?.email}
                                </span>
                                <span className="user-pos">
                                  {item2?.role_name}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                      <td>
                        <span className="text-accept">
                          {prevdepo?.status === '1'
                            ? 'Pending'
                            : prevdepo?.status === '2'
                              ? 'Scheduled'
                              : prevdepo?.status === '3'
                                ? 'Completed'
                                : prevdepo?.status === '4'
                                  ? 'Refund completed'
                                  : prevdepo?.status === '0' && 'Refund Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="w-[5.25rem] flex items-center justify-center">
                          <div className="tooltip text-left" data-tip="View">
                            <label
                              htmlFor="payment"
                              className="w-5 overflow-hidden flex items-center justify-center cursor-pointer"
                              onClick={() =>
                                handlemodal(prevdepo?.id, prevdepo?.status)
                              }
                            >
                              <Image
                                src={previewcaseicon}
                                alt="View icon"
                                className="w-full h-auto"
                              />
                            </label>
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
      {getpreviousdepodata?.data?.totalCount > 4 && (
        <div className="table-meta-wrap">
          {getpreviousdepodata?.data?.totalCount > 7 && (
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
                    {getpreviousdepodata?.data?.totalCount > 11 && (
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
              {getpreviousdepodata?.data?.totalCount}
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
              disabled={endpagecount === getpreviousdepodata?.data?.totalCount}
              onClick={handlenext}
            >
              <Image src={nexticon} alt="" />
            </button>
          </div>
        </div>
      )}
      {previousdepomodal !== '' && (
        <DepositiondetailsModal
          status={modalstatus}
          handlechange={handlechange}
          depoid={previousdepomodal}
          axiosAuth={axiosAuth}
        />
      )}
    </div>
  );
};

export default Previousdeposition;
