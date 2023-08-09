'use client';
import closeicon from '../../../../../assets/images/icons/close-icon.svg';
import Image from 'next/image';
import React, { useState, useEffect } from 'react'
import Addbankmodal from '../Modal/Addbankmodal';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import Deletemodal from '@/components/module/common/modal/deletemodal';
import { toast } from 'react-toastify';
import Defaultmodal from '@/components/module/common/modal/defaultmodal';
import { WithTokenGetApi, WithTokenWithoutTriggerGetApi } from '@/services/module/api/getapi';
import { DeleteWithToken } from '@/services/module/api/deleteapi';
import Loader from '../Loader';
const Bank = ({ userid }) => {
  const [bankmodal, setbankmodal] = useState(false);
  const [banklist, setbanklist] = useState([]);
  const [deleteid, setdeleteid] = useState("");
  const [defaultid, setdefaultid] = useState("");
  const axiosAuth = useAxiosAuth();
  const { data: getdata, isLoading, mutate } = useSWR([`/bank/getBankDetails`, axiosAuth], ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth), {
    revalidateOnFocus: false
  })
  const { trigger: deletetrigger, isMutating, data: deletedata, error } = useSWRMutation(`/bank/deleteBankDetail/${deleteid}`, DeleteWithToken)
  const { trigger: updatetrigger, data: updatedata } = useSWRMutation(`/bank/makeBankDefault/${defaultid}`, WithTokenWithoutTriggerGetApi)
  useEffect(() => {
    if (getdata?.status === 200) {
      setbanklist(getdata?.data?.data)
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
    setbankmodal(false)
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
  const handledefault = (item) => {
    if (!item?.is_default) {
      setdefaultid(item?.id)
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
  return (

    <div className="w-full">
      <div className="flex flex-wrap">
        <div className='w-full'>
          <h3 className='m-title'>ACH</h3>
        </div>
        <div className='flex flex-wrap gap-4'>
          {isLoading || banklist === undefined ? (
            <Loader />
          ) :
            banklist?.length > 0 ? banklist?.map((item, i) => (
              <div className='w-72' key={i}>
                <div className='payment-card'>
                  <label htmlFor="default-card" className={`${item?.is_default ? "active" : null} select-card`}
                    onClick={() => handledefault(item)}
                  >
                  </label>
                  <label className='payment-card-label' for='add-bank-2'>
                    <span className='payment-card-no'>xxxx xxxx xxxx {item?.account_number}</span>
                    <span className='payment-card-date'>Routing no {item?.routing_number}</span>
                    <div className='flex payment-card-flex'>
                      <span className='payment-card-name'>{item?.account_holder_name}</span>
                      <span className='bane-name'>{item?.bank_name}</span>
                    </div>
                  </label>
                  {!item?.is_default ?
                    <label htmlFor="remove-card" className='close-box cursor-pointer' onClick={() => setdeleteid(item?.id)}>
                      <Image src={closeicon} alt="" />
                    </label> : null
                  }

                </div>
              </div>
            )) : "No bank account found"}

        </div>
        <div className='flex w-full'>
          <label htmlFor="add-bank-modal" className='primary-btn add-btn'
            onClick={() => setbankmodal(true)}
          >Add New Bank</label>
        </div>
      </div>
      {bankmodal &&
        <>
          <input type="checkbox" id="add-bank-modal" className="modal-toggle" />
          <Addbankmodal
            userid={userid}
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

export default Bank