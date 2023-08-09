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
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { WithTokenPostApi } from '@/services/module/api/postapi';
import {
  WithTokenGetApi,
  WithTokenTriggerGetApi,
} from '@/services/module/api/getapi';
import { DeleteWithTokenTriggerApi } from '@/services/module/api/deleteapi';
import { Bank, Card } from './Card';
import UserIcon from '../../../../../assets/images/payment-history/pay-and-proceed/user-icon.svg';
import NumberIcon from '../../../../../assets/images/payment-history/pay-and-proceed/number-icon.svg';
const Payment = ({ paymentdetails: subscriptiondetails, handlemodal }) => {
  const axiosAuth = useAxiosAuth();
  const [isloading, setisloading] = useState(false);

  const [defaultCardList, setDefaultCardList] = useState([]);
  const [defaultBankList, setDefaultBankList] = useState([]);

  // Card list API
  const {
    data: getCardList,
    error: getcarderror,
    isLoading: getcarddataLoading,
    mutate: mutatecard,
  } = useSWR(
    [`/card/getCards`, axiosAuth],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );

  // Bank list API
  const {
    data: getBankList,
    error: getbankerror,
    isLoading: getbankdataLoading,
    mutate: mutatebank,
  } = useSWR(
    [`/bank/getBankDetails`, axiosAuth],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );

  // Get card list
  useEffect(() => {
    if (getCardList?.status === 200 && getCardList?.data?.data?.length > 0) {
      setDefaultCardList(
        getCardList?.data?.data?.filter((item) => item.is_default)
      );
    }
    if (getCardList?.status === 200 && getCardList?.data?.data?.length === 0) {
      setDefaultCardList([]);
    }
  }, [getCardList]);

  // Get bank list
  useEffect(() => {
    if (getBankList?.status === 200 && getBankList?.data?.data?.length > 0) {
      setDefaultBankList(
        getBankList?.data?.data?.filter((item) => item.is_default)
      );
    }
    if (getBankList?.status === 200 && getBankList?.data?.data?.length === 0) {
      setDefaultBankList([]);
    }
  }, [getBankList]);

  // const {
  //     trigger: cardtrigger,
  //     data: carddata,
  //     error: carderror,
  // } = useSWRMutation('/card/saveCard', WithTokenPostApi);
  // const {
  //     trigger: banktrigger,
  //     data: bankdata,
  //     error: bankerror,
  // } = useSWRMutation('/bank/saveBankDetails', WithTokenPostApi);
  // const { trigger: updatecardtrigger, data: updatecarddata } = useSWRMutation(
  //     `/card/makeCardDefault`,
  //     WithTokenTriggerGetApi
  // );
  // const { trigger: updatebanktrigger, data: updatebankdata } = useSWRMutation(
  //     `/bank/makeBankDefault`,
  //     WithTokenTriggerGetApi
  // );

  const {
    trigger: physicianpaymenttrigger,
    data: physicianpaymentdata,
    error: physicianpaymenterror,
  } = useSWRMutation(`/payment/physicianPayment`, WithTokenPostApi);

  const {
    trigger: courtReporterpaymenttrigger,
    data: courtReporterpaymentdata,
    error: courtReporterpaymenterror,
  } = useSWRMutation(`/payment/courtReporterPayment`, WithTokenPostApi);

  // const { trigger: deletebanktrigger } = useSWRMutation(
  //     `/bank/deleteBankDetail`,
  //     DeleteWithTokenTriggerApi
  // );
  // const { trigger: deletecardtrigger } = useSWRMutation(
  //     `/card/deleteCard`,
  //     DeleteWithTokenTriggerApi
  // );
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
      if (
        data.exp_month > 12 &&
        data.payment_method === 'card' &&
        defaultCardList.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['exp_month'],
          message: `Expiry month number can't be more than 12`,
        });
      }
      if (
        data.exp_month < 1 &&
        data.payment_method === 'card' &&
        defaultCardList.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['exp_month'],
          message: `Expiry month number can't be less than 1`,
        });
      }
      if (
        data.exp_year < new Date().getFullYear() &&
        data.payment_method === 'card' &&
        defaultCardList.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['exp_year'],
          message: `Expiry year can't be less than current year`,
        });
      }
      if (
        data.payment_method === 'card' &&
        data.card_holder_name === '' &&
        defaultCardList.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['card_holder_name'],
          message: `Card holder name can't be empty`,
        });
      }
      if (
        data.payment_method === 'card' &&
        data.cvc === '' &&
        defaultCardList.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cvc'],
          message: `Cvc can't be empty`,
        });
      }
      if (
        data.payment_method === 'card' &&
        data.number === '' &&
        defaultCardList.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['number'],
          message: `Card number can't be empty`,
        });
      }
      if (
        data.payment_method === 'bank' &&
        data.account_holder_name === '' &&
        defaultBankList.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['account_holder_name'],
          message: `Account holder name can't be empty`,
        });
      }
      if (
        data.payment_method === 'bank' &&
        data.account_number === '' &&
        defaultBankList.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['account_number'],
          message: `Account number can't be empty`,
        });
      }
      if (
        data.payment_method === 'bank' &&
        data.routing_number === '' &&
        defaultBankList.length === 0
      ) {
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
  const { errors, isDirty } = formState;
  

  useEffect(() => {
    if (physicianpaymentdata?.status === 200) {
      toast.success('Payment done successfully');
      handlemodal('success');
      setisloading(false);
    }
    if (physicianpaymenterror !== undefined) {
      
      setisloading(false);
    }
  }, [physicianpaymentdata, physicianpaymenterror]);

  useEffect(() => {
    if (courtReporterpaymentdata?.status === 200) {
      toast.success('Payment done successfully');
      handlemodal('success');
      setisloading(false);
    }
    if (courtReporterpaymenterror !== undefined) {
      
      setisloading(false);
    }
  }, [courtReporterpaymentdata, courtReporterpaymenterror]);

  const onSubmit = (data) => {
    let payload = {};
    let roleId = parseInt(subscriptiondetails.roleId);
    if (data?.payment_method === 'card') {
      if (roleId === 4) {
        if (defaultCardList.length > 0) {
          payload = {
            user_id: subscriptiondetails?.userId,
            deposition_id: subscriptiondetails?.deposition_no,
            amount: subscriptiondetails?.amount,
            card_saved_flag: 0,
            card_id: defaultCardList[0].id + '',
          };
          physicianpaymenttrigger({ payload, axios: axiosAuth });
        } else {
          payload = {
            user_id: subscriptiondetails?.userId,
            deposition_id: subscriptiondetails?.deposition_no,
            amount: subscriptiondetails?.amount,
            card_saved_flag: 1,
            card_holder_name: data?.card_holder_name,
            card_details: {
              number: data?.number,
              exp_month: data?.exp_month,
              exp_year: data?.exp_year,
              cvc: data?.cvc,
            },
          };
          physicianpaymenttrigger({ payload, axios: axiosAuth });
        }
      } else if (roleId === 5) {
        if (defaultCardList.length > 0) {
          payload = {
            user_id: subscriptiondetails?.userId,
            deposition_id: subscriptiondetails?.deposition_no,
            amount: subscriptiondetails?.amount,
            card_saved_flag: 0,
            card_id: defaultCardList[0].id + '',
          };
          courtReporterpaymenttrigger({ payload, axios: axiosAuth });
        } else {
          payload = {
            user_id: subscriptiondetails?.userId,
            deposition_id: subscriptiondetails?.deposition_no,
            amount: subscriptiondetails?.amount,
            card_saved_flag: 1,
            card_holder_name: data?.card_holder_name,
            card_details: {
              number: data?.number,
              exp_month: data?.exp_month,
              exp_year: data?.exp_year,
              cvc: data?.cvc,
            },
          };
          courtReporterpaymenttrigger({ payload, axios: axiosAuth });
        }
      }
    }
    if (data?.payment_method === 'bank') {
      if (roleId === 4) {
        if (defaultBankList.length > 0) {
          payload = {
            user_id: subscriptiondetails?.userId,
            deposition_id: subscriptiondetails?.deposition_no,
            amount: subscriptiondetails?.amount,
            card_saved_flag: 2,
            bank_id: defaultBankList[0].id + '',
          };
          physicianpaymenttrigger({ payload, axios: axiosAuth });
        } else {
          payload = {
            deposition_id: subscriptiondetails?.deposition_no,
            amount: subscriptiondetails?.amount,
            user_id: subscriptiondetails?.userId,
            card_saved_flag: 3,
            bank_account_details: {
              routing_number: data?.routing_number,
              account_number: data?.account_number,
              account_holder_name: data?.account_holder_name,
              object: 'bank_account',
              country: 'US',
              currency: 'usd',
              account_holder_type: 'individual',
            },
          };
          physicianpaymenttrigger({ payload, axios: axiosAuth });
        }
      } else if (roleId === 5) {
        if (defaultCardList.length > 0) {
          payload = {
            user_id: subscriptiondetails?.userId,
            deposition_id: subscriptiondetails?.deposition_no,
            amount: subscriptiondetails?.amount,
            bank_saved_flag: 2,
            bank_id: defaultBankList[0].id + '',
          };
          courtReporterpaymenttrigger({ payload, axios: axiosAuth });
        } else {
          payload = {
            deposition_id: subscriptiondetails?.deposition_no,
            amount: subscriptiondetails?.amount,
            user_id: subscriptiondetails?.userId,
            bank_saved_flag: 3,
            bank_account_details: {
              routing_number: data?.routing_number,
              account_number: data?.account_number,
              account_holder_name: data?.account_holder_name,
              object: 'bank_account',
              country: 'US',
              currency: 'usd',
              account_holder_type: 'individual',
            },
          };
          courtReporterpaymenttrigger({ payload, axios: axiosAuth });
        }
      }
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
            <div className="flex-1">
              <h1 className="text-xl font-medium mb-[1.875rem]">
                Payee Details
              </h1>

              <div className="flex items-start gap-5">
                <div className="flex flex-col gap-3 flex-1">
                  <div className="flex items-center">
                    <div className="w-4 flex-[0_0_1rem] flex items-center justify-center overflow-hidden mr-2">
                      <Image
                        src={UserIcon}
                        alt="Platinum icon"
                        className="w-full h-auto"
                      />
                    </div>
                    <div
                      className="tooltip"
                      data-tip={subscriptiondetails?.payee}
                    >
                      <h1 className="text-[0.8125rem] font-normal text-[#686E80] whitespace-nowrap truncate max-w-[11.25rem]">
                        {subscriptiondetails?.payee}
                      </h1>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-4 flex-[0_0_1rem] flex items-center justify-center overflow-hidden mr-2">
                      <Image
                        src={NumberIcon}
                        alt="Monthly icon"
                        className="w-full h-auto"
                      />
                    </div>
                    <div
                      className="tooltip"
                      data-tip={subscriptiondetails?.email}
                    >
                      <h1 className="text-[0.9375rem] font-normal text-[#686E80] truncate max-w-[11.25rem]">
                        {subscriptiondetails?.email}
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  <div className="flex items-start">
                    <div className="w-4 flex-[0_0_1rem] flex items-center justify-center overflow-hidden mr-2">
                      <Image
                        src={NumberIcon}
                        alt="Monthly icon"
                        className="w-full h-auto"
                      />
                    </div>
                    <div
                      className="tooltip"
                      data-tip={subscriptiondetails?.depo_num}
                    >
                      <h1 className="text-[0.9375rem] font-normal text-[#686E80] truncate max-w-[11.25rem]">
                        {subscriptiondetails?.depo_num}
                      </h1>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-4 flex-[0_0_1rem] flex items-center justify-center overflow-hidden mr-2">
                      <Image
                        src={NumberIcon}
                        alt="Monthly icon"
                        className="w-full h-auto"
                      />
                    </div>
                    <div
                      className="tooltip"
                      data-tip={subscriptiondetails?.role_name}
                    >
                      <h1 className="text-[0.9375rem] font-normal text-[#686E80] truncate max-w-[11.25rem]">
                        {subscriptiondetails?.role_name}
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="flex items-start flex-1">
                  <div className="w-4 flex-[0_0_1rem] flex items-center justify-center overflow-hidden mr-2">
                    <Image
                      src={NumberIcon}
                      alt="Monthly icon"
                      className="w-full h-auto"
                    />
                  </div>
                  <div
                    className="tooltip"
                    data-tip={subscriptiondetails?.due_date}
                  >
                    <h1 className="text-[0.9375rem] font-normal text-[#686E80] truncate max-w-[11.25rem]">
                      {subscriptiondetails?.due_date}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#EBF4FD] rounded-xl py-5 px-9 min-w-[10.0625rem] min-h-[5.875rem]">
              <h1 className="text-[0.8125rem] text-[#686E80] mb-[0.6875rem]">
                Total Amount
              </h1>
              <h2 className="text-[1.625rem] text-[#125ECB] font-bold">
                ${subscriptiondetails.amount}
              </h2>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="bg-white rounded-[1.125rem] p-[1.5625rem] my-[1.625rem] shadow-[0_4px_11px_0px_rgba(0,0,0,0.06)]">
              <h1 className="text-xl font-medium mb-[1.5625em]">
                Payment Details
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
                      <div className="grid grid-cols-3 gap-[0.9375rem]">
                        {defaultCardList.length > 0 && (
                          <Card cardItem={defaultCardList[0]} />
                        )}
                      </div>
                      {defaultCardList.length === 0 && (
                        <>
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
                        </>
                      )}
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
                      <div className="grid grid-cols-3 gap-[0.9375rem]">
                        {defaultBankList.length > 0 && (
                          <Bank bankItem={defaultBankList[0]} />
                        )}
                      </div>
                      {defaultBankList.length === 0 && (
                        <>
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
                        </>
                      )}
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
        </div>
      </div>
    </>
  );
};

export default Payment;
