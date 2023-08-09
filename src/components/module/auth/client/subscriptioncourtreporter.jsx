'use client';
import React, { useEffect, useState } from 'react'
import MostPopularRibbonBadge from '../../../../assets/images/membership-subscription/choose-your-plan/most-popular-ribbon-badge.svg';
import PlanHoverBg from '../../../../assets/images/membership-subscription/choose-your-plan/plan-hover-bg.jpg';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import Paymentmodal from '../../user/lawfirm/Modal/Paymentmodal';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import { redirect } from 'next/navigation';

const SubscriptionCourtReporter = () => {

    const { data: session, update } = useSession();
    const axiosAuth = useAxiosAuth();

    const [paymentmodalopen, setpaymentmodalopen] = useState(false);

    const {
        data: getdata,
        error,
        isLoading,
    } = useSWR(
        ['/getPackagePlanList', axiosAuth],
        ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
        {
            revalidateOnFocus: false,
        }
    );

    useEffect(() => {
        if (session?.user?.subscription === "true") {
            redirect("/CourtReporter/dashboard")
        }
    }, [session]);

    async function updateSession() {
        // if (session) session.user.accessToken = "dddd";
        await update({
            ...session,
            user: {
                ...session?.user,
                subscription: 'true',
            },
        });
    }

    const [subscription, setsubscription] = useState({
        membership_package_id: '',
        userId: '',
        monthly: false,
        payement_method: '',
        other_details: {},
    });

    const handlechange = (item, type) => {
        setsubscription({
            ...subscription,
            userId: session?.user?.id,
            membership_package_id: item?.id,
            other_details: { ...item },
            monthly: type === 'month',
        });
        setpaymentmodalopen(true);
    };

    const handlemodal = (type) => {
        setpaymentmodalopen(false);
        setsubscription({
            membership_package_id: '',
            userId: '',
            monthly: false,
            payement_method: '',
            other_details: {},
        });
        if (type === 'success') {
            updateSession();
        }
    };

    return (
        <div className="home-main">
            <section className="c-what-we-do py-10 lg:pt-24 lg:pb-6">
                <div className="container-lg">
                    <div className="c-services-top text-center">
                        <h2 className="c-services-top-title">Choose Your Plan</h2>
                        <p className="c-services-top-text">
                            You will get 1 month free trial for choosing every subscription
                        </p>
                    </div>
                    <div className="max-w-[66.8125rem] p-[3.125rem] rounded-[1.25rem] bg-white shadow-[0_5px_27px_0_rgba(57,69,85,0.09)] mx-auto mt-16 relative min-h-[54.3125rem]">
                        <div className="flex item-center justify-center absolute w-full -top-[0.875rem] left-0">
                            {getdata?.data?.basic_details?.map((item, i) => item?.id === 1 && (
                                <div
                                    className="c-card flex-[0_0_19.375rem] c-card--membership-subscription c-card--membership-subscription-active p-6 
                 rounded-xl flex items-center justify-center flex-col 
                 transition group min-h-[24.5625rem]"
                                    key={i}
                                    style={{
                                        backgroundImage: `${i == 0 ? `url(${PlanHoverBg.src})` : null
                                            }`,
                                        backgroundSize: `${i == 0 ? 'cover' : null}`,
                                        position: `${i === 0 ? 'relative' : null}`,
                                    }}
                                >
                                    <div className="flex-1 text-center">
                                        <h1
                                            className={`text-xl font-normal ${i === 0 ? 'text-white' : 'group-hover:text-white'
                                                }  mt-5`}
                                        >
                                            {item?.name}
                                        </h1>
                                        <h2
                                            className={`text-[2.5rem] font-bold py-6 ${i === 0 ? 'text-white' : 'group-hover:text-white'
                                                }`}
                                        >
                                            ${item?.monthly_price}
                                            <span
                                                className={`text-[0.9375rem] font-normal text-[#686E80] ${i === 0 ? 'text-white' : 'group-hover:text-white'
                                                    }`}
                                            >
                                                /month
                                            </span>
                                        </h2>
                                    </div>
                                    <div className='w-full'>
                                        <label
                                            htmlFor="payment"
                                            className={`primary-btn w-full mb-3 !bg-white !text-[#001725]
                                                group-hover:text-[#001725] group-hover:bg-white
                                                `}
                                            onClick={() => handlechange(item, 'month')}
                                        >
                                            Choose Plan
                                        </label>
                                    </div>
                                    <div
                                        className={`divider after:w-[0.0625rem] my-0 group-hover:before:bg-white group-hover:after:bg-white ${i === 0
                                            ? 'before:bg-white after:bg-white'
                                            : 'before:bg-[#8790AF] after:bg-[#8790AF]'
                                            }`}
                                    ></div>
                                    <div className="flex-1 text-center">
                                        <h2
                                            className={`text-[2.5rem] font-bold py-6 text-white group-hover:text-white`}
                                        >
                                            ${item?.yearly_price}
                                            <span
                                                className={`text-[0.9375rem] font-normal text-[#686E80] ${i === 0 ? 'text-white' : 'group-hover:text-white'
                                                    }`}
                                            >
                                                /year
                                            </span>
                                        </h2>
                                    </div>
                                    <label
                                        htmlFor="payment"
                                        className={`primary-btn w-full mb-3 ${i === 0
                                            ? '!bg-white !text-[#001725]'
                                            : 'group-hover:text-[#001725] group-hover:bg-white'
                                            }`}
                                        onClick={() => handlechange(item, 'year')}
                                    >
                                        Choose Plan
                                    </label>
                                    
                                </div>
                            ))}
                        </div>
                        <table className="w-full mt-[28.9375rem] table-auto">
                            <tbody>
                                {getdata?.data?.table_details?.map((item, i) => (
                                    <tr
                                        className="bg-[#F4F6F8] rounded-lg overflow-hidden flex items-center"
                                        key={i}
                                    >
                                        <td className="w-[14.5rem] p-[1.875rem] text-left">
                                            {item?.description}
                                        </td>
                                        <td className="w-[15.3125rem] p-[1.875rem]">
                                            <div className="w-[1.0625rem]  mx-auto">
                                                0
                                            </div>
                                        </td>
                                        <td className="w-[15.3125rem] p-[1.875rem]">
                                            <div className="w-[1.0625rem]  mx-auto">
                                                0
                                            </div>
                                        </td>
                                        <td className="w-[15.3125rem] p-[1.875rem]">
                                            <div className="w-[1.0625rem]  mx-auto">
                                                0
                                            </div>
                                        </td>
                                 
                                    </tr>
                                ))}
                                {paymentmodalopen && (
                                    <Paymentmodal
                                        subscriptiondetails={subscription}
                                        handlemodal={handlemodal}
                                    />
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default SubscriptionCourtReporter;