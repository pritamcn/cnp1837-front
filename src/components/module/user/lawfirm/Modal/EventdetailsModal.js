'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import CloseIcon from '../../../../../assets/images/icons/close-icon.svg';
import Image from 'next/image';
import SquareDotIcon from '../../../../../assets/images/deposition-requests-and-scheduling/square-dot-icon.svg';
import VideoCallIcon from '../../../../../assets/images/deposition-requests-and-scheduling/video-call-icon.svg';
import CopyIcon from '../../../../../assets/images/deposition-requests-and-scheduling/copy-icon.svg';
import TeamIcon from '../../../../../assets/images/deposition-requests-and-scheduling/team-icon.svg';
import UserIcon from '../../../../../assets/images/deposition-requests-and-scheduling/user-icon.svg';
import CheckIcon from '../../../../../assets/images/deposition-requests-and-scheduling/check-icon.svg';
import DashboardIcon from '../../../../../assets/images/icons/dashboard-dark-icon.svg';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import useSWR from 'swr';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import { getFormattedDate } from '@/helpers/mischelper';
import CopyToClipboard from 'react-copy-to-clipboard';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '9999',
    width: '39rem',
    position: 'relative',
    padding: '0',
    maxHeight: 'calc(100vh - 10rem)',
    overflow: 'hidden',
  },
};
const EventDetailsModal = ({
  modalIsOpen,
  closeModal,
  clickdepoid,
  axiosAuth,
}) => {
  const [starttime, setstarttime] = useState(null);
  const [endtime, setendtime] = useState(null);
  const [copied, setcopied] = useState(false);
  const [startcalendarvalue, setstartcalendarvalue] = useState('');
  const [endcalendarvalue, setendcalendarvalue] = useState('');
  const format = 'H:mm';
  const { data: getdepodata, isLoading } = useSWR(
    [`/case/getDepoDetailsById/${clickdepoid}`, axiosAuth],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );
  useEffect(() => {
    if (getdepodata?.status === 200) {
      let start = eval(getdepodata?.data?.start);
      let end = eval(getdepodata?.data?.end);
      setstartcalendarvalue(start.toISOString());
      setendcalendarvalue(end.toISOString());
      let startvalue = moment()
        .hour(parseInt(start.getHours()))
        .minute(parseInt(start.getMinutes()));
      let endvalue = moment()
        .hour(parseInt(end.getHours()))
        .minute(parseInt(end.getMinutes()));
      setstarttime(startvalue);
      setendtime(endvalue);
    }
  }, [getdepodata]);
  return (
    <Modal
      isOpen={modalIsOpen}
      ariaHideApp={false}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <>
        <div className="flex items-center justify-end fixed top-0 left-0 w-full shadow bg-white">
          <button
            title="Close modal"
            onClick={closeModal}
            type="button"
            className="w-[3.375rem] overflow-hidden flex items-center justify-center p-[1.0625rem] bg-none border-none"
          >
            <Image src={CloseIcon} alt="Close Icon" className="w-full h-auto" />
          </button>
        </div>
        <ul className="px-8 -my-[0.625rem] py-[5.25rem] h-[calc(100vh-8.75rem)] overflow-y-auto">
          <li className="flex items-start py-[0.625rem]">
            <i className="w-5 flex-[0_0_1.25rem] overflow-hidden flex items-center justify-center mr-[1.75rem] pt-3">
              <Image
                src={SquareDotIcon}
                alt="Square dot icon"
                className="w-full h-auto"
              />
            </i>
            <div className="flex-1">
              <h1 className="text-[1.375rem] font-normal mb-2">
                Depo name::&nbsp;{getdepodata?.data?.deponent_name}
              </h1>
              <div className="flex gap-5 pt-3">
                <div className="flex items-center gap-2 relative flex-[0_0_15.3125rem]">
                  <div className="flex flex-col gap-2 flex-[0_0_8.125rem]">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Start date
                      </label>
                      <input
                        type="text"
                        placeholder="Start Date"
                        className="form-control !h-12"
                        value={
                          startcalendarvalue !== ''
                            ? getFormattedDate(startcalendarvalue)
                            : ''
                        }
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Start time
                    </label>
                    <TimePicker
                      showSecond={false}
                      placeholder="Add Start time"
                      value={starttime}
                      className="s-time-picker"
                      disabled
                      inputReadOnly
                    />
                  </div>
                </div>
                <div className="relative flex-[0_0_6.9375rem]">
                  <label className="block text-sm font-medium mb-1">
                    End time
                  </label>
                  <TimePicker
                    showSecond={false}
                    placeholder="Add end time"
                    value={endtime}
                    className="s-time-picker"
                    disabled
                    inputReadOnly
                  />
                </div>
              </div>
            </div>
          </li>
          <li className="flex items-start py-[0.625rem]">
            <i className="w-5 flex-[0_0_1.25rem] overflow-hidden flex items-center justify-center mr-[1.75rem]">
              <Image
                src={DashboardIcon}
                alt="Square dot icon"
                className="w-full h-auto"
              />
            </i>
            <div className="flex-1">
              <div className="text-1rem font-normal">
                Case name:&nbsp;{getdepodata?.data?.case_name}
              </div>
            </div>
          </li>
          <li className="flex items-start py-[0.625rem]">
            <i className="w-5 flex-[0_0_1.25rem] overflow-hidden flex items-center justify-center mr-[1.75rem]">
              <Image
                src={DashboardIcon}
                alt="Square dot icon"
                className="w-full h-auto"
              />
            </i>
            <div className="flex-1">
              <div className="text-1rem font-normal">
                Type:&nbsp;{getdepodata?.data?.type}
              </div>
            </div>
          </li>
          <li className="flex items-start py-[0.625rem]">
            <i className="w-5 flex-[0_0_1.25rem] overflow-hidden flex items-center justify-center mr-[1.75rem]">
              <Image
                src={DashboardIcon}
                alt="Square dot icon"
                className="w-full h-auto"
              />
            </i>
            <div className="flex-1">
              <div className="text-1rem font-normal">
                Case details:&nbsp;{getdepodata?.data?.case_details}
              </div>
            </div>
          </li>
          {getdepodata?.data?.zoom_link !== '' && (
            <li className="flex items-start py-[0.625rem]">
              <i className="w-5 flex-[0_0_1.25rem] overflow-hidden flex items-center justify-center mr-[1.75rem]">
                <Image
                  src={VideoCallIcon}
                  alt="Video call icon"
                  className="w-full h-auto"
                />
              </i>

              <div className="flex-1">
                <div
                  className="text-xs text-primary hover:text-primary hover:underline"
                  //onClick={()=>handlezoom(getdepodata?.data?.zoom_link)}
                >
                  {getdepodata?.data?.zoom_link}
                </div>
              </div>
              <div
                className="w-8 flex-[0_0_2rem] overflow-hidden flex items-center justify-center pb-3 pl-3 border-none bg-transparen"
                title="Copy zoom call link to clipboard"
              >
                <CopyToClipboard
                  className="cursor-pointer mb-2"
                  text={getdepodata?.data?.zoom_link}
                  onCopy={() => setcopied(true)}
                >
                  <Image
                    src={CopyIcon}
                    alt="Copy icon"
                    className="w-full h-auto"
                  />
                </CopyToClipboard>
                {copied && <span>Copied</span>}
              </div>
            </li>
          )}
          <li className="flex items-start py-[0.625rem]">
            <i className="w-5 flex-[0_0_1.25rem] overflow-hidden flex items-center justify-center mr-[1.75rem]">
              <Image src={TeamIcon} alt="Team icon" className="w-full h-auto" />
            </i>
            <div className="flex-1">
              <h2 className="text-[0.875rem] font-normal">
                {getdepodata?.data?.invitee_list?.length} guests
              </h2>
              <ul className="-my-2 pt-3">
                {getdepodata?.data?.invitee_list?.map((invitee, i) => (
                  <li className="flex items-center py-2" key={i}>
                    <div className="relative flex-[0_0_2rem] mr-5">
                      <i className="w-6 overflow-hidden flex items-center justify-center">
                        <Image
                          src={UserIcon}
                          alt="User icon"
                          className="w-full h-auto"
                        />
                      </i>

                      <i className="w-[0.875rem] overflow-hidden flex items-center justify-center absolute bottom-0 right-0">
                        <Image
                          src={CheckIcon}
                          alt="Check icon"
                          className="w-full h-auto"
                        />
                      </i>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-[0.875rem] font-normal">
                        {invitee?.first_name} {invitee?.last_name}
                      </h2>
                      <h3 className="text-xs font-normal">
                        {invitee?.role_name}
                      </h3>
                      <h3 className="text-xs font-normal truncate max-w-[21.5625rem]">
                        {invitee?.email}
                      </h3>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
        <div className="flex items-center justify-end fixed bottom-0 left-0 w-full shadow-[0_-1px_3px__rgba(0,0,0,0.2)] p-3 bg-white">
          <button
            type="button"
            className="primary-btn btn-outline mr-3"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      </>
    </Modal>
  );
};

export default EventDetailsModal;
