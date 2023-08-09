'use client';
import React, { useEffect } from 'react';
import useSWRMutation from 'swr/mutation';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { UpdateWithTokenapi } from '@/services/module/api/putapi';
import { toast } from 'react-toastify';

const AcceptModal = ({ depo_id, invitee_id, handlemodal }) => {

    const axiosAuth = useAxiosAuth();
    const {
        trigger,
        isMutating,
        data: postdata,
        error,
    } = useSWRMutation(`case/updateInviteeStatus`, UpdateWithTokenapi);

    const onConfirm = () => {
        let payload = {
            deposition_id: depo_id + '',
            status: "1",
        };
        trigger({ data: payload, axios: axiosAuth });
        //  trigger(payload)
    };

    useEffect(() => {
        if (postdata?.status === 200) {
            toast.success(postdata?.data?.message);
            handlemodal();
        }
        if (postdata === undefined && error !== undefined) {
            toast.error(error?.response?.data?.message);
        }
    }, [postdata, error]);

    return (
        <div className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <label
                    htmlFor="add-bank-modal"
                    className="modal-close-btn"
                    onClick={handlemodal}
                >
                    ✕
                </label>
                <h3 className="modal-title">Confirmation</h3>
                <form
                    className="modal-body"
                    noValidate
                >
                    <div className="form-area flex -mx-2 flex-wrap">
                        <div className="w-full px-2">
                            <div className="mb-4">
                                Are you sure?
                            </div>
                        </div>
                    </div>
                    <div className="modal-action">
                        <div className="flex flex-wrap justify-center w-full">
                            <label
                                //htmlFor="add-bank-modal"
                                type="button"
                                className="primary-btn btn-outline"
                                onClick={handlemodal}
                            >
                                Cancel
                            </label>
                            <label className="primary-btn ml-2.5" onClick={onConfirm}>
                                Submit
                            </label>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AcceptModal;