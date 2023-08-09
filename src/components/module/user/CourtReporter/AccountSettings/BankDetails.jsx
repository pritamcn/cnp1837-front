"use client";
import React, { useEffect, useState } from "react";
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import Addbankmodal from '../../Physician/Modal/Addbankmodal';
import { WithTokenGetApi } from "@/services/module/api/getapi";
import { UpdateWithTokenapi } from '@/services/module/api/putapi';
import { DeleteWithToken } from '@/services/module/api/deleteapi';
import { toast } from "react-toastify";
import Confirm from "../Modal/Confirm";
import Loader from "../Loader";

const BankDetails = ({ userid }) => {
    const axiosAuth = useAxiosAuth();
    const [bankmodal, setbankmodal] = useState(false);

    const [confirmModal, setConfirmModal] = useState(false);

    const [accountDetails, setAccountDetails] = useState({});

    const { data: getAccountData,
        isLoading: isAccountLoading,
        mutate: accountMutate, error: accountDetailsError } = useSWR([`/getAccountDetails`, axiosAuth], ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth), {
            revalidateOnFocus: false
        })

    const {
        trigger,
        isMutating,
        data: putdata,
    } = useSWRMutation(`/regenrateAccountLink`, UpdateWithTokenapi);

    const { trigger: deletetrigger, isMutating: deleteMutating, data: deletedata, error } = useSWRMutation(`/deleteAccount`, DeleteWithToken)

    useEffect(() => {
        if (getAccountData?.status === 200 && getAccountData?.data?.data) {
            setAccountDetails(getAccountData?.data?.data);
        }
        if (accountDetailsError) {
            setAccountDetails({});
        }
    }, [getAccountData, accountDetailsError])

    useEffect(() => {
        if (putdata?.data?.status === 200) {
            toast.success(putdata?.data?.message);
            accountMutate();
        }
    }, [putdata])

    useEffect(() => {
        if (deletedata?.data?.status == true) {
            toast.success(deletedata?.data?.message);
            setConfirmModal(false);
            accountMutate();
        }
    }, [deletedata])

    const handlemodal = () => {
        setbankmodal(false)
        accountMutate()
    }

    const regenerateLink = () => {
        trigger({ data: {}, axios: axiosAuth });
    }

    const deleteAccount = () => {
        setConfirmModal(true);
    }
    const onConfirmClose = () => {
        setConfirmModal(false);
    }
    const onConfirm = () => {
        deletetrigger({ axios: axiosAuth })
    }

    return (
        <>
            <div className="divider h-auto before:h-[0.0625rem] after:h-[0.0625rem] before:bg-[#E3E3E3] after:w-[0.0625rem] after:bg-[#E3E3E3] my-10"></div>
            <div className="max-w-[49.625rem]">
                <label
                    htmlFor="rate"
                    className="text-xl font-semibold mb-4 block"
                >
                    Bank Details
                </label>

                {isAccountLoading ? <Loader /> : <>
                    {parseInt(accountDetails?.status) === 0 ? <>
                        <div className="flex flex-wrap justify-start form-check-wrap mb-8">
                            <div>Your on-boarding link has been generated.You can click bellow button to complete your on-boarding process or you can regenerate new on-boarding link too</div>
                            <div className="px-3 mb-6 md:mb-0 form-check mr-4">
                                <a href={accountDetails?.account_link} target="_blank"><label htmlFor="add-bank-modal" className='primary-btn mt-[1.875rem]'>
                                    Complete stripe on-boarding
                                </label></a>
                            </div>
                            <div className="px-3 mb-6 md:mb-0 form-check mr-4">
                                <label onClick={() => regenerateLink()} className='primary-btn mt-[1.875rem]'>
                                    Regenerate stripe on-boarding link
                                </label>
                            </div>
                        </div>
                    </> : parseInt(accountDetails?.status) === 1 ?
                        <div className="flex flex-wrap flex-col form-check-wrap mb-8">
                            <div>Your account has been created successfully</div>
                            <div><label htmlFor="confirm-modal" onClick={() => deleteAccount()} className='primary-btn mt-[1.875rem]'>
                                Delete stripe account
                            </label>
                            </div>
                        </div>
                        : Object.keys(accountDetails).length === 0 &&
                        <div className="flex flex-wrap flex-col form-check-wrap mb-8">
                            <div>Click bellow button to create Stripe on-boarding URL</div>
                            <div>
                                <label htmlFor="add-bank-modal" className='primary-btn mt-[1.875rem]'
                                    onClick={() => setbankmodal(true)}
                                >Create stripe account</label>
                            </div>
                        </div>
                    }
                </>}


                {bankmodal &&
                    <>
                        <input type="checkbox" id="add-bank-modal" className="modal-toggle" />
                        <Addbankmodal
                            userid={userid}
                            handlemodal={handlemodal}
                        />
                    </>
                }

                {confirmModal &&
                    <>
                        <input type="checkbox" id="confirm-modal" className="modal-toggle" />
                        <Confirm
                            onConfirm={onConfirm}
                            handlemodal={onConfirmClose}
                        />
                    </>
                }

            </div>
        </>
    )
}

export default BankDetails;

