import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { WithTokenPostApi } from '@/services/module/api/postapi';
const Addbankmodal = ({ userid, handlemodal }) => {
  const axiosAuth = useAxiosAuth();
  const {
    trigger,
    isMutating,
    data: postdata,
    error,
  } = useSWRMutation('/bank/saveBankDetails', WithTokenPostApi);
  const schema = z.object({
    account_number: z
      .string()
      .min(10, { message: "Account number can't be less than 10 digit" })
      .max(19, { message: "Account number can't be more than 19 digit" }),
    routing_number: z
      .string()
      .min(9, { message: "Routing number can't be less than 9" })
      .max(9, { message: "Expiry month can't be more than 9" }),
    account_holder_name: z
      .string()
      .min(1, { message: "Account holder name can't be empty" }),
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
    },
  });

  const onSubmit = (data) => {
    let payload = {
      bank_account_details: {
        ...data,
        object: 'bank_account',
        country: 'US',
        currency: 'usd',
        account_holder_type: 'individual',
      },
      user_id: userid,
    };
    trigger({ payload, axios: axiosAuth });
    //  trigger(payload)
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
        message: "Bank details already exists",
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
                    placeholder="Account Holder Name"
                    className="form-control"
                    {...register('account_holder_name')}
                  />
                </div>
                <p className="text-red-700 mb-0">
                  {errors?.account_holder_name?.message}
                </p>
              </div>
            </div>
            <div className="w-full px-2">
              <div className="mb-4">
                <div className="form-field !mb-0">
                  <input
                    type="number"
                    placeholder="Routing Number"
                    className="form-control"
                    {...register('routing_number')}
                  />
                </div>
                <p className="text-red-700 mb-0">
                  {errors?.routing_number?.message}
                </p>
              </div>
            </div>
            <div className="w-full px-2">
              <div className="mb-4">
                <div className="form-field !mb-0">
                  <input
                    type="number"
                    placeholder="Account Number"
                    className="form-control"
                    {...register('account_number')}
                  />
                </div>
                <p className="text-red-700 mb-0">
                  {errors?.account_number?.message}
                </p>
              </div>
            </div>
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
                className={`primary-btn ml-2.5 ${
                  !isDirty || isMutating ? 'disable' : ''
                }`}
                disabled={!isDirty || isMutating}
              >
                Connect your ACH Account
              </button>
            </div>
          </div>
        </form>
      </div>
      <DevTool control={control} />
    </div>
  );
};

export default Addbankmodal;
