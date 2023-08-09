'use client';
import React, { useState, useEffect } from 'react'
import Addcardmodal from '../Modal/Addcardmodal'
import closeicon from '../../../../../assets/images/icons/close-icon.svg';
import Image from 'next/image';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import Deletemodal from '@/components/module/common/modal/deletemodal';
import { toast } from 'react-toastify';
import Defaultmodal from '@/components/module/common/modal/defaultmodal';
import { WithTokenGetApi, WithTokenWithoutTriggerGetApi } from '@/services/module/api/getapi';
import { DeleteWithToken } from '@/services/module/api/deleteapi';
import Loader from '../Loader';

const Cards = ({ userid }) => {
  const [cardmodal, setcardmodal] = useState(false);
  const [deleteid, setdeleteid] = useState("");
  const [defaultid, setdefaultid] = useState("");
  const { trigger: deletetrigger, data: deletedata } = useSWRMutation(`/card/deleteCard/${deleteid}`, DeleteWithToken)
  const { trigger: updatetrigger, data: updatedata } = useSWRMutation(`/card/makeCardDefault/${defaultid}`, WithTokenWithoutTriggerGetApi)
  const [cardlist, setcardlist] = useState([]);
  const axiosAuth = useAxiosAuth();
  const { data: getdata, isLoading, mutate } = useSWR([`/card/getCards`, axiosAuth], ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth), {
    revalidateOnFocus: false
  })
  useEffect(() => {
    if (getdata?.status === 200) {
      setcardlist(getdata?.data?.data)
    }
  }, [getdata]);
  useEffect(() => {
    if (deletedata?.status === 200) {
      toast.success(deletedata?.data?.message)
      mutate()
    }
  }, [deletedata]);
  useEffect(() => {
    if (updatedata?.status === 200) {
      toast.success(updatedata?.data?.message)
      mutate()
    }
  }, [updatedata]);
  const handlemodal = () => {
    setcardmodal(false)
    mutate()
  }
  const handledeletemodal = (status) => {
    if (status === "No") {
      setdeleteid("")
    }
    if (status === "Yes") {
      deletetrigger({ axios: axiosAuth })
      setdeleteid("")
    }
  }
  const handledefaultmodal = (status) => {
    if (status === "No") {
      setdefaultid("")
    }
    if (status === "Yes") {
      updatetrigger({ axios: axiosAuth })
      setdefaultid("")
    }
  }
  const handledefault = (item) => {
    if (!item?.is_default) {
      setdefaultid(item?.id)
    }
  }
  return (
    <div className="w-full bank-option-card">
      <div className="flex flex-wrap">
        <div className='w-full'>
          <h3 className='m-title'>Cards</h3>
        </div>
        <div className='flex flex-wrap gap-4'>
          {isLoading || cardlist === undefined ? (
            <Loader />
          ) : cardlist?.length > 0 ?
            cardlist?.map((item, i) => (
              <div className='w-72' key={i}>
                <div className='payment-card'>
                  <label htmlFor="default-card" className={`${item?.is_default ? "active" : null} select-card`}
                    onClick={() => handledefault(item)}
                  >
                  </label>
                  {/* <input type="radio" id="add-card-1" htmlFor="remove-card" name='add-card' className='payment-card-radio'
                           onClick={()=>handledefault(item?.id)}
                          /> */}
                  <label className='payment-card-label' for='add-card-1'>
                    <span className='payment-card-no'>xxxx xxxx xxxx {item?.last4}</span>
                    <span className='payment-card-date'>Expiry {item?.exp_month}/{item?.exp_year}</span>
                    <div className='flex payment-card-flex'>
                      <span className='payment-card-name'>{item?.card_holder_name}</span>
                      {/* <Image src={visacardimg} alt="" /> */}
                    </div>
                  </label>
                  {!item?.is_default ?
                    <label htmlFor="remove-card" className='close-box cursor-pointer' onClick={() => setdeleteid(item?.id)}>
                      <Image src={closeicon} alt="" />
                    </label> : null
                  }
                </div>
              </div>
            ))


            : "No card found"
          }

        </div>
        <div className='flex w-full'>
          <label htmlFor="add-card-modal" className='primary-btn add-btn' onClick={() => setcardmodal(true)}>Add New Card</label>
        </div>
      </div>
      {cardmodal &&
        <>
          <input type="checkbox" id="add-card-modal" className="modal-toggle" />
          <Addcardmodal userid={userid}
            handlemodal={handlemodal}
          />
        </>
      }
      {deleteid !== "" &&
        <>
          <Deletemodal
            handledeletemodal={handledeletemodal}
          />
        </>
      }
      {
        defaultid !== "" &&
        <>
          <Defaultmodal
            handledefaultmodal={handledefaultmodal}
          />
        </>
      }

    </div>
  )
}

export default Cards