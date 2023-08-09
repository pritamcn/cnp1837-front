'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWRMutation from 'swr/mutation';
import { WithoutTokenPostApi } from '@/services/module/api/postapi';
import { DevTool } from '@hookform/devtools';
import { toast } from 'react-toastify';
const ContactClient = () => {
  const schema = z
    .object({
      email: z
        .string()
        .min(1, { message: "Email can't be empty" })
        .email({ message: 'Must be a valid email' }),
      first_name: z.string().min(1, { message: "First name can't be empty" }),
      last_name: z.string().min(1, { message: "Last name can't be empty" }),
      message: z.string().min(1, { message: "Message can't be empty" }),
      phone: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.phone !== '' && data.phone.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['phone'],
          message: `Phone number can't be less than 10 characters`,
        });
      }
    });
  const {
    trigger,
    isMutating,
    data: postdata,
    error,
  } = useSWRMutation('/contact/create', WithoutTokenPostApi);
  const { register, handleSubmit, formState, setError, reset, control } =
    useForm({
      resolver: zodResolver(schema),
    });
  useEffect(() => {
    if (postdata?.status === 200) {
      reset();
      toast.success(postdata?.data?.message);
    }
  }, [postdata]);
  const onSubmit = (data) => {
    trigger(data);
  };
  const { errors, isDirty } = formState;
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <input
            type="text"
            placeholder="First Name"
            className="input w-full rounded bg-white focus:outline-none text-[0.9375rem]"
            {...register('first_name')}
          />
          <p className="text-red-700 mb-0">{errors?.first_name?.message}</p>
        </div>
        <div>
          <input
            type="text"
            className="input w-full rounded bg-white focus:outline-none text-[0.9375rem]"
            placeholder="Last Name"
            {...register('last_name')}
          />
          <p className="text-red-700 mb-0">{errors?.last_name?.message}</p>
        </div>
        <div>
          <input
            type="email"
            className="input w-full rounded bg-white focus:outline-none text-[0.9375rem]"
            placeholder="Email ID"
            {...register('email')}
          />
          <p className="text-red-700 mb-0">{errors?.email?.message}</p>
        </div>
        <div className="relative">
          <input
            type="number"
            className="input w-full rounded bg-white focus:outline-none text-[0.9375rem] pr-[5.125rem]"
            placeholder="Phone Number"
            {...register('phone')}
          />
          <p className="text-red-700 mb-0">{errors?.phone?.message}</p>
          <span className="text-[0.8125rem] text-[#8790AF] font-normal absolute top-1/2 right-4 -translate-y-1/2 z-10">
            (optional)
          </span>
        </div>
        <div className="col-span-2">
          <textarea
            name="message"
            id="message"
            className="input w-full rounded bg-white focus:outline-none text-[0.9375rem] resize-none col-span-2 min-h-[8.8125rem]"
            placeholder="Message"
            {...register('message')}
          ></textarea>
          <p className="text-red-700 mb-0">{errors?.message?.message}</p>
        </div>
      </div>
      <button
        className="primary-btn !min-w-[18.125rem] mt-[1.875rem]"
        type="submit"
      >
        Send Now
      </button>
      <DevTool control={control} />
    </form>
  );
};

export default ContactClient;
