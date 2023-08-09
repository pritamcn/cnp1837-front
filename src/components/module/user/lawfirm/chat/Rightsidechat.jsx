'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import UploadIcon from '../../../../../assets/images/chat/upload-icon.svg';
import useSWR from 'swr';
import SendIcon from '../../../../../assets/images/chat/send-icon.svg';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { getFormattedDate, minuteextractor } from '@/helpers/mischelper';
import ScrollableFeed from 'react-scrollable-feed';
import useSWRMutation from 'swr/mutation';
import { WithTokenSingleFormdataPostApi } from '@/services/module/api/postapi';
import { chatFilePath } from '@/config';
import SkeletonCard from './Chatskeleton';
import FileUploadConfirmationModal from '../Modal/FileUploadConfirmation';
import fileIcon from '../../../../../assets/images/deposition-request/file-icon.svg';
import chat from '../../../../../assets/images/chat/chat.svg';

const Rightsidechat = ({ roomusers, deposition_id, session, socket }) => {
  const [currentmessage, setcurrentmessage] = useState('');
  const axiosAuth = useAxiosAuth();
  let username = session?.user?.first_name + ' ' + session?.user?.last_name;
  const [chatmessages, setchatmessages] = useState([]);
  const [startCount, setstartcount] = useState(1);
  const [filepayload, setfilepayload] = useState('');
  const [chatfileupload, setchatfileupload] = useState(false);
  const [chattype, setchattype] = useState('');
  const [errors, seterrors] = useState('');
  const [endCount, setendCount] = useState(15);
  const [fileuploadmodal, setfileuploadmodal] = useState(false);
  const [totalCount, settotalCount] = useState(0);
  const {
    data: getchatdata,
    isLoading,
    error,
  } = useSWR(
    [
      `/chat/getChats/${deposition_id}?startCount=${startCount}&endCount=${endCount}`,
      axiosAuth,
    ],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );
  const {
    trigger: imageuploadtrigger,
    isMutating,
    data: imagedata,
  } = useSWRMutation(
    '/chatFileUpload/chat_upload',
    WithTokenSingleFormdataPostApi
  );
  const handleSend = () => {
    if (currentmessage !== '') {
      socket.emit('send_message', {
        user_id: session?.user?.id,
        deposition_id,
        message: currentmessage,
        username,
        files: [],
      });
      setcurrentmessage('');
    }
  };
  useEffect(() => {
    socket.on('receive_message', (data) => {
      setchatmessages((state) => [
        ...state,
        {
          deposition_id: data.deposition_id,
          file_name: data.file_name,
          message: data.message,
          username: data.user_name,
          user_id: parseInt(data.user_id),
          created_at: data.created_at,
        },
      ]);
    });
  }, [socket]);
  useEffect(() => {
    if (getchatdata?.status === 200 && startCount === 1) {
      let filterdata = getchatdata?.data?.data?.map((item) => {
        return {
          deposition_id: item?.deposition_id,
          file_name: item?.file_name,
          message: item?.message,
          user_id: item?.user_id,
          username: item?.user?.full_name,
          created_at: item?.createdAt,
        };
      });
      setchatmessages(filterdata?.reverse());
      settotalCount(getchatdata?.data?.totalCount);
      setchattype(
        getchatdata?.data?.active === 0 ?
          "You can't chat after 14 days of deposition end":""
      );
    }
    if (getchatdata?.status === 200 && startCount !== 1) {
      let filterdata = getchatdata?.data?.data?.map((item) => {
        return {
          deposition_id: item?.deposition_id,
          file_name: item?.file_name,
          message: item?.message,
          user_id: item?.user_id,
          username: item?.user?.full_name,
          created_at: item?.createdAt,
        };
      });
      let tempchat = [...filterdata?.reverse(), ...chatmessages];
      const element = document.getElementsByClassName(
        'styles_scrollable-div__prSCv'
      );
      element[0].scrollTo(51, 51);
      setchatmessages(tempchat);
    }
    if (error !== undefined && error?.response?.status !== 403) {
      seterrors('Deposition not exist');
    }
  }, [getchatdata, error]);

  useEffect(() => {
    if (imagedata?.status === 200) {
      socket.emit('send_message', {
        user_id: session?.user?.id,
        deposition_id,
        message: null,
        username,
        files: imagedata?.data?.fileData,
      });
      setchatfileupload(false);
    }
  }, [imagedata]);
  let handleFieldChange = (e) => {
    setfilepayload(e.target.files[0]);
    setfileuploadmodal(true);
  };
  const handlechat = (file) => {
    window.open(`${chatFilePath}/${file}`, '_blank');
  };
  const myFunction = () => {
    const element = document.getElementsByClassName(
      'styles_scrollable-div__prSCv'
    );
    let y = element[0].scrollTop;
    if (y < 50 && chatmessages?.length < totalCount) {
      // setvalue(y)
      setstartcount(chatmessages?.length + 1);
      setendCount(chatmessages?.length + 15);
    }
  };
  const closeModal = (type) => {
    if (type === 'no') {
      setfilepayload('');
    } else {
      imageuploadtrigger({
        payload: filepayload,
        axios: axiosAuth,
        name: 'chat_upload_files',
      });
      setchatfileupload(true);
    }
    setfileuploadmodal(false);
  };
  const errorMessage = (message) => {
    return (
      <>
        <div className="w-[15.625rem] flex-[15.625rem] flex items-center justify-center overflow-hidden">
          <Image src={chat} className="w-full h-auto" />
        </div>
        <p className="text-red-700 text-xl mb-0 mt-10">{message}</p>
      </>
    );
  };
  return (
    <>
      <div className="pt-[1.875rem] flex-1">
        <div className="px-6">
          <h1 className="text-lg font-medium mb-2">Team members</h1>
          <h1 className="text-[0.9375rem] font-normal text-[#686E80]">
            {roomusers?.length} members
          </h1>
        </div>
        <div className="m-card-top">
          <div className="tabs">
            <div className="tab tab-bordered tab-active">Chat</div>
          </div>
        </div>
        <div className="m-card-bottom !p-8 flex justify-between flex-col relative">
          {isLoading && chatmessages?.length === 0 ? (
            <SkeletonCard value={4} />
          ) : chatmessages?.length > 0 ? (
            <>
              {isLoading && chatmessages?.length > 0 && (
                <SkeletonCard value={2} />
              )}
              <ul className="-mt-4 h-[calc(100vh-5rem)] overflow-y-auto">
                <ScrollableFeed id="div" onScroll={myFunction}>
                  {chatmessages?.map((chat, i) => (
                    <li
                      className="flex items-start py-4 cursor-pointer"
                      key={i}
                    >
                      <div className="avatar placeholder mr-[0.625rem] flex-[0_0_2.25rem]">
                        <div
                          className="text-neutral-content rounded-full w-9"
                          //style={{backgroundColor:`${room?.bgcolor}`}}
                          style={{
                            backgroundColor: roomusers?.find(
                              (item) => item.user_id === chat.user_id
                            )?.bgcolor,
                          }}
                        >
                          <span className="text-lg font-medium text-white">
                            {chat?.username?.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[0.8125rem] font-medium">
                          {chat?.username}
                        </span>
                        <time className="text-xs text-[#8790AF] font-normal ml-5">
                          {getFormattedDate(chat?.created_at)}{' '}
                          {minuteextractor(chat?.created_at)}
                        </time>
                        {chat?.message !== null ? (
                          <p className="text-[0.8725rem] text-[#8790AF] font-normal mt-[0.625rem] !mb-0 !leading-normal">
                            {chat?.message}
                          </p>
                        ) : (
                          <div
                            className="tooltip block"
                            data-tip={chat?.file_name}
                          >
                            <div
                              className="bg-[#e0eefb] p-3 text-[#125ecb] h-12 text-sm font-medium flex items-center leading-normal gap-2 mt-4"
                              onClick={() => handlechat(chat?.file_name)}
                            >
                              <div className="w-5 overflow-hidden flex items-center justify-center">
                                <Image
                                  src={fileIcon}
                                  alt="Upload icon"
                                  className="w-full h-auto"
                                />
                              </div>
                              <span className="truncate max-w-[calc(100vw-51.25rem)]">
                                {chat?.file_name}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ScrollableFeed>
              </ul>
              {chatfileupload && <SkeletonCard value={1} />}
            </>
          ) : (
            <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center">
              <div className="flex items-center justify-center flex-col">
                {errors !== ''
                  ? errorMessage(errors)
                  : errorMessage('No message found')}
              </div>
            </div>
          )}
          {(chattype === '' && errors ==="") ? (
            <div className="flex items-center gap-[0.625rem]">
              <div className="form-field relative !pr-[3.125rem] !rounded-[1.25rem] !mb-0 flex-1">
                <input
                  type="text"
                  placeholder="Write message..."
                  className="form-control"
                  value={currentmessage}
                  onChange={(e) => setcurrentmessage(e.target.value)}
                  onKeyPress={(event) => event.key === 'Enter' && handleSend()}
                />
                <div
                  className="tooltip absolute top-1/2 -translate-y-1/2 right-5"
                  data-tip="Upload"
                >
                  <input
                    type="file"
                    className="file-input w-full max-w-xs hidden"
                    accept=".doc, .docx,.ppt, .pptx,.txt,.pdf,image/*"
                    id="file-upload"
                    multiple={false}
                    onChange={handleFieldChange}
                  />
                  <label
                    htmlFor="file-upload"
                    className="w-5 overflow-hidden flex items-center justify-center"
                  >
                    <Image
                      src={UploadIcon}
                      alt="Upload icon"
                      className="w-full h-auto"
                    />
                  </label>
                </div>
              </div>
              <div className="tooltip flex-[0_0_2.5rem]" data-tip="Send">
                <div
                  className="w-10 overflow-hidden flex items-center justify-center cursor-pointer"
                  onClick={() => handleSend()}
                >
                  <Image
                    src={SendIcon}
                    alt="Send icon"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-[0.625rem] text-red-700 justify-center text-xl">
              {chattype}
            </div>
          )}
        </div>
      </div>
      {fileuploadmodal && (
        <FileUploadConfirmationModal
          modalIsOpen={fileuploadmodal}
          closeModal={closeModal}
        />
      )}
    </>
  );
};

export default Rightsidechat;
