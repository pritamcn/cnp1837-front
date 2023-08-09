'use client';
import React, { useEffect, useState } from 'react';
import browseicon from '../../../../../assets/images/case-icon/browse-file-popup-icon.svg';
import Image from 'next/image';
import {
  WithTokenSingleFormdataPostApi,
  WithTokenPostApi,
} from '@/services/module/api/postapi';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import Link from 'next/link';

const UploadFileModal = ({ depo_id, handleclose }) => {
  const axiosAuth = useAxiosAuth();
  const [error, seterror] = useState('');
  const [uploadFile, setUploadFile] = useState('');
  const handlecancel = () => {
    handleclose();
  };

  const {
    trigger: fileuploadtrigger,
    isMutating,
    data: filedata,
  } = useSWRMutation(
    `/fileUpload/transcript_upload`,
    WithTokenSingleFormdataPostApi
  );

  const {
    trigger: transcripttrigger,
    isMutating: mutating,
    data: transcriptdata,
    error: transcripterror,
  } = useSWRMutation(`/transcript/transcriptionsFileUpload`, WithTokenPostApi);

  useEffect(() => {
    if (filedata?.status === 200) {
      let payload = {
        deposition_id: depo_id,
        file_path: filedata?.data?.fileData[0]?.file_name,
      };
      transcripttrigger({ payload: payload, axios: axiosAuth });
    }
  }, [filedata]);

  useEffect(() => {
    if (transcriptdata?.status === 200) {
      toast.success(transcriptdata?.data?.message);
      handlecancel();
    }
    if (
      transcriptdata === undefined &&
      transcripterror?.response?.status === 409
    ) {
      toast.error(transcripterror?.response?.data?.message);
    }
  }, [transcriptdata, transcripterror]);

  const handleFieldChange = (e) => {
    if (e.target.type === 'file') {
      if (e.target.files[0].size > 2000000) {
        seterror("File size can't be more than 2 mb");
      }
      if (e.target.files[0].name.slice(-5) === '.pdf') {
        seterror('You can only add pdf extension');
      }
      if (
        e.target.files[0].size < 2000000 &&
        e.target.files[0].name.slice(-5) !== '.pdf'
      ) {
        seterror('');
        setUploadFile(e.target.files[0]);
      }
    }
  };

  const handleSave = () => {
    if (uploadFile !== '') {
      fileuploadtrigger({
        payload: uploadFile,
        axios: axiosAuth,
        name: 'upload_files',
      });
    }
  };

  return (
    <>
      <input type="checkbox" id="transcript-file" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <label className="modal-close-btn" onClick={handlecancel}>
            ✕
          </label>
          <h3 className="modal-title">Upload Transcript File</h3>
          <div className="modal-body">
            <div className="flex justify-center">
              <Link
                target="_blank"
                className="no-underline hover:underline text-green-400"
                href={uploadFile !== '' ? URL?.createObjectURL(uploadFile) : ''}
              >
                <h5 className="text-green-400">
                  {uploadFile !== '' && uploadFile?.name}
                </h5>
              </Link>
            </div>
            {error !== '' && (
              <div className="cl-col basis-auto">
                <span className=" text-red-700 text-xs">{error}</span>
              </div>
            )}
            <div className="mt-5 max-w-sm mx-auto">
              <input
                type="file"
                className="file-input w-full max-w-xs hidden"
                id="file-upload"
                hidden
                accept="application/pdf"
                multiple={false}
                onChange={handleFieldChange}
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center bg-white hover:bg-slate-50 justify-center cursor-pointer h-20 border-dashed border border-slate-400 rounded"
              >
                <Image src={browseicon} alt="" className="w-9" />
                <span>Browse File</span>
              </label>
            </div>
          </div>
          <div className="modal-action">
            <div className="flex flex-wrap justify-center w-full">
              <label
                type="button"
                className="primary-btn btn-outline cursor-pointer"
                onClick={handlecancel}
              >
                Cancel
              </label>
              {(uploadFile !== '' || isMutating) && (
                <div
                  type="button"
                  className="primary-btn ml-2.5"
                  onClick={handleSave}
                >
                  Save
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadFileModal;
