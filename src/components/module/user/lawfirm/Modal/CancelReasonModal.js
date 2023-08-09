import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWRMutation from 'swr/mutation';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import downicon from '../../../../../assets/images/icons/chevron-down-icon.svg';
import { UpdateWithTokenapi } from '@/services/module/api/putapi';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import Image from 'next/image';

const CancelReasonModal = ({ depo_id, handlemodal }) => {

    const [confirmModal, setConfirmModal] = useState(false);

    const [cancelReasonsList, setCancelReasonsList] = useState([]);
    const [status, setstatus] = useState(false);
    const [statusvalue, setstatusvalue] = useState(0);

    const axiosAuth = useAxiosAuth();

    const {
        data: getCancelReasonsList,
        error: getCancelReasonsError,
        isLoading: getdataLoading,
        mutate
    } = useSWR(
        [`/case/getCancelReasonsList`, axiosAuth],
        ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
        {
            revalidateOnFocus: false,
        }
    );

    const {
        trigger,
        isMutating,
        data: postdata,
        error,
    } = useSWRMutation(`/case/updateDepoCallStatus/${depo_id}`, UpdateWithTokenapi);
    const schema = z.object({
        reason: z
            .string()
            .min(1, { message: "Reason can't be empty" }).optional(),
    }).superRefine((data, ctx) => {
        if (data.reason === '' && statusvalue !== 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['reason'],
                message: `Reason can't be empty`,
            });
        }
    })
    const {
        register,
        control,
        handleSubmit,
        formState,
        watch,
        getValues,
        setValue,
        setError,
        reset,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            reason: ''
        },
    });

    useEffect(() => {
        if (getCancelReasonsList?.status === 200) {
            setCancelReasonsList(getCancelReasonsList?.data);
        }
    }, [getCancelReasonsList]);

    const onSubmit = () => {
        setConfirmModal(true);
    }

    const onCancel = () => {
        setConfirmModal(false);
        setValue('reason', getValues('reason'));
    }

    const onConfirm = () => {
        let payload = {
            cancel_reason_id: statusvalue + '',
            status: "0",
            cancel_reason_description: getValues('reason'),
        };
        trigger({ data: payload, axios: axiosAuth });
        //  trigger(payload)
    };

    const { errors, isDirty } = formState;
    const handleclosemodal = () => {
        reset();
        handlemodal();
    };
    useEffect(() => {
        if (postdata?.status === 200) {
            toast.success(postdata?.data?.message);
            handleclosemodal();
        }
        if (postdata === undefined && error?.response?.status === 300) {
            toast.error(error?.response?.data?.message);
            handleclosemodal();
        } else if (postdata === undefined && error !== undefined) {
            setError('reason', {
                type: 'custom',
                message: "Reason can't be empty",
            });
        }
    }, [postdata, error]);

    const handleStatus = (number) => {
        setstatus(false);
        setstatusvalue(number);
    };

    return (
        <div className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <label
                    htmlFor="add-bank-modal"
                    className="modal-close-btn"
                    onClick={confirmModal ? onCancel : handleclosemodal}
                >
                    ✕
                </label>
                <h3 className="modal-title">{confirmModal ? 'Confirmation' : 'Rejection'}</h3>
                <form
                    className="modal-body"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <div className="form-area flex -mx-2 flex-wrap">
                        <div className="w-full px-2">
                            {!confirmModal ? <div className="mb-4">

                                <div className="select-dropdown col-span-1">
                                    <button
                                        role="button"
                                        data-value=""
                                        className="select-dropdown__button"
                                        onClick={() => setstatus(!status)}
                                    >
                                        <span>
                                            {statusvalue === 0 ? 'Select' : cancelReasonsList.find(item => item?.id === statusvalue).cancel_reason}
                                        </span>
                                        <Image src={downicon} className="i-chevron-down" alt="" />
                                    </button>
                                    {status && <ul className="absolute z-50 !w-full bg-white border border-solid border-gray-300 border-t-0 rounded-br rounded-bl">
                                        {
                                            cancelReasonsList.map((item, index) => {
                                                return <li key={index}
                                                    data-value={item?.id}
                                                    className="select-dropdown__list-item"
                                                    onClick={() => handleStatus(item?.id)}
                                                >
                                                    {item?.cancel_reason}
                                                </li>
                                            })
                                        }
                                    </ul>
                                    }
                                </div>

                                {statusvalue !== 0 && <><div className="form-field textarea">
                                    <textarea
                                        placeholder="Reason"
                                        className="form-control"
                                        {...register('reason')}
                                    ></textarea>
                                </div>
                                    <p className="text-red-700 mb-0">
                                        {errors?.reason?.message}
                                    </p></>}
                            </div> : <div className="mb-4">
                                Are you sure?
                            </div>
                            }
                        </div>
                    </div>
                    <div className="modal-action">
                        <div className="flex flex-wrap justify-center w-full">
                            <label
                                //htmlFor="add-bank-modal"
                                type="button"
                                className="primary-btn btn-outline"
                                onClick={confirmModal ? onCancel : handleclosemodal}
                            >
                                Cancel
                            </label>
                            {!confirmModal ? <button
                                type="submit"
                                //className="primary-btn ml-2.5"
                                className={`primary-btn ml-2.5 ${!isDirty || isMutating ? 'disable' : ''
                                    }`}
                                disabled={!isDirty || isMutating}
                            >
                                Submit
                            </button> : <label className="primary-btn ml-2.5" onClick={onConfirm}>
                                Submit
                            </label>
                            }
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CancelReasonModal;

