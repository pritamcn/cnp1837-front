import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { WithTokenPostApi } from '@/services/module/api/postapi';
const Addbankmodal = ({ handlemodal }) => {
  const axiosAuth = useAxiosAuth();

  const schema = z
    .object({
      first_name: z
        .union([
          z.string().min(1, { message: "First can't be empty" }),
          z.string().length(0),
        ])
        .optional(),
      last_name: z
        .union([
          z.string().min(1, { message: "Last can't be empty" }),
          z.string().length(0),
        ])
        .optional(),
      email: z
        .union([
          z.string().min(1, { message: "Email can't be empty" }),
          z.string().length(0),
        ])
        .optional(),
    })
    .superRefine((data, ctx) => {
      let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
      if (data.first_name === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['first_name'],
          message: `First name can't be empty`,
        });
      }
      if (data.last_name === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['last_name'],
          message: `Last can't be empty`,
        });
      }
      if (data.email === '' || !regex.test(data.email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['email'],
          message: `Enter valid email`,
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
      first_name: '',
      last_name: '',
      email: '',
    },
  });

  const {
    trigger,
    isMutating,
    data: postdata,
    error,
  } = useSWRMutation('/createStripeAccount', WithTokenPostApi);

  const onSubmit = (data) => {
    let payload = {};
    payload = {
      "email": data.email,
      "first_name": data.first_name,
      "last_name": data.last_name
    }
    //  trigger(payload)
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
      handlemodal();
    }
    if (postdata === undefined && error !== undefined) {
      setError('email', {
        type: 'custom',
        message: "Account not created successfully",
      });
    }
  }, [postdata, error]);

  return (
    <div className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <label
          //htmlFor="add-bank-modal"
          className="modal-close-btn"
          onClick={handleclosemodal}
        >
          ✕
        </label>
        <h3 className="modal-title">Add New Bank</h3>
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
                    type="text"
                    placeholder="First name"
                    className="form-control"
                    {...register('first_name')}
                  />
                </div>
                <p className="text-red-700 mb-0">
                  {errors?.first_name?.message}
                </p>
              </div>
            </div>
            <div className="w-full px-2">
              <div className="mb-4">
                <div className="form-field !mb-0">
                  <input
                    type="text"
                    placeholder="Last name"
                    className="form-control"
                    {...register('last_name')}
                  />
                </div>
                <p className="text-red-700 mb-0">
                  {errors?.last_name?.message}
                </p>
              </div>
            </div>
            <div className="w-full px-2">
              <div className="mb-4">
                <div className="form-field !mb-0">
                  <input
                    type="email"
                    placeholder="Email"
                    className="form-control"
                    {...register('email')}
                  />
                </div>
                <p className="text-red-700 mb-0">
                  {errors?.email?.message}
                </p>
              </div>
            </div>
            {/* </>} */}
          </div>
          <div className="modal-action">
            <div className="flex flex-wrap justify-center w-full">
              <label
                //htmlFor="add-bank-modal"
                type="button"
                className="primary-btn btn-outline"
                onClick={handleclosemodal}
              >
                Cancel
              </label>
              <button
                type="submit"
                //className="primary-btn ml-2.5"
                className={`primary-btn ml-2.5 ${!isDirty || isMutating ? 'disable' : ''
                  }`}
                disabled={!isDirty || isMutating}
              >
                Create account
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addbankmodal;
