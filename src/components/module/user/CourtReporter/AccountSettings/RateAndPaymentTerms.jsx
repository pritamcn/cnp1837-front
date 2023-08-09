'use client';
import React, { useEffect } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useForm } from 'react-hook-form';
import { UpdateWithTokenapi } from '@/services/module/api/putapi';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';

const RateAndPaymentTerms = ({ userid }) => {
  const axiosAuth = useAxiosAuth();
  const {
    data: getdata,
    isLoading,
    mutate,
  } = useSWR(
    [`/profile/getPaymentFee/${userid}`, axiosAuth],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );

  const {
    trigger,
    isMutating,
    data: postdata,
  } = useSWRMutation(`/profile/updatePaymentFee`, UpdateWithTokenapi);

  const schema = z.object({
    fee: z
      .string()
      .min(1, { message: "Rate can't be less than 1 digit" })
      .max(6, { message: "Rate can't be more than 6 digit" }),
    days_before_call: z.string().min(1, { message: 'Select payment terms' }),
    refund_policy: z
      .string()
      .min(4, { message: "Refund policy name can't be empty" }),
    download_fee: z
      .string()
      .min(1, { message: "Download charges can't be less than 1 digit" })
      .max(6, { message: "Download charges can't be more than 6 digit" }),
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState,
    getValues,
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fee: '',
      days_before_call: '',
      refund_policy: '',
      download_fee: '',
    },
  });

  const { errors, isDirty } = formState;

  useEffect(() => {
    if (getdata?.status === 200) {
      setValue('fee', getdata?.data?.data?.call_joining_fee);
      setValue('days_before_call', getdata?.data?.data?.days_before_call);
      setValue('refund_policy', getdata?.data?.data?.refund_policy);
      setValue('download_fee', getdata?.data?.data?.download_fee);
    }
  }, [getdata]);

  const onSubmit = (data) => {
    let modifyData = { ...data, user_id: userid };
    trigger({ data: modifyData, axios: axiosAuth });
  };

  useEffect(() => {
    if (isDirty && postdata?.status === 200) {
      toast.success(postdata?.data?.message);
    }
  }, [postdata]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex gap-5">
          <div>
            <label htmlFor="rate" className="text-xl font-semibold mb-4 block">
              Rate ($/hr)
            </label>
            <input
              id="rate"
              type="number"
              placeholder="Enter rate"
              className="input input-bordered w-full rounded bg-white focus:outline-none text-[0.9375rem] max-w-[12.25rem]"
              {...register('fee')}
            />
            <p className="text-red-700 mb-0">{errors?.fee?.message}</p>
          </div>
          <div>
            <label
              htmlFor="payment-terms"
              className="text-xl font-semibold mb-4 block"
            >
              Payment Terms
            </label>
            <div className="flex items-center">
              <select
                id="payment-terms"
                className="select select-bordered w-full focus:outline-none bg-white max-w-[12.25rem] rounded"
                {...register('days_before_call')}
              >
                <option disabled selected value={''}>
                  Select payment terms
                </option>
                {new Array(45).fill(0).map((_, index) => {
                  return (
                    <option key={index} value={index + 1}>
                      {index + 1}
                    </option>
                  );
                })}
              </select>
              <span className="text-[0.9375rem] text-[#8790AF] ml-[0.625rem]">
                Days before the call
              </span>
            </div>
            <p className="text-red-700 mb-0">
              {errors?.days_before_call?.message}
            </p>
          </div>

          <div>
            <label
              htmlFor="rate"
              className="text-xl font-semibold mb-4 block whitespace-nowrap"
            >
              Transcription Purchase Fee($)
            </label>
            <input
              id="rate"
              type="number"
              placeholder="Enter rate"
              className="input input-bordered w-full rounded bg-white focus:outline-none text-[0.9375rem] max-w-[12.25rem]"
              {...register('download_fee')}
            />
            <p className="text-red-700 mb-0">{errors?.download_fee?.message}</p>
          </div>
        </div>

        <div className="c-case-wrap-col w-full pt-4 pb-2">
          <label
            htmlFor="payment-terms"
            className="text-xl font-semibold mb-4 block"
          >
            Refund Policy
          </label>
          <div className="form-field textarea">
            <textarea
              name=""
              id=""
              className="form-control"
              {...register('refund_policy')}
            ></textarea>
          </div>
          <p className="text-red-700 mb-0">{errors?.refund_policy?.message}</p>
        </div>

        <button
          type="submit"
          disabled={!isDirty}
          className={`primary-btn mt-[1.875rem] ${
            !isDirty || isMutating ? 'disable' : ''
          }`}
        >
          Update
        </button>
      </form>
    </>
  );
};

export default RateAndPaymentTerms;
