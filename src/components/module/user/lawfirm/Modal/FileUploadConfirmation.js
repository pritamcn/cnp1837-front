'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import CloseIcon from '../../../../../assets/images/icons/close-icon.svg';
import Image from 'next/image';
// import binIcon from '../../../../../assets/images/icons/delete.svg';
import DownloadIcon from '../../../../../assets/images/deposition-requests-and-scheduling/download-icon.svg';
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
const FileUploadConfirmationModal = ({ modalIsOpen, closeModal }) => {
  let handleCloseModal=(type)=>{
   closeModal(type)
  }
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
          onClick={()=>handleCloseModal("no")}
          type="button"
          className="w-[3.375rem] overflow-hidden flex items-center justify-center p-[1.0625rem] bg-none border-none absolute top-0 right-0"
        >
          <Image src={CloseIcon} alt="Close Icon" className="w-full h-auto" />
        </button>
        <div className="text-center">
          <h3 className="mb-0">Are you sure you want to upload</h3>
          <Image src={DownloadIcon} className="mx-auto my-10 rotate-180 h-28" alt="" />
        </div>
        <h6 className="mb-4 text-center">Note:Uploading File will only be visible into chat page.</h6>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            className="primary-btn btn-outline"
            onClick={()=>handleCloseModal("no")}
          >
            No
          </button>
          <button type="button" className="primary-btn" onClick={()=>handleCloseModal("yes")}>
            Yes
          </button>
        </div>
        
      </>
    </Modal>
  );
};

export default FileUploadConfirmationModal;
