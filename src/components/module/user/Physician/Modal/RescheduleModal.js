'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import moment from 'moment';
import { UpdateWithTokenapi } from '@/services/module/api/putapi';
const RescheduleModal = ({ depo_id, invitee_id, handlemodal, startdate, enddate }) => {

  const [confirmModal, setConfirmModal] = useState(false);

  const axiosAuth = useAxiosAuth();

  const {
    trigger,
    isMutating,
    data: postdata,
    error,
  } = useSWRMutation(
    `case/updateInviteeStatus`,
    UpdateWithTokenapi
  );

  const schema = z.object({
    start_date: z.string().transform(str => new Date(str)),
    end_date: z.string().transform(str => new Date(str)),
  }).superRefine((data, ctx) => {
    let durationHours = moment(data.end_date).diff(moment(data.start_date), 'hour');
    let durationmin = moment(data.end_date).diff(moment(data.start_date), 'minute');
    if (durationHours <= 0 || durationmin <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['end_date'],
        message: `End date should be greater than start date`,
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
      start_date: moment(startdate).format('YYYY-MM-DDTHH:mm'),
      end_date: moment(enddate).format('YYYY-MM-DDTHH:mm'),
    },
  });

  const onSubmit = (data) => {
    setConfirmModal(true);
  }

  const onCancel = () => {
    setConfirmModal(false);
  }

  const onConfirm = () => {
    let payload = {
      deposition_id: depo_id + '',
      status: '3',
      requested_start_time: moment(getValues('start_date')).format('YYYY-MM-DDTHH:mm'),
      requested_end_time: moment(getValues('end_date')).format('YYYY-MM-DDTHH:mm')
    };
    //  trigger(payload)
    trigger({ data: payload, axios: axiosAuth });
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
    if (postdata === undefined && error !== undefined) {
      setError('account_number', {
        type: 'custom',
        message: 'Select all the date',
      });
    }
  }, [postdata, error]);

  return (
    <div className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <label
          //htmlFor="add-bank-modal"
          className="modal-close-btn"
          onClick={confirmModal ? onCancel : handleclosemodal}
        >
          ✕
        </label>
        <h3 className="modal-title">{confirmModal ? 'Confirmation' : 'Add Reschedule'}</h3>
        <form
          className="modal-body"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {confirmModal ? <div className="form-area flex -mx-2">
            <div className="w-full px-2">
              <div className="mb-4">
                Are you sure?
              </div>
            </div>
          </div>
            : <div className="form-area flex -mx-2">
              <div className="w-full px-2">
                <div className="mb-4">
                  <div className="form-field !mb-0">
                    <input
                      type="datetime-local"
                      placeholder="Start Date"
                      className="form-control flex-row"
                      min={moment(moment.now()).format('YYYY-MM-DDTHH:mm')}
                      {...register('start_date')}
                    />
                  </div>
                  <p className="text-red-700 mb-0">
                    {errors?.start_date?.message}
                  </p>
                </div>
              </div>
              <div className="w-full px-2">
                <div className="mb-4">
                  <div className="form-field !mb-0">
                    <input
                      type="datetime-local"
                      placeholder="End Date"
                      className="form-control flex-row"
                      min={moment(getValues('start_date')).format('YYYY-MM-DDTHH:mm')}
                      {...register('end_date')}
                    />
                  </div>
                  <p className="text-red-700 mb-0">
                    {errors?.account_number?.message}
                  </p>
                </div>
              </div>
            </div>
          }
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
              {confirmModal ? <label className="primary-btn ml-2.5" onClick={onConfirm}>
                Submit
              </label> : <button
                type="submit"
                //className="primary-btn ml-2.5"
                className={`primary-btn ml-2.5 ${!isDirty || isMutating ? 'disable' : ''
                  }`}
                disabled={!isDirty || isMutating}
              >
                Submit
              </button>
              }
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleModal;
