'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import copyicon from '../../../../../assets/images/case-icon/copy-icon.svg';
import updepositionicon from '../../../../../assets/images/case-icon/up-deposition-icon.svg';
import CloseIcon from '../../../../../assets/images/payment/close-icon.svg';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import useSWR from 'swr';
import {
  durationextractor,
  getFormattedDate,
  minuteextractor,
} from '@/helpers/mischelper';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Loader from '../../CourtReporter/Loader';
const DepositiondetailsModal = ({
  name,
  status,
  handlechange,
  depoid,
  axiosAuth,
}) => {
  const [copied, setcopied] = useState(false);
  const handlemodal = () => {
    handlechange();
  };
  const {
    data: getdepodetails,
    error,
    isLoading,
  } = useSWR(
    [`/case/getDepoDetailsById/${depoid}`, axiosAuth],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        return { data };
      },
    }
  );

  // start: eval(item?.start).toISOString(),
  // end: eval(item?.end).toISOString(),
  return (
    <>
      <input type="checkbox" id="payment" className="modal-toggle" />

      <div className="modal">
        {!isLoading ? (
          <div className="modal-box !max-w-[64rem] max-h-[96.89vh]">
            <div className="modal-action absolute right-6 top-0">
              <div
                onClick={handlemodal}
                className="w-[2.375rem] flex items-center justify-center overflow-hidden cursor-pointer"
              >
                <Image
                  src={CloseIcon}
                  alt="Close icon"
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 pb-5">
              <Image src={updepositionicon} alt="" />
              {status === '2' || status === '1' ? (
                <h4>Upcoming Deposition</h4>
              ) : (
                <h4>Previous Deposition</h4>
              )}
            </div>
            <div className="bg-sky-50 rounded-xl p-6  grid grid-cols-1 lg:grid-cols-5 gap-5">
              <div className="location-item">
                <span className="location-label">Deponent Name</span>
                <strong className="location-value">
                  {getdepodetails?.data?.deponent_name ? getdepodetails?.data?.deponent_name : '--'}
                </strong>
              </div>
              <div className="location-item">
                <span className="location-label">Schedule Date</span>
                <strong className="location-value">
                  {getFormattedDate(
                    eval(getdepodetails?.data?.start)?.toISOString()
                  )}
                </strong>
              </div>
              <div className="location-item">
                <span className="location-label">Schedule Time</span>
                <strong className="location-value">
                  {getdepodetails?.data?.start !== null
                    ? minuteextractor(
                      eval(getdepodetails?.data?.start)?.toISOString()
                    )
                    : '--'}
                </strong>
              </div>
              <div className="location-item">
                <span className="location-label">Duration</span>
                <strong className="location-value">
                  {getdepodetails?.data?.start !== null
                    ? durationextractor(
                      eval(getdepodetails?.data?.start)?.toISOString(),
                      eval(getdepodetails?.data?.end)?.toISOString()
                    )
                    : '--'}
                </strong>
              </div>
              <div className="location-item">
                <span className="location-label">Deposition Type</span>
                <strong className="location-value">
                  {getdepodetails?.data?.type}
                </strong>
              </div>
            </div>
            {status === '2' && getdepodetails?.data?.zoom_link !== '' && (
              <div className="bg-blue-100 rounded-lg p-6 flex justify-between items-center mt-8">
                <div className="flex zoom-link gap-3">
                  <h5>Zoom Link:</h5>
                  <div className="text-blue-600 text-sm">
                    {getdepodetails?.data?.zoom_link}
                    {/* https://us02web.zoom.us/j/81467125854567?pwd=SGDJNFKJENMDMDBDNND1ueVFtRWpidz09 */}
                  </div>
                </div>
                <div className="flex items-center justify-center flex-col">
                  <CopyToClipboard
                    className="cursor-pointer mb-2"
                    text={getdepodetails?.data?.zoom_link}
                    onCopy={() => setcopied(true)}
                  >
                    <Image src={copyicon} alt="" />
                  </CopyToClipboard>
                  {copied && <span>Copied</span>}
                </div>
              </div>
            )}
            <div className="c-table mt-8">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Email ID</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getdepodetails?.data?.invitee_list?.map((item, i) => (
                      <tr key={i}>
                        <td>{item?.first_name}</td>
                        <td>{item?.role_name}</td>
                        <td>{item?.email}</td>
                        <td>
                          <span
                            className={`${item?.status === '1'
                              ? 'text-accept'
                              : item?.status === '0'
                                ? 'text-decline'
                                : 'text-waiting'
                              }`}
                          >
                            {item?.status === '1'
                              ? 'Accepted'
                              : item?.status === '2'
                                ? 'Pending'
                                : item?.status === '3'
                                  ? 'Reschedule request'
                                  : item?.status === '4'
                                    ? 'Waiting for payment'
                                    : item?.status === '0' && 'Rejected'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-action mt-[1.875rem]">
              <div className="primary-btn cursor-pointer" onClick={handlemodal}>
                Close
              </div>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

export default DepositiondetailsModal;
