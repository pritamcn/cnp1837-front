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
import moment from 'moment';
import Loader from '../Loader';
const CaseReviewDetailsModal = ({
  handlechange,
  caseid,
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
    [`/getDepoRequestDetailsById/${caseid}`, axiosAuth],
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
      <input type="checkbox" id="reviewmodal" className="modal-toggle" />

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
              <h4>Case Review Details</h4>
            </div>
            <div className="bg-sky-50 rounded-xl p-6  grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="location-item">
                <span className="location-label">Case Name</span>
                <strong className="location-value">
                  {getdepodetails?.data?.case_name}
                </strong>
              </div>
              <div className="location-item">
                <span className="location-label">Start Time</span>
                <strong className="location-value">
                  {getdepodetails?.data?.creator_availability_start !== null
                    ? moment(getdepodetails?.data?.creator_availability_start).format('MM/DD/YYYY HH:MM')
                    : '--'}
                </strong>
              </div>
              <div className="location-item">
                <span className="location-label">End Time</span>
                <strong className="location-value">
                  {getdepodetails?.data?.creator_availability_end !== null
                    ? moment(getdepodetails?.data?.creator_availability_end).format('MM/DD/YYYY HH:MM')
                    : '--'}
                </strong>
              </div>
            </div>

            <div className="c-table mt-8">
              <h4>Defendant Lawyers</h4>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getdepodetails?.data?.defendant_lawyers?.map((item, i) => (
                      <tr key={i}>
                        <td>{item?.first_name + ' ' + item?.last_name}</td>
                        <td>{item?.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="c-table mt-8">
              <h4>Plaintiff Lawyers</h4>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getdepodetails?.data?.plaintiff_lawyers?.map((item, i) => (
                      <tr key={i}>
                        <td>{item?.first_name + ' ' + item?.last_name}</td>
                        <td>{item?.email}</td>
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

export default CaseReviewDetailsModal;
