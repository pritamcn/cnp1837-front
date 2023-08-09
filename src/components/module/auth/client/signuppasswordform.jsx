'use client';
import downicon from './../../../../assets/images/icons/chevron-down-icon.svg';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ReCAPTCHA from 'react-google-recaptcha';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { WithoutTokenGetApi } from '@/services/module/api/getapi';
import { WithoutTokenPostApi } from '@/services/module/api/postapi';
import Loader from '../../user/lawfirm/Loader';
import { validate_password } from '@/helpers/mischelper';
import info from '../../../../assets/images/registration/info.svg';
import { Tooltip } from 'react-tooltip';

const SignupPasswordForm = () => {
  const [isRecaptcha, setIsRecaptcha] = useState('');
  const [openpassword, setopenpassword] = useState(false);
  const [role, setrole] = useState(false);
  const [rolename, setrolename] = useState('');
  const router = useRouter();
  const params = useSearchParams();
  const [allroles, setallroles] = useState([]);
  const [token, settoken] = useState(params.get('token'));
  const { data: getdata, isLoading: tokenloadidng } = useSWR(
    `/getInviteUser/${token}`,
    WithoutTokenGetApi,
    {
      revalidateOnFocus: false,
    }
  );
  const {
    trigger,
    isMutating,
    data: postdata,
    error,
  } = useSWRMutation('/registerUser', WithoutTokenPostApi);
  let allowedValues = allroles?.map((data) =>
    data.id.toString()
  );
  const RoleSchema = z
    .string()
    .min(1, { message: 'Please choose a role' })
    .refine((value) => allowedValues?.includes(value), {
      message: 'Invalid value',
    });
  const schema = z
    .object({
      first_name: z
        .string()
        .min(3, { message: "Firstname can't be less than 2 character" })
        .max(10, { message: "Firstname can't be more than 10 character" }),
      last_name: z
        .string()
        .min(3, { message: "Lastname can't be less than 2 character" })
        .max(10, { message: "Lastname can't be more than 10 character" }),
      role_id: RoleSchema,
      email: z
        .string()
        .min(1, { message: "Email can't be empty" })
        .email({ message: 'Must be a valid email' }),
      password: z
        .string()
        .min(8, { message: 'Password must be greater than 8 digits' })
        .max(10, {
          message: 'Password must be less than 10 digits',
        }),
      phone: z.string().optional(),
      password_confirmation: z
        .string()
        .min(8, { message: 'Confirm password must be greater than 7 digits' })
        .max(10, {
          message: 'Confirm password must be less than 10 digits',
        }),
    })
    .superRefine((data, ctx) => {
      if (data.password_confirmation !== data.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['password_confirmation'],
          message: `Confirm Password Should be same as password`,
        });
      }
      if (!validate_password(data.password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['password'],
          message: `Password not match the password criteria`,
        });
      }
      if (data.phone !== '' && data.phone.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['phone'],
          message: `Phone number can't be less than 10 characters`,
        });
      }
      if (data.role_id === '0') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['role_id'],
          message: `Please select user role`,
        });
      }
      if (data.Email?.includes('@hotmail')) {
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
    watch,
    getValues,
    setValue,
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      role_id: '',
    },
  });
  const handleul = (item) => {
    setValue('role_id', item?.id?.toString());
    setrole(false);
    setrolename(item?.role);
  };
  const onSubmit = (data) => {
    let payload = { ...data, token, status: getdata?.status };
     trigger(payload);
  };
  function onRecaptchaChange(value) {
    setIsRecaptcha(value);
  }
  useEffect(() => {
    if (postdata?.status === 200) {
      reset();
      toast.success(postdata?.data?.message);
      //router.push('/Signin');
      redirect('/Signin');
    }
    if (error !== undefined) {
      setError('email', {
        type: 'custom',
        message: error?.response?.data?.message,
      });
    }
  }, [postdata, error]);
  const { errors, isDirty } = formState;
  useEffect(() => {
    if (getdata?.status === 200) {
      setValue('role_id', getdata?.data?.inviteeUserData?.role_id?.toString());
      setValue('email', getdata?.data?.inviteeUserData?.email);
      setValue('first_name', getdata?.data?.inviteeUserData?.first_name);
      setValue('last_name', getdata?.data?.inviteeUserData?.last_name);
      setrolename(getdata?.data?.inviteeUserData?.role_name);
      let allroles=getdata?.data?.roleListData?.filter((item)=>item?.id !==6)
      setallroles(token===null?allroles:getdata?.data?.roleListData)
    }
  }, [getdata]);
  const handlerole = () => {
    if (getdata?.data?.inviteeUserData?.role_name === '') {
      setrole(!role);
    }
  };

  return (
    <>
      {getdata !== undefined ? (
        <div className="auth-page auth-page-bg p-top-padding p-end-padding">
          <div className="container">
            <div className="auth-page-wrap">
              <h2 className="auth-page-title">Registration</h2>
              <p className="auth-page-text">
                Welcome! Please Enter Your Details
              </p>
              <form
                className="auth-page-form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <div className="mb-4">
                  <div
                    className={`form-field !mb-0 ${
                      getdata?.data?.inviteeUserData?.first_name !== '' ? '!bg-slate-300' : null
                    }`}
                  >
                    <input
                      type="text"
                      placeholder="First Name"
                      className={`form-control ${
                        getdata?.data?.inviteeUserData?.first_name !== ''
                          ? '!bg-slate-300'
                          : null
                      }`}
                      //className="form-control"
                      disabled={getdata?.data?.inviteeUserData?.first_name !== ''}
                      {...register('first_name')}
                    />
                  </div>
                  <p className="text-red-700 mb-0">
                    {errors?.first_name?.message}
                  </p>
                </div>
                <div className="mb-4">
                  <div
                    className={`form-field !mb-0 ${
                      getdata?.data?.inviteeUserData?.last_name !== '' ? '!bg-slate-300' : null
                    }`}
                  >
                    <input
                      type="text"
                      placeholder="Last name"
                      className={`form-control ${
                        getdata?.data?.inviteeUserData?.last_name !== '' ? '!bg-slate-300' : null
                      }`}
                      //className="form-control"
                      disabled={getdata?.data?.inviteeUserData?.last_name !== ''}
                      {...register('last_name')}
                    />
                  </div>
                  <p className="text-red-700 mb-0">
                    {errors?.last_name?.message}
                  </p>
                </div>
                <div className="mb-4">
                  <div
                    className={`form-field !mb-0 ${
                      getdata?.data?.inviteeUserData?.email !== '' ? '!bg-slate-300' : null
                    }`}
                  >
                    <input
                      type="email"
                      placeholder="Email ID"
                      className={`form-control ${
                        getdata?.data?.inviteeUserData?.email !== '' ? '!bg-slate-300' : null
                      }`}
                      //className="form-control"
                      disabled={getdata?.data?.inviteeUserData?.email !== ''}
                      {...register('email')}
                    />
                  </div>
                  <p className="text-red-700 mb-0">{errors?.email?.message}</p>
                </div>
                <div className="select-dropdown">
                  <div
                    data-value=""
                    className={`select-dropdown__button ${
                      role ? 'active' : ''
                    } ${
                      getdata?.data?.inviteeUserData?.role_name !== '' ? '!bg-slate-300' : null
                    }`}
                    onClick={handlerole}
                  >
                    <span>{rolename !== '' ? rolename : 'Select role'}</span>
                    <Image src={downicon} className="i-chevron-down" alt="" />
                  </div>
                  {role && (
                    <ul className="select-dropdown__list active">
                      {
                        allroles?.length > 0
                          ? allroles?.map(
                              (item, i) => (
                                <li
                                  data-value="1"
                                  className="select-dropdown__list-item"
                                  key={i}
                                  onClick={() => handleul(item)}
                                >
                                  {item?.role}
                                </li>
                              )
                            )
                          : ''
                      }
                    </ul>
                  )}
                  <p className="text-red-700 mb-0">
                    {errors?.role_id?.message}
                  </p>
                </div>
                <div className="mb-4">
                  <div className="form-field optional !mb-0">
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="form-control"
                      {...register('phone')}
                    />
                  </div>
                  <p className="text-red-700 mb-0">{errors?.phone?.message}</p>
                </div>
                <div className="mb-4 relative">
                  <div className="form-field !mb-0 flex-1">
                    <input
                      type={openpassword ? 'text' : 'password'}
                      placeholder="Create Password"
                      className="form-control"
                      {...register('password')}
                    />
                    <span className="eye-hide-icon">
                      {openpassword ? (
                        <div
                          className="eye-open"
                          onClick={() => setopenpassword(false)}
                        >
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
                        <div
                          className="eye-close"
                          onClick={() => setopenpassword(true)}
                        >
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

                      {/* <Image src={eyeopenicon} alt="" /> */}
                    </span>
                  </div>
                  <p className="text-red-700 mb-0">
                    {errors?.password?.message}
                  </p>
                  <div className="absolute top-1/2 -right-[2.5rem] -translate-y-1/2">
                    <div
                      data-tooltip-id="create-password-info"
                      className={`w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem]`}
                    >
                      <Image src={info} alt="Info" className="w-full h-auto" />
                    </div>
                    <Tooltip id="create-password-info" place="right"
                     style={{ backgroundColor: "#125ecb", color: "#ffffff" }}
                    >
                      <ul className="menu">
                      <li className='mb-2'>Password should contain:</li>
                      <li className='mb-2'>At least 8 characters</li>
                      <li className='mb-2'>1 capital letter</li>
                      <li className='mb-2'>1 alphanumeric character</li>
                      </ul>
                    </Tooltip>
                  </div>
                </div>
                <div>
                  <div className="form-field !mb-0">
                    <input
                      type="text"
                      placeholder="Confirm Password"
                      className="form-control"
                      {...register('password_confirmation')}
                    />
                  </div>
                  <p className="text-red-700 mb-0">
                    {errors?.password_confirmation?.message}
                  </p>
                </div>

                {/* <div className='captcha-area'>
                    {isDirty && 
                        <ReCAPTCHA
                        sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                       onChange={onRecaptchaChange}
                       className="recaptcha-custom-design"
                          />
                    
                    }
              
                  </div> */}

                <div className="text-center mt-6 md:mt-12">
                  <button
                    type="submit"
                    // disabled={isRecaptcha===""}
                    className={`auth-page-btn ${
                      isRecaptcha === '' ? 'bg-slate-300' : null
                    }`}
                  >
                    Register Now
                  </button>
                </div>
                <DevTool control={control} />
              </form>
              <p className="auth-page-link">
                Already have an account? <Link href="/Signin">Login</Link>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="auth-page auth-page-bg p-top-padding p-end-padding">
          <div className="container">
            <div className="auth-page-wrap">
              <h2 className="auth-page-title">Registration</h2>
              <p className="auth-page-text">
                Welcome! Please Enter Your Deatils
              </p>
              <div>
                <Loader />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignupPasswordForm;
