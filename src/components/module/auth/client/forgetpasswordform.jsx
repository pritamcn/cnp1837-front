'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';
import { WithoutTokenPostApi } from '@/services/module/api/postapi';
const ForgotPasswordForm = () => {
  const schema = z.object({
    email: z
      .string()
      .min(1, { message: "Email can't be empty" })
      .email({ message: 'Must be a valid email' }),
  });
  const { trigger, isMutating, data, error } = useSWRMutation(
    '/forgetpassword',
    WithoutTokenPostApi
  );
  const { register, handleSubmit, formState, setError, reset } = useForm({
    resolver: zodResolver(schema),
  });
  useEffect(() => {
    if (data === undefined && error?.response?.status === 404) {
      setError('email', {
        type: 'custom',
        message: error?.response?.data?.message,
      });
    }
    if (data?.status === 200) {
      toast.success(data?.data?.message);
      reset();
    }
  }, [data, error]);
  const { errors, isDirty } = formState;
  const onSubmit = (data) => {
    trigger(data);
  };
  return (
    <form
      className="auth-page-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div>
        <div className="form-field !mb-0">
          <input
            type="email"
            placeholder="Email ID"
            className="form-control"
            {...register('email')}
          />
        </div>
        <p className="text-red-700 pb-0">{errors?.email?.message}</p>
      </div>
      <div className="text-center mt-6 md:mt-12">
        <button
          type="submit"
          disabled={!isDirty}
          className={`auth-page-btn ${!isDirty ? 'disable' : ''}`}
        >
          Request Reset Password
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
