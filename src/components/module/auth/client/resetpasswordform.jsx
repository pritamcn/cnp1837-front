'use client';
import React, { useEffect, useState } from 'react';
import { redirect, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { WithoutTokenPostApi } from '@/services/module/api/postapi';
const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get('token');
  const [openpassword, setopenpassword] = useState(false);
  const schema = z
    .object({
      new_password: z
        .string()
        .min(8, { message: "Password can't be less than 8 characters" }),
      confirm_password: z.string(),
    })
    .superRefine((data, ctx) => {
      if (data.confirm_password !== data.new_password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirm_password'],
          message: `Confirm password should be same as new password`,
        });
      }
    });
  const { register, handleSubmit, formState, setError, reset } = useForm({
    resolver: zodResolver(schema),
  });
  const { trigger, isMutating, data, error } = useSWRMutation(
    '/resetPassword',
    WithoutTokenPostApi
  );
  const { errors, isDirty } = formState;
  const onSubmit = (data) => {
    let payload = { ...data, token: search };
    trigger(payload);
  };
  useEffect(() => {
    if (data === undefined && error?.response?.status === 401) {
      setError('new_password', {
        type: 'custom',
        message: error?.response?.data?.message,
      });
    }
    if (data?.status === 200) {
      reset();
      toast.success(data?.data?.message);
      redirect('/Signin');
      //router.push("/Signin")
    }
  }, [data, error]);
  return (
    <form
      className="auth-page-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="mb-4">
        <div className="form-field !mb-0">
          <input
            type={openpassword ? 'text' : 'password'}
            placeholder="Password"
            className="form-control"
            {...register('new_password')}
          />
          <span className="eye-hide-icon">
            {openpassword ? (
              <div className="eye-open" onClick={() => setopenpassword(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            ) : (
              <div className="eye-close" onClick={() => setopenpassword(true)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              </div>
            )}
          </span>
        </div>
        <p className="text-red-700 pb-0">{errors?.new_password?.message}</p>
      </div>
      <div>
        <div className="form-field eye-hide !mb-0">
          <input
            type="text"
            placeholder="Confirm Password"
            className="form-control"
            {...register('confirm_password')}
          />
        </div>
        <p className="text-red-700 pb-0">{errors?.confirm_password?.message}</p>
      </div>

      <div className="text-center mt-6">
        <button
          type="submit"
          disabled={!isDirty || isMutating}
          className={`auth-page-btn ${!isDirty || isMutating ? 'disable' : ''}`}
        >
          Reset Password
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
