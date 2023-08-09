'use client';
import React,{useState,useEffect} from 'react';
import Image from 'next/image';
import Modal from 'react-modal';
import CloseIcon from '../../../../../assets/images/icons/close-icon.svg';
import listicon from '../../../../../assets/images/icons/list-icon.svg';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { WithTokenPostApi } from '@/services/module/api/postapi';
const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      zIndex: '9999',
      width: '73.125rem',
      position: 'relative',
      padding: '0',
      maxHeight: '100vh',
      overflow: 'hidden',
    },
  };
const SingleCallModal = ({modalIsOpen,closeModal,purchasetype,axiosAuth,apiresponse}) => {
  const {
    data: getcalldetails,
  } = useSWR(
    [
      `/call/singleCallDetails`,
      axiosAuth,
    ],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );
  const {
    trigger,
    isMutating,
    data: postdata,
  } = useSWRMutation(
    `/call/singleCallPayment`,
    WithTokenPostApi
  );
  const [checked, setchecked] = useState(false);
  useEffect(() => {
    if(postdata?.status ===200){
      toast.success(postdata?.data?.message);
      apiresponse(postdata?.data?.data)
    }
  }, [postdata]);
 const handleconfirm=()=>{
  let payload = {
    audio: purchasetype==="Audio"?true:false
  };
  //closeModal()
    trigger({ payload, axios: axiosAuth });
 }
 let onCheckBoxChange=()=>{
  setchecked(!checked)
 }
  return (
    <Modal
    isOpen={modalIsOpen}
    onRequestClose={closeModal}
    style={customStyles}
    contentLabel={`Buy A Single ${purchasetype} Call`}
  >
    <div className="flex items-center justify-end fixed top-0 left-0 w-full bg-white z-50">
      <button
        title="Close modal"
       onClick={closeModal}
        type="button"
        className="w-[3.5rem] overflow-hidden flex items-center justify-center p-[1.0625rem] bg-none border-none"
      >
        <Image
          src={CloseIcon}
          alt="Close Icon"
          className="w-full h-auto"
        />
      </button>
    </div>
    <div className="pt-14 pb-[5.375rem] px-8 h-[calc(100vh-3.125rem)] overflow-y-auto">
      <div className="c-services-top text-center mb-10">
        <h2 className="c-services-top-title">Buy a Single {purchasetype} Call</h2>
        <p className="c-services-top-text">
          Aliquam euismod tellus sit amet ultricies pulvinar. Aenean in
          dictum mi, sit amet varius dolor
        </p>
      </div>
      <div className="flex items-center justify-center">
        <label
          for="audio-video-file"
          className="rounded-[0.875rem] bg-[#E3E3E3] p-5 hover:bg-white hover:shadow-[0_7px_24px_0_rgba(0,0,80,0.1)] hover:cursor-pointer relative text-left max-w-[33.125rem] flex-[0_0_33.125rem]"
        >
          <h1 className="text-xl font-medium">
            One Call + Recorded <br /> {purchasetype} File
          </h1>
          <h2 className="text-lg font-bold py-4">${purchasetype ==="Audio"?getcalldetails?.data?.data?.audioSingleCallDetails?.price:
          getcalldetails?.data?.data?.videoSingleCallDetails?.price
          }</h2>
          <ul className="c-list !-my-2 pb-2 border-b-[0.0625rem] border-solid border-[#E3E3E3]">
            {purchasetype ==="Audio"? getcalldetails?.data?.data?.audioSingleCallDetails?.
            description.split('<p>').map((str,i)=>(
              <>
                        {str !=="" && 
                         <li className="!py-2" key={i}>
                         <Image src={listicon} alt="" />{' '}
                         <span>
                         {str.substring(0, str.length - 4)}
                         </span>{' '}
                       </li>
                        }
                       
              </>
            )):
            getcalldetails?.data?.data?.videoSingleCallDetails?.
            description.split('<p>').map((str,i2)=>(
              <>
                        {str !=="" && 
                         <li className="!py-2" key={i2}>
                         <Image src={listicon} alt="" />{' '}
                         <span>
                         {str.substring(0, str.length - 4)}
                         </span>{' '}
                       </li>
                        }
                       
              </>
            ))
            }
          </ul>
        </label>
      </div>
      <div className="bg-white rounded-[1.125rem] p-[1.5625rem] my-[1.625rem] shadow-[0_4px_11px_0px_rgba(0,0,0,0.06)]">
        <h1 className="text-xl font-medium mb-[1.5625em]">
          Payment Method(Credit Card)
        </h1>
              <div className="grid grid-cols-3 gap-[0.9375rem]">
                <label className="label cursor-pointer justify-start p-4 items-start border-[0.0625rem] border-solid border-[#E3E3E3] rounded-lg relative max-w-full">
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio-sm checked:bg-primary mr-[0.8125rem]"
                    checked
                  />
                  <div className="flex-1">
                    <h1 className="label-text text-[#001725] font-semibold text-[0.9375rem]">
                      xxxx xxxx xxxx {getcalldetails?.data?.data?.defaultCardDetails?.last4Digit}
                    </h1>
                    <h2 className="text-[#686E80] text-[0.6875rem] font-normal py-[0.5625rem]">
                      Expiry {getcalldetails?.data?.data?.defaultCardDetails?.expiryMonth}/{getcalldetails?.data?.data?.defaultCardDetails?.expiryYear}
                    </h2>
                    <div className="flex items-center justify-between mt-[0.625rem]">
                      <h3 className="text-[#001725] text-[0.8125rem] font-normal">
                        {getcalldetails?.data?.data?.defaultCardDetails?.cardHolderName}
                      </h3>
                    </div>
                  </div>
                </label>
        </div>
        <h6 className='py-4'>Note:If you want to change card,please change default card from account settings</h6>
      </div>
      <label className="label cursor-pointer justify-start items-center p-0">
                  <input
                    type="checkbox"
                    className="checkbox-sm checkbox-primary mr-[0.625rem] focus:outline-none"
                    value ={checked} 
					          onChange={onCheckBoxChange}
                   // onChange={()=>}
                  />
                  <span className="label-text text-[0.9375rem] text-[#686E80]">
                   Are you sure to purchase the call,you can't get refund after canceling the deposition
                  </span>
                </label>
      <div className="flex items-center justify-end fixed bottom-0 left-0 w-full shadow-[0_-1px_3px__rgba(0,0,0,0.2)] p-3 bg-white">
        <div className="modal-action mt-0">
        <button
            type="submit"
            onClick={closeModal}
            className="primary-btn !min-w-[11.4375rem]"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleconfirm}
            className={`primary-btn !min-w-[11.4375rem] ${
              !checked  ? 'bg-slate-300' : null
            }`}
            //className="primary-btn !min-w-[11.4375rem]"
            disabled={!checked}
          >
            Confirm and Pay
          </button>
        </div>
      </div>
    </div>
  </Modal>
  )
}

export default SingleCallModal