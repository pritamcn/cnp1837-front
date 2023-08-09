'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { useSession } from 'next-auth/react';
import { UpdateWithTokenapi } from '@/services/module/api/putapi';
const UpdateProfile = () => {
  const axiosAuth = useAxiosAuth();
  // const { data: getdata,error,isLoading } = useSWR([`/profile/getUserProfile/${id}`, axiosAuth], ([url, axiosAuth]) => Get(url,axiosAuth),{
  //   revalidateOnFocus:false
  // })
  const { data: session, update } = useSession();
  const {
    trigger,
    isMutating,
    data: postdata,
  } = useSWRMutation(`/profile/updateProfile/${session?.user?.id}`, UpdateWithTokenapi);
  async function updateSession(sessionvalue) {
    await update({
      ...session,
      user: {
        ...session?.user,
        first_name: sessionvalue?.first_name,
        last_name: sessionvalue?.last_name,
        email: sessionvalue?.email,
        phone: sessionvalue?.phone?.toString(),
      },
    });
  }
  const schema = z
    .object({
      first_name: z
        .string()
        .min(2, { message: "Firstname can't be less than 2 character" })
        .max(10, { message: "Firstname can't be more than 10 character" }),
      last_name: z
        .string()
        .min(2, { message: "Lastname can't be less than 2 character" })
        .max(10, { message: "Lastname can't be more than 10 character" }),
      email: z
        .string()
        .min(1, { message: "Email can't be empty" })
        .email({ message: 'Must be a valid email' }),
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
      if (data.email?.includes('@hotmail')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['email'],
          message: `hotmail not supported`,
        });
      }
    });
  const {
    register,
    control,
    handleSubmit,
    formState,
    setError,
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    // defaultValues:async()=>{
    //   return {
    //     first_name:value.user.first_name,
    //     last_name:value.user.last_name,
    //     email:value.user.email,
    //     phone:value.user.phone ==="0"?"" :value.user.phone
    //   }
    // }
  });
  const { errors, isDirty } = formState;
  useEffect(() => {
    if (session !== undefined) {
      setValue('first_name', session.user.first_name);
      setValue('last_name', session.user.last_name);
      setValue('email', session.user.email);
      setValue('phone', session.user.phone === '0' ? '' : session.user.phone);
    }
  }, [session]);
  useEffect(() => {
    if (isDirty && postdata?.status === 200) {
      reset();
      toast.success(postdata?.data?.message);
      updateSession(postdata?.data?.data);
      //router.push("/Signin")
    }
  }, [postdata]);
  const onSubmit = (data) => {
    trigger({ data, axios: axiosAuth });
  };
  return (
    <form
      className="update-form-1"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="mb-4">
        <div className="form-field !mb-0">
          <input
            type="text"
            placeholder="First Name"
            className="form-control"
            {...register('first_name')}
          />
        </div>
        <p className="text-red-700 mb-0">{errors?.first_name?.message}</p>
      </div>
      <div className="mb-4">
        <div className="form-field !mb-0">
          <input
            type="text"
            placeholder="Last Name"
            className="form-control"
            {...register('last_name')}
          />
        </div>
        <p className="text-red-700 mb-0">{errors?.last_name?.message}</p>
      </div>
      <div className="mb-4">
        <div className="form-field !mb-0">
          <input
            type="email"
            placeholder="Email"
            className="form-control"
            {...register('email')}
          />
        </div>
        <p className="text-red-700 mb-0">{errors?.email?.message}</p>
      </div>
      <div className="mb-4">
        <div className="form-field !mb-0">
          <input
            type="number"
            placeholder="Phone Number"
            className="form-control"
            {...register('phone')}
          />
        </div>
        <p className="text-red-700 mb-0">{errors?.phone?.message}</p>
      </div>
      <div className="text-left mt-6">
        <button
          type="submit"
          disabled={!isDirty}
          className={`primary-btn ${!isDirty || isMutating ? 'disable' : ''}`}
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default UpdateProfile;
