'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import updepositionicon from '../../../../../assets/images/case-icon/up-deposition-icon.svg';
import DownloadIcon from '../../../../../assets/images/deposition-requests-and-scheduling/download-fill-icon.svg';
import CloseIcon from '../../../../../assets/images/payment/close-icon.svg';
import FileIcon from '../../../../../assets/images/deposition-request/file-icon.svg';
import NotFileIcon from '../../../../../assets/images/deposition-request/prohibited-file-icon.svg';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { transcriptFilePath } from '@/config';
import { toast } from 'react-toastify';
import { UpdateWithTokenapi } from '@/services/module/api/putapi';
import JsFileDownloader from 'js-file-downloader';
import moment from 'moment';
import Loader from '../../CourtReporter/Loader';

const DownloadTranscriptFile = ({ handlechange, depoid, axiosAuth }) => {
  const [transcriptData, setTranscriptData] = useState([]);
  const [downloadAvailable, setDownloadAvailable] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [transcriptId, setTranscriptId] = useState('');

  const {
    trigger,
    isMutating,
    data: updatedata,
    updateerror,
  } = useSWRMutation(`/transcript/transcriptFileDownload/${transcriptId}`, UpdateWithTokenapi);

  const {
    data: gettranscriptdetails,
    error,
    isLoading,
    mutate,
  } = useSWR(
    [`/transcript/getTranscriptFiles/${depoid}`, axiosAuth],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        return { data };
      },
    }
  );

  useEffect(() => {
    if (gettranscriptdetails?.status === 200) {
      setTranscriptData(gettranscriptdetails?.data?.data);
      setDownloadAvailable(gettranscriptdetails?.data?.restDownload);
    }
    if (gettranscriptdetails === undefined && error?.response?.status === 409) {
      setTranscriptData([]);
      setDownloadAvailable(0);
    }
  }, [gettranscriptdetails, error]);

  useEffect(() => {
    if (updatedata?.status === 201) {
      onDownloadHandler();
      setTranscriptId('');
      mutate();
    }
    if (updatedata?.status === 200) {
      toast.error(updatedata?.data?.message);
      onDownloadHandler();
      setTranscriptId('');
      mutate();
    }
    if (updatedata === undefined && updateerror?.response?.status === 409) {
      toast.error(updateerror?.response?.data?.message);
      setTranscriptId('');
    }
  }, [updatedata, updateerror]);

  const handlemodal = () => {
    setTranscriptId('');
    handlechange();
  };

  const handleConfirmModal = () => {
    setTranscriptId('');
  };

  const downloadLinkHandler = (item) => {
    setDownloadLink(item?.file_path);
    setTranscriptId(item?.id);
  };

  const onConfirm = () => {
    trigger({ axios: axiosAuth });
  };

  const onDownloadHandler = () => {
    const download = new JsFileDownloader({
      url: downloadLink ? transcriptFilePath + '/' + downloadLink : '',
      autoStart: false
    });

    download.start()
      .then(function () {
        toast.success('Download Completed');
        setDownloadLink('');
      })
      .catch(function (error) {
        toast.error('Download Not Completed')
        setDownloadLink('');
      });
  }

  return (
    <>
      <input
        type="checkbox"
        id="transcript-file-modal"
        className="modal-toggle"
      />

      <div className="modal">
        {!isLoading ? (
          <>
            {transcriptId === '' ? (
              <div className="modal-box !max-w-[42rem] max-h-[96.89vh]">
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
                  <div className='gap-2'>
                    <h4>Transcript Files</h4>
                    <h5>Your Download Balance: {downloadAvailable}</h5>
                  </div>
                </div>
                <div className="c-table mt-8">
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      {/* head */}
                      <thead>
                        <tr>
                          <th>Version</th>
                          <th>Create Time</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transcriptData.length > 0 ?
                          transcriptData?.map((item, i) => (
                            <tr key={i}>
                              <td>{item?.version}</td>
                              <td>{moment(item?.created_at).format('MM/DD/YYYY HH:MM')}</td>
                              <td>
                                {parseInt(downloadAvailable) > 0 ?
                                  <label className='text-sky-400 cursor-pointer tooltip' data-tip="Download"
                                    onClick={() => downloadLinkHandler(item)}
                                  >
                                    <Image src={FileIcon} className="i-chevron-down"
                                      alt="" />
                                  </label> :
                                  <label className='text-sky-400 cursor-pointer tooltip' data-tip="Download Unavailable">
                                    <Image src={NotFileIcon} className="i-chevron-down"
                                      alt="" />
                                  </label>
                                }
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={6} className="text-center">
                                Sorry no data found
                              </td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-action mt-[1.875rem]">
                  <div
                    className="primary-btn cursor-pointer"
                    onClick={handlemodal}
                  >
                    Close
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="modal-box">
                  <div className="modal-action absolute right-6 top-0">
                    <div
                      onClick={handleConfirmModal}
                      className="w-[2.375rem] flex items-center justify-center overflow-hidden cursor-pointer"
                    >
                      <Image
                        src={CloseIcon}
                        alt="Close icon"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  <h4>Available Download Balance: {downloadAvailable}</h4>
                  <h5 className="my-4">
                    {
                      'Your download balance will be deducted. Do you want to proceed?'
                    }
                  </h5>
                  <div className="modal-body my-7">
                    <div className="w-40 overflow-hidden flex items-center justify-center mx-auto">
                      <Image
                        src={DownloadIcon}
                        className="w-full h-auto"
                        alt="Download icon"
                      />
                    </div>
                  </div>
                  <div className="modal-action">
                    <div className="flex flex-wrap justify-center w-full">
                      <label
                        type="button"
                        className="primary-btn btn-outline"
                        onClick={handleConfirmModal}
                      >
                        No
                      </label>

                      <label className="primary-btn ml-2.5" onClick={onConfirm}>
                        Yes
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

export default DownloadTranscriptFile;
