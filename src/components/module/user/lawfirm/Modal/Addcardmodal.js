'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { WithTokenPostApi } from '@/services/module/api/postapi';
const Addcardmodal = ({ userid, handlemodal }) => {
  const axiosAuth = useAxiosAuth();
  const {
    trigger,
    isMutating,
    data: postdata,
    error,
  } = useSWRMutation('/card/saveCard', WithTokenPostApi);
  const schema = z
    .object({
      number: z
        .string()
        .min(13, { message: "Cardnumber can't be less than 13 digit" })
        .max(19, { message: "Cardnumber can't be more than 19 digit" }),
      exp_month: z
        .string()
        .min(1, { message: "Expiry month can't be less than 1" })
        .max(2, { message: "Expiry month can't be more than 12" }),
      exp_year: z
        .string()
        .min(4, { message: "Expiry year can't be less than current year" })
        .max(4, { message: "Expiry year can't be more than 4 digit" }),
      cvc: z
        .string()
        .min(3, { message: "Cvc number can't be less than 3 digit" })
        .max(4, { message: "Cvc number can't be more than 4 digit" }),
      card_holder_name: z
        .string()
        .min(1, { message: "Card holder name can't be empty" }),
    })
    .superRefine((data, ctx) => {
      if (data.exp_month > 12) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['exp_month'],
          message: `Expiry month number can't be more than 12`,
        });
      }
      if (data.exp_month < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['exp_month'],
          message: `Expiry month number can't be less than 1`,
        });
      }
      if (data.exp_year < new Date().getFullYear()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['exp_year'],
          message: `Expiry year can't be less than current year`,
        });
      }
    });
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
      number: '',
      exp_month: '',
      exp_year: '',
      cvc: '',
      card_holder_name: '',
    },
  });

  const onSubmit = (data) => {
    //let payload={card_details:data,user_id:userid,card_holder_name:data.card_holder_name}
    let finaldata = { ...data };
    delete finaldata['card_holder_name'];
    let payload = {
      card_details: finaldata,
      user_id: userid,
      card_holder_name: data.card_holder_name,
    };
    trigger({ payload, axios: axiosAuth });
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
      setError('number', {
        type: 'custom',
        message: error?.response?.data?.message,
      });
    }
  }, [postdata, error]);
  return (
    <div className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <label
          //htmlFor="add-card-modal"
          className="modal-close-btn"
          onClick={handleclosemodal}
        >
          ✕
        </label>
        <h3 className="modal-title">Add New Card</h3>
        <form
          className="modal-body"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="form-area flex -mx-2 flex-wrap">
            <div className="w-full px-2">
              <div className="mb-4">
                <div className="form-field !mb-0">
                  <input
                    type="number"
                    placeholder="Enter Card Number"
                    className="form-control"
                    {...register('number')}
                  />
                </div>
                <p className="text-red-700 mb-0">{errors?.number?.message}</p>
              </div>
            </div>
            <div className="w-full px-2">
              <div className="mb-4">
                <div className="form-field !mb-0">
                  <input
                    type="text"
                    placeholder="Enter Card Holder Name"
                    className="form-control"
                    {...register('card_holder_name')}
                  />
                </div>
                <p className="text-red-700 mb-0">
                  {errors?.card_holder_name?.message}
                </p>
              </div>
            </div>
            <div className="w-full flex lg:w-2/3 px-2 gap-4">
              <div className="mb-4">
                <div className="form-field !mb-0">
                  <input
                    type="number"
                    placeholder="MM"
                    className="form-control"
                    {...register('exp_month')}
                  />
                </div>
                <p className="text-red-700 mb-0">
                  {errors?.exp_month?.message}
                </p>
              </div>
              <div className="mb-4">
                <div className="form-field !mb-0">
                  <input
                    type="number"
                    placeholder="YYYY"
                    className="form-control"
                    {...register('exp_year')}
                  />
                </div>
                <p className="text-red-700 mb-0">{errors?.exp_year?.message}</p>
              </div>
            </div>

            <div className="w-full lg:w-1/3 px-2">
              <div className="mb-4">
                <div className="form-field !mb-0">
                  <input
                    type="number"
                    placeholder="CVC"
                    className="form-control"
                    {...register('cvc')}
                  />
                </div>
                <p className="text-red-700 mb-0">{errors?.cvc?.message}</p>
              </div>
            </div>
          </div>
          <div className="modal-action">
            <div className="flex flex-wrap justify-center w-full">
              <label
                // htmlFor="add-card-modal"
                type="button"
                className="primary-btn btn-outline"
                onClick={handleclosemodal}
              >
                Cancel
              </label>
              <button
                type="submit"
                //className="primary-btn ml-2.5"
                className={`primary-btn ml-2.5 ${
                  !isDirty || isMutating ? 'disable' : ''
                }`}
                disabled={!isDirty || isMutating}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
      <DevTool control={control} />
    </div>
  );
};

export default Addcardmodal;
