import React, { useEffect } from 'react';
import { WithTokenPostApi } from '@/services/module/api/postapi';
import { UpdateWithTokenapi } from '@/services/module/api/putapi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import { z } from 'zod';
import { toast } from 'react-toastify';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';

const CreateUser = ({ userData, closeModal }) => {
    const axiosAuth = useAxiosAuth();
    useEffect(() => {
        setValue('id', userData.id + '');
        setValue('first_name', userData.first_name);
        setValue('last_name', userData.last_name);
        setValue('email', userData.email);
        setValue('password', userData.password);
    }, [userData]);

    const {
        trigger: createtrigger,
        data: createdata,
        error: createerror,
    } = useSWRMutation(`/user/addUser`, WithTokenPostApi);

    const schema = z
        .object({
            id: z.string().optional(),
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
            password: z.union([
                z
                    .string()
                    .min(8, { message: 'Password must be greater than 8 digits' })
                    .max(10, { message: 'Password must be less than 10 digits', }),
                z.string().length(0),
            ]).optional(),
            // password_confirmation: z
            //     .string()
            //     .min(8, { message: 'Confirm password must be greater than 8 digits' })
            //     .max(10, {
            //         message: 'Confirm password must be less than 10 digits',
            //     }),
        })
        .superRefine((data, ctx) => {
            if (data.id === '' && data.password === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['password'],
                    message: `Enter valid password`,
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
            id: ''
        },
    });

    const { errors, isDirty } = formState;

    const {
        trigger: updatetrigger,
        data: updatedata,
        error: updateerror,
    } = useSWRMutation(`user/updateUser/${getValues('id')}`, UpdateWithTokenapi);

    const onSubmit = (data) => {
        if (data?.id === '') {
            let payload = {
                "first_name": data?.first_name,
                "last_name": data?.last_name,
                "email": data?.email,
                "password": data?.password
            }
            createtrigger({ payload, axios: axiosAuth });
        } else {
            let payload = {
                "first_name": data?.first_name,
                "last_name": data?.last_name,
                "email": data?.email,
            }
            updatetrigger({ data: payload, axios: axiosAuth });
        }
    };

    useEffect(() => {
        if (createdata?.status === 200) {
            toast.success(createdata?.data?.message);
            reset();
            closeModal();
        }

        if (createdata === undefined && createerror?.response?.status === 409) {
            toast.error(createerror?.response?.data?.message);
        }
    }, [createdata, createerror]);

    useEffect(() => {
        if (updatedata?.status === 200) {
            toast.success(updatedata?.data?.message);
            reset();
            closeModal();
        }

        if (updatedata === undefined && updateerror?.response?.status === 409) {
            toast.error(updateerror?.response?.data?.message);
        }

    }, [updatedata, updateerror]);

    return (
        <div className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <label htmlFor="create-user" onClick={closeModal} className="modal-close-btn">✕</label>
                <h3 className="modal-title">{watch('id') === '' ? 'Create' : 'Update'} User</h3>
                <form
                    className="auth-page-form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <div className='modal-body'>
                        <div className='form-area flex -mx-2 flex-wrap'>
                            <div className='w-full px-2'>
                                <div className="form-field">
                                    <input type="text" placeholder="First Name" className="form-control"
                                        {...register('first_name')} />
                                </div>
                                <p className="text-red-700 mb-0">
                                    {errors?.first_name?.message}
                                </p>
                            </div>
                            <div className='w-full px-2'>
                                <div className="form-field">
                                    <input type="text" placeholder="Last Name" className="form-control"
                                        {...register('last_name')} />
                                </div>
                                <p className="text-red-700 mb-0">
                                    {errors?.last_name?.message}
                                </p>
                            </div>
                            <div className='w-full px-2'>
                                <div className="form-field">
                                    <input type="email" placeholder="Email ID" className="form-control"
                                        {...register('email')} />
                                </div>
                                <p className="text-red-700 mb-0">
                                    {errors?.email?.message}
                                </p>
                            </div>
                            {watch('id') === '' &&
                                <div className='w-full px-2'>
                                    <div className="form-field">
                                        <input type="password" placeholder="Password" className="form-control"
                                            {...register('password')} />
                                    </div>
                                    <p className="text-red-700 mb-0">
                                        {errors?.password?.message}
                                    </p>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="modal-action">
                        <div className='flex flex-wrap justify-center w-full'>
                            <button type="submit" disabled={!isDirty}
                                className={`primary-btn ml-2.5 ${!isDirty ? 'disable' : ''}`}>{watch('id') === '' ? 'Create' : 'Update'}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateUser;