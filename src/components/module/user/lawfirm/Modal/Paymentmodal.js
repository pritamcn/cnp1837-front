'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import CloseIcon from '../../../../../assets/images/payment/close-icon.svg';
import AlertBg from '../../../../../assets/images/payment/alert-bg.jpg';
import NotificationIcon from '../../../../../assets/images/payment/notification-icon.svg';
import PlatinumIcon from '../../../../../assets/images/payment/platinum-icon.svg';
import MonthlyIcon from '../../../../../assets/images/payment/monthly-icon.svg';
import listicon from '../../../../../assets/images/icons/list-icon.svg';
import CreditCardIcon from '../../../../../assets/images/payment/credit-card-icon.svg';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { WithTokenPostApi } from '@/services/module/api/postapi';
import { WithTokenTriggerGetApi } from '@/services/module/api/getapi';
import { DeleteWithTokenTriggerApi } from '@/services/module/api/deleteapi';
const Paymentmodal = ({ subscriptiondetails, handlemodal }) => {
  const axiosAuth = useAxiosAuth();
  const [isloading, setisloading] = useState(false);
  const {
    trigger: cardtrigger,
    data: carddata,
    error: carderror,
  } = useSWRMutation('/card/saveCard', WithTokenPostApi);
  const {
    trigger: banktrigger,
    data: bankdata,
    error: bankerror,
  } = useSWRMutation('/bank/saveBankDetails', WithTokenPostApi);
  const { trigger: updatecardtrigger, data: updatecarddata } = useSWRMutation(
    `/card/makeCardDefault`,
    WithTokenTriggerGetApi
  );
  const { trigger: updatebanktrigger, data: updatebankdata } = useSWRMutation(
    `/bank/makeBankDefault`,
    WithTokenTriggerGetApi
  );
  const {
    trigger: paymenttrigger,
    data: paymentdata,
    error: paymenterror,
  } = useSWRMutation(`/subscribeMembershipPackage`, WithTokenPostApi);
  const { trigger: deletebanktrigger } = useSWRMutation(
    `/bank/deleteBankDetail`,
    DeleteWithTokenTriggerApi
  );
  const { trigger: deletecardtrigger } = useSWRMutation(
    `/card/deleteCard`,
    DeleteWithTokenTriggerApi
  );
  let allowedValues = ['bank', 'card'];
  const PaymentmethodSchema = z
    .string()
    .min(1, { message: 'Please choose a payment method' })
    .refine((value) => allowedValues.includes(value), {
      message: 'Please choose a valid payment method',
    });
  const schema = z
    .object({
      account_number: z
        .union([
          z
            .string()
            .min(10, { message: "Account number can't be less than 10 digit" })
            .max(19, { message: "Account number can't be more than 19 digit" }),
          z.string().length(0),
        ])
        .optional(),
      routing_number: z
        .union([
          z
            .string()
            .min(9, { message: "Routing number can't be less than 9" })
            .max(9, { message: "Expiry month can't be more than 9" }),
          z.string().length(0),
        ])
        .optional(),
      account_holder_name: z
        .union([
          z.string().min(1, { message: "Account name can't be empty" }),
          z.string().length(0),
        ])
        .optional(),
      number: z
        .union([
          z
            .string()
            .min(13, { message: "Cardnumber can't be less than 13 digit" })
            .max(19, { message: "Cardnumber can't be more than 19 digit" }),
          z.string().length(0),
        ])
        .optional(),
      exp_month: z
        .union([
          z
            .string()
            .min(1, { message: "Expiry month can't be less than 1" })
            .max(2, { message: "Expiry month can't be more than 12" }),
          z.string().length(0),
        ])
        .optional(),
      exp_year: z
        .union([
          z
            .string()
            .min(4, { message: "Expiry year can't be less than current year" })
            .max(4, { message: "Expiry year can't be more than 4 digit" }),
          z.string().length(0),
        ])
        .optional(),
      cvc: z
        .union([
          z
            .string()
            .min(3, { message: "Cvc number can't be less than 3 digit" })
            .max(4, { message: "Cvc number can't be more than 4 digit" }),
          z.string().length(0),
        ])
        .optional(),
      card_holder_name: z
        .union([
          z.string().min(1, { message: "Card holder name can't be empty" }),
          z.string().length(0),
        ])
        .optional(),
      payment_method: PaymentmethodSchema,
      condition_accept: z.boolean().refine((value) => value === true, {
        message: 'Please accept terms and condition',
      }),
      //.transform(e => e === "" ? undefined : e)
    })
    .superRefine((data, ctx) => {
      if (data.exp_month > 12 && data.payment_method === 'card') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['exp_month'],
          message: `Expiry month number can't be more than 12`,
        });
      }
      if (data.exp_month < 1 && data.payment_method === 'card') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['exp_month'],
          message: `Expiry month number can't be less than 1`,
        });
      }
      if (
        data.exp_year < new Date().getFullYear() &&
        data.payment_method === 'card'
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['exp_year'],
          message: `Expiry year can't be less than current year`,
        });
      }
      if (data.payment_method === 'card' && data.card_holder_name === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['card_holder_name'],
          message: `Card holder name can't be empty`,
        });
      }
      if (data.payment_method === 'card' && data.cvc === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cvc'],
          message: `Cvc can't be empty`,
        });
      }
      if (data.payment_method === 'card' && data.number === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['number'],
          message: `Card number can't be empty`,
        });
      }
      if (data.payment_method === 'bank' && data.account_holder_name === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['account_holder_name'],
          message: `Account holder name can't be empty`,
        });
      }
      if (data.payment_method === 'bank' && data.account_number === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['account_number'],
          message: `Account number can't be empty`,
        });
      }
      if (data.payment_method === 'bank' && data.routing_number === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['routing_number'],
          message: `Routing number can't be empty`,
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
      routing_number: '',
      account_number: '',
      account_holder_name: '',
      number: '',
      exp_month: '',
      exp_year: '',
      cvc: '',
      card_holder_name: '',
      payment_method: '',
      condition_accept: false,
    },
  });
  const handleclose = (type) => {
    handlemodal(type);
    reset();
  };
  useEffect(() => {
    if (updatecarddata?.status === 200) {
      let payload = {
        membership_package_id: subscriptiondetails?.membership_package_id,
        userId: subscriptiondetails?.userId,
        monthly: subscriptiondetails?.monthly,
        payment_method: 'card',
      };
      paymenttrigger({ payload, axios: axiosAuth });
    }
  }, [updatecarddata]);
  useEffect(() => {
    if (updatebankdata?.status === 200) {
      let payload = {
        membership_package_id: subscriptiondetails?.membership_package_id,
        userId: subscriptiondetails?.userId,
        monthly: subscriptiondetails?.monthly,
        payment_method: 'bank',
      };
      paymenttrigger({ payload, axios: axiosAuth });
    }
  }, [updatebankdata]);
  const { errors, isDirty } = formState;
  useEffect(() => {
    if (carddata?.status === 200) {
      updatecardtrigger({ id: carddata?.data?.data?.id, axios: axiosAuth });
    }
    if (carderror !== undefined) {
      setError('number', {
        type: 'custom',
        message: carderror?.response?.data?.message,
      });
      setisloading(false);
    }
  }, [carddata, carderror]);
  useEffect(() => {
    if (bankdata?.status === 200) {
      updatebanktrigger({ id: bankdata?.data?.data?.id, axios: axiosAuth });
    }
    if (bankerror !== undefined) {
      setError('account_number', {
        type: 'custom',
        message: 'Bank details already exists',
      });
      setisloading(false);
    }
  }, [bankdata, bankerror]);
  useEffect(() => {
    if (paymentdata?.status === 200) {
      toast.success('Payment done successfully');
      handleclose('success');
      setisloading(false);
    }
    if (paymenterror !== undefined) {
      setError('condition_accept', {
        type: 'custom',
        message: paymenterror?.response?.data?.message,
      });
      if (getValues('payment_method') === 'card') {
        deletecardtrigger({ id: carddata?.data?.data?.id, axios: axiosAuth });
      }
      if (getValues('payment_method') === 'bank') {
        deletebanktrigger({ id: bankdata?.data?.data?.id, axios: axiosAuth });
      }
      setisloading(false);
    }
  }, [paymentdata, paymenterror]);
  const onSubmit = (data) => {
    let payload = {};
    if (data?.payment_method === 'card') {
      payload = {
        user_id: subscriptiondetails?.userId,
        card_holder_name: data?.card_holder_name,
        card_details: {
          number: data?.number,
          exp_month: data?.exp_month,
          exp_year: data?.exp_year,
          cvc: data?.cvc,
        },
      };
      cardtrigger({ payload, axios: axiosAuth });
    }
    if (data?.payment_method === 'bank') {
      payload = {
        bank_account_details: {
          routing_number: data?.routing_number,
          account_number: data?.account_number,
          account_holder_name: data?.account_holder_name,
          object: 'bank_account',
          country: 'US',
          currency: 'usd',
          account_holder_type: 'individual',
        },
        user_id: subscriptiondetails?.userId,
      };
      banktrigger({ payload, axios: axiosAuth });
    }
    setisloading(true);
  };
  const handleclick = (type) => {
    if (type === 'card') {
      setValue('account_holder_name', '');
      setValue('account_number', '');
      setValue('routing_number', '');
    }
    if (type === 'bank') {
      setValue('card_holder_name', '');
      setValue('cvc', '');
      setValue('exp_month', '');
      setValue('exp_year', '');
      setValue('number', '');
    }
  };
  return (
    <>
      <input type="checkbox" id="payment" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box !max-w-[61.5rem] max-h-[96.89vh] !bg-[#F4F6F8]">
          <div className="modal-action absolute right-6 top-0">
            <label
              //htmlFor="payment"
              className="w-[2.375rem] flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => handleclose('error')}
            >
              <Image
                src={CloseIcon}
                alt="Close icon"
                className="w-full h-auto"
              />
            </label>
          </div>
          <h1 className="text-[2rem] font-semibold text-center mb-[1.875rem]">
            Pay and Proceed
          </h1>
          <div
            className="alert max-h-[4.125rem] rounded-[0.625rem]"
            style={{
              backgroundImage: `url(${AlertBg})`,
              backgroundSize: 'cover',
            }}
          >
            <div className="gap-[1.0625rem]">
              <div className="w-[2.625rem] flex items-center justify-center overflow-hidden">
                <Image
                  src={NotificationIcon}
                  alt="Notification icon"
                  className="w-full h-auto"
                />
              </div>
              <span className="text-white text-[0.9375rem]">
                Please complete the transaction. Your information is encrypted
                and secure.
              </span>
            </div>
          </div>
          <div className="flex items-center bg-white rounded-[1.125rem] p-[1.5625rem] my-[1.625rem] shadow-[0_4px_11px_0px_rgba(0,0,0,0.06)]">
            <div>
              <h1 className="text-xl font-medium mb-[1.875rem]">
                Subscription Details
              </h1>
              <div className="flex items-start gap-10">
                <div className="flex items-start">
                  <div className="w-7 flex-[0_0_1.75rem] flex items-center justify-center overflow-hidden mr-2">
                    <Image
                      src={PlatinumIcon}
                      alt="Platinum icon"
                      className="w-full h-auto"
                    />
                  </div>
                  <div>
                    <h1 className="text-[0.8125rem] font-normal text-[#686E80] pb-2 whitespace-nowrap">
                      Plan Name
                    </h1>
                    <h2 className="text-[0.9375rem] font-medium">
                      {subscriptiondetails?.other_details?.name}
                    </h2>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-7 flex-[0_0_1.75rem] flex items-center justify-center overflow-hidden mr-2">
                    <Image
                      src={MonthlyIcon}
                      alt="Monthly icon"
                      className="w-full h-auto"
                    />
                  </div>
                  <div>
                    <h1 className="text-[0.8125rem] font-normal text-[#686E80] pb-2 whitespace-nowrap">
                      Payment Mode
                    </h1>
                    <h2 className="text-[0.9375rem] font-medium">
                      {subscriptiondetails?.monthly ? 'Monthly' : 'Yearly'}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="divider divider-horizontal w-[0.0625rem] before:w-[0.0625rem] before:bg-[#E3E3E3] after:w-[0.0625rem] after:bg-[#E3E3E3] ml-[1.4375rem] mr-[2.375rem]"></div>
            <div>
              <h1 className="text-[0.9375rem] font-medium mb-3">Features</h1>
              <ul className="list-none -my-[0.28125rem]">
                <li className="flex items-center py-[0.28125rem]">
                  <div className="w-4 flex items-center overflow-hidden">
                    <Image
                      src={listicon}
                      alt="Check icon"
                      className="w-full h-auto !mt-0"
                    />
                  </div>
                  <span className="text-[0.8125rem] !pl-[0.375rem]">
                    Exclusive member-only content
                  </span>
                </li>
                <li className="flex items-center py-[0.28125rem]">
                  <div className="w-4 flex items-center overflow-hidden">
                    <Image
                      src={listicon}
                      alt="Check icon"
                      className="w-full h-auto !mt-0"
                    />
                  </div>
                  <span className="text-[0.8125rem] !pl-[0.375rem]">
                    Early access to new content and features
                  </span>
                </li>
                <li className="flex items-center py-[0.28125rem]">
                  <div className="w-4 flex items-center overflow-hidden">
                    <Image
                      src={listicon}
                      alt="Check icon"
                      className="w-full h-auto !mt-0"
                    />
                  </div>
                  <span className="text-[0.8125rem] !pl-[0.375rem]">
                    Ability to cancel or change subscription anytime
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-[#EBF4FD] rounded-xl py-5 px-9 min-w-[10.0625rem] min-h-[5.875rem] ml-[3.375rem]">
              <h1 className="text-[0.8125rem] text-[#686E80] mb-[0.6875rem]">
                Total Amount
              </h1>
              <h2 className="text-[1.625rem] text-[#125ECB] font-bold">
                $
                {subscriptiondetails?.monthly
                  ? subscriptiondetails?.other_details?.monthly_price
                  : subscriptiondetails?.other_details?.yearly_price}
              </h2>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="bg-white rounded-[1.125rem] p-[1.5625rem] my-[1.625rem] shadow-[0_4px_11px_0px_rgba(0,0,0,0.06)]">
              <h1 className="text-xl font-medium mb-[1.5625em]">
                Subscription Details
              </h1>
              <ul className="-my-[1.375rem] mb-1">
                <li className="py-[1.375rem] border-b-[0.0625rem] border-[#E3E3E3] border-solid">
                  <label className="label cursor-pointer justify-start p-0 items-center max-w-max">
                    <input
                      type="radio"
                      name="radio-10"
                      value="card"
                      className="radio-sm checked:bg-primary mr-[0.875rem]"
                      {...register('payment_method')}
                      onClick={() => handleclick('card')}
                    />
                    <div className="w-5 flex items-center justify-center overflow-hidden mr-2">
                      <Image
                        src={CreditCardIcon}
                        alt="Credit card icon"
                        className="w-full h-auto"
                      />
                    </div>
                    <span className="label-text text-[#001725] text-[0.9375rem] font-medium">
                      Credit Card
                    </span>
                  </label>
                  {watch('payment_method') === 'card' && (
                    <div className="mt-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Enter Card Holder Name"
                            className="input input-bordered w-full rounded bg-white focus:outline-none text-[0.9375rem]"
                            {...register('card_holder_name')}
                          />
                          <p className="text-red-700 mb-0">
                            {errors?.card_holder_name?.message}
                          </p>
                        </div>
                        <div className="flex-1">
                          <input
                            type="number"
                            placeholder="Enter Card Number"
                            className="input input-bordered w-full rounded bg-white focus:outline-none text-[0.9375rem]"
                            {...register('number')}
                          />
                          <p className="text-red-700 mb-0">
                            {errors?.number?.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 mt-3">
                        <div className="flex-1">
                          <input
                            type="number"
                            placeholder="Enter Card Expiry Month"
                            className="input input-bordered w-full rounded bg-white focus:outline-none text-[0.9375rem]"
                            {...register('exp_month')}
                          />
                          <p className="text-red-700 mb-0">
                            {errors?.exp_month?.message}
                          </p>
                        </div>
                        <div className="flex-1">
                          <input
                            type="number"
                            placeholder="Enter Card Expiry Year"
                            className="input input-bordered w-full rounded bg-white focus:outline-none text-[0.9375rem]"
                            {...register('exp_year')}
                          />
                          <p className="text-red-700 mb-0">
                            {errors?.exp_year?.message}
                          </p>
                        </div>
                        <div className="flex-1">
                          <input
                            type="number"
                            placeholder="CVC"
                            className="input input-bordered w-full rounded bg-white focus:outline-none text-[0.9375rem]"
                            {...register('cvc')}
                          />
                          <p className="text-red-700 mb-0">
                            {errors?.cvc?.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
                <li className="py-[1.375rem]">
                  <label className="label cursor-pointer justify-start p-0 items-center max-w-max">
                    <input
                      type="radio"
                      name="radio-10"
                      className="radio-sm checked:bg-primary mr-[0.875rem]"
                      value="bank"
                      {...register('payment_method')}
                      onClick={() => handleclick('bank')}
                    />
                    <span className="label-text text-[#001725] text-[0.9375rem] font-medium">
                      ACH
                    </span>
                  </label>
                  {watch('payment_method') === 'bank' && (
                    <div className="mt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Enter Account Holder Name"
                            className="input input-bordered w-full rounded bg-white focus:outline-none text-[0.9375rem]"
                            {...register('account_holder_name')}
                          />
                          <p className="text-red-700 mb-0">
                            {errors?.account_holder_name?.message}
                          </p>
                        </div>
                        <div className="flex-1">
                          <input
                            type="number"
                            placeholder="Enter Account Number"
                            className="input input-bordered w-full rounded bg-white focus:outline-none text-[0.9375rem]"
                            {...register('account_number')}
                          />
                          <p className="text-red-700 mb-0">
                            {errors?.account_number?.message}
                          </p>
                        </div>
                        <div className="flex-1">
                          <input
                            type="number"
                            placeholder="Enter Routing Number"
                            className="input input-bordered w-full rounded bg-white focus:outline-none text-[0.9375rem]"
                            {...register('routing_number')}
                          />
                          <p className="text-red-700 mb-0">
                            {errors?.routing_number?.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
                {/* <li className="py-[1.375rem] border-b-[0.0625rem] border-[#E3E3E3] border-solid">
                      <label className="label cursor-pointer justify-start p-0 items-center max-w-max">
                        <input
                          type="radio"
                          name="radio-10"
                          className="radio-sm checked:bg-primary mr-[0.875rem]"
                        />
                        <span className="label-text text-[#635BFF] text-[0.9375rem] font-black">
                          Stripe
                        </span>
                      </label>
                    </li> */}
              </ul>
              <p className="text-red-700 mb-0">
                {errors?.payment_method?.message}
              </p>
            </div>
            <div className="flex items-center gap-[5.875rem]">
              <div>
                {/* <p className="text-[0.9375rem] text-[#001725] mb-[1.125rem]">
                      * If Payment Has Not Been Done Within 72 Hours the Call
                      Will Be Automatically Cancelled
                    </p> */}
                <label className="label cursor-pointer justify-start items-center p-0">
                  <input
                    type="checkbox"
                    className="checkbox-sm checkbox-primary mr-[0.625rem] focus:outline-none"
                    {...register('condition_accept')}
                  />
                  <span className="label-text text-[0.9375rem] text-[#686E80]">
                    Please Accept Our
                    <Link href="#" className="link link-primary ml-[0.125rem]">
                      Terms And Conditions
                    </Link>
                  </span>
                </label>
                <p className="text-red-700 mb-0">
                  {errors?.condition_accept?.message}
                </p>
              </div>
              <div className="modal-action mt-0">
                <label
                  //htmlFor="payment"
                  className="primary-btn !min-w-[11.4375rem] cursor-pointer"
                  onClick={() => handleclose('error')}
                >
                  Cancel
                </label>
                <button
                  type="submit"
                  className={`primary-btn !min-w-[11.4375rem] ${
                    isloading || !isDirty ? 'disable' : ''
                  }`}
                  disabled={isloading || !isDirty}
                >
                  Confirm and Pay
                </button>
              </div>
            </div>
          </form>
          <DevTool control={control} />
        </div>
      </div>
    </>
  );
};

export default Paymentmodal;
