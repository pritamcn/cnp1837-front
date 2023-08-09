'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import CloseIcon from '../../../../../assets/images/icons/close-icon.svg';
import Image from 'next/image';
import defaulticon from '../../../../../assets/images/icons/default.svg';
import DownloadIcon from '../../../../../assets/images/deposition-requests-and-scheduling/download-icon.svg';
import { UpdateWithTokenapi } from '@/services/module/api/putapi';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';
import { redirect } from 'next/navigation';
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
    padding: '3rem',
  },
};
const InactiveCasemodal = ({ modalIsOpen, closeModal,caseid,axiosAuth,roleid }) => {
    const {
        trigger,
        isMutating,
        data: putdata,
    } = useSWRMutation(`/case/updateStatus/${caseid}`, UpdateWithTokenapi);
  let handleCloseModal=()=>{
   closeModal()
  }
  let handleConfirm=()=>{
    let payload={
        status:"2"
    }
    trigger({ data: payload, axios: axiosAuth });
  }
  useEffect(() => {
    if (putdata?.status === 200) {
        toast.success(putdata?.data?.message);
        redirect(
            `${
              roleid === '6' ? '/AttorneyAssistant' : '/Attorney'
            }/casemanagement`
          );
    }
}, [putdata])
  return (
    <Modal
      isOpen={modalIsOpen}
      ariaHideApp={false}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <>
        <button
          title="Close modal"
          onClick={handleCloseModal}
          type="button"
          className="w-[3.375rem] overflow-hidden flex items-center justify-center p-[1.0625rem] bg-none border-none absolute top-0 right-0"
        >
          <Image src={CloseIcon} alt="Close Icon" className="w-full h-auto" />
        </button>
        <div className="text-center">
          <h3 className="mb-0">Are you sure you want to inactive case</h3>
          <Image src={defaulticon} className="mx-auto my-10 rotate-180 h-28" alt="" />
        </div>
        <h6 className="mb-4 text-center">Note:if you inactive case,deposition related this case will also be cancel as well as you can't active this case once again</h6>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            className="primary-btn btn-outline"
            onClick={handleCloseModal}
          >
            No
          </button>
          <button type="button" className="primary-btn" onClick={handleConfirm}>
            Yes
          </button>
        </div>
        
      </>
    </Modal>
  );
};

export default InactiveCasemodal;
