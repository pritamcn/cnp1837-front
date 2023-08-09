'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import moment from 'moment';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { WithTokenGetApi } from '@/services/module/api/getapi';

import ActiveIcon from '../../../../../assets/images/dashboard/active-icon.svg';
import ConfirmedIcon from '../../../../../assets/images/dashboard/confirmed-icon.svg';
import PendingIcon from '../../../../../assets/images/dashboard/pending-icon.svg';
import PhysicianIcon from '../../../../../assets/images/dashboard/physician-icon.svg';
import CasesAndUpcomingDepositionsImg from '../../../../../assets/images/dashboard/cases-and-upcoming-depositions-img.png';
import ActiveMembershipSubscriptionCardBg from '../../../../../assets/images/dashboard/active-membership-subscription-card-bg.png';
import ExclusiveMonthlyRibbonBadge from '../../../../../assets/images/dashboard/exclusive-monthly-ribbon-badge.svg';
import RedPendingIcon from '../../../../../assets/images/dashboard/red-pending-icon.svg';
import CompletedIcon from '../../../../../assets/images/dashboard/completed-icon.svg';
import DashboardSearch from './DashboardSearch';

const Dashboard = () => {
  const axiosAuth = useAxiosAuth();
  const [searchParams, setSearchParams] = useState({
    startdate: '',
    enddate: '',
  });
  const [response, setResponse] = useState({});

  const {
    data: getdata,
    error,
    isLoading: getdataLoading,
    mutate,
  } = useSWR(
    [
      `/courtReporterDashboard?start_date=${searchParams?.startdate}&end_date=${searchParams?.enddate}`,
      axiosAuth,
    ],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (getdata?.status === 200) {
      setResponse(getdata?.data?.data);
    }
  }, [getdata]);

  const onSubmitHandler = (value) => {
    setSearchParams({ startdate: value.startdate, enddate: value?.enddate });
  };

  return (
    <>
      <div className="flex flex-row gap-[1.875rem] mb-[1.875rem]">
        <div className="basis-[27.375rem] bg-[#295189] rounded-[1.125rem] p-[1.875rem] relative min-h-[25.1875rem]">
          <h1 className="text-xl text-white font-semibold">Cases</h1>
          <div className="grid grid-cols-2 gap-[3.8125rem] border-b-[0.0625rem] border-dotted border-[#BDD2F1] py-4">
            <div className="flex items-start gap-4">
              <div className="w-10 flex-[0_0_2.5rem] flex items-center justify-center overflow-hidden">
                <Image
                  src={ActiveIcon}
                  alt="Active cases icon"
                  className="w-full h-auto"
                />
              </div>
              <div>
                <h1 className="text-[0.8125rem] font-normal text-[#E3ECF9] mb-[0.375rem]">
                  Active
                </h1>
                <div
                  className="tooltip"
                  data-tip={response?.getActiveCaseCount || 0}
                >
                  <h2 className="text-[2rem] font-bold text-[#F4F6F8] truncate max-w-[7.6875rem]">
                    {response?.getActiveCaseCount || 0}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-xl text-white font-semibold py-4">
            Upcoming Depositions
          </h1>
          <div className="grid grid-cols-2 gap-[3.8125rem]">
            <div className="flex items-start gap-4">
              <div className="w-10 flex-[0_0_2.5rem] flex items-center justify-center overflow-hidden">
                <Image
                  src={ConfirmedIcon}
                  alt="Confirmed icon"
                  className="w-full h-auto"
                />
              </div>
              <div>
                <h1 className="text-[0.8125rem] font-normal text-[#E3ECF9] mb-[0.375rem]">
                  Confirmed
                </h1>
                <div
                  className="tooltip"
                  data-tip={response?.getConfirmDepo || 0}
                >
                  <h2 className="text-[2rem] font-bold text-[#F4F6F8] truncate max-w-[7.6875rem]">
                    {response?.getConfirmDepo || 0}
                  </h2>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 flex-[0_0_2.5rem] flex items-center justify-center overflow-hidden">
                <Image
                  src={PendingIcon}
                  alt="Pending icon"
                  className="w-full h-auto"
                />
              </div>
              <div>
                <h1 className="text-[0.8125rem] font-normal text-[#E3ECF9] mb-[0.375rem]">
                  Pending
                </h1>
                <div
                  className="tooltip"
                  data-tip={response?.getPendingDepo || 0}
                >
                  <h2 className="text-[2rem] font-bold text-[#F4F6F8] truncate max-w-[7.6875rem]">
                    {response?.getPendingDepo || 0}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[8.125rem] flex items-center justify-center overflow-hidden absolute bottom-0 right-0">
            <Image
              src={CasesAndUpcomingDepositionsImg}
              alt="Cases and upcoming depositions img"
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="basis-[27.375rem] bg-white rounded-[1.125rem] p-6 relative min-h-[25.1875rem]">
          <div className="bg-[#FFFAF2] rounded-[1.125rem] p-5">
            <h1 className="text-xl font-semibold">Earning Details</h1>
            <DashboardSearch onSubmit={onSubmitHandler} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="max-w-[13.25rem]">
              <h1 className="text-[0.9375rem] font-medium mb-[0.625rem] mt-6">
                Depo Call Charges
              </h1>
              <div className="flex items-start gap-4 border-[0.0625rem] border-solid border-[#D3DAE4] rounded-lg p-[0.9375rem]">
                <div className="w-10 flex-[0_0_2.5rem] flex items-center justify-center overflow-hidden">
                  <Image
                    src={PhysicianIcon}
                    alt="Earned icon"
                    className="w-full h-auto"
                  />
                </div>
                <div>
                  <h1 className="text-[0.8125rem] font-normal text-[#8790AF] mb-[0.375rem]">
                    Earned
                  </h1>
                  <div
                    className="tooltip"
                    data-tip={`$${
                      response?.getCourtReporterEarnPayment?.length > 0
                        ? response?.getCourtReporterEarnPayment[0]?.totalAmount
                        : 0
                    }`}
                  >
                    <h2 className="text-[1.625rem] font-bold text-[#125ECB] truncate max-w-[9.3125rem]">
                      $
                      {response?.getCourtReporterEarnPayment?.length > 0
                        ? response?.getCourtReporterEarnPayment[0]?.totalAmount
                        : 0}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-[13.25rem]">
              <h1 className="text-[0.9375rem] font-medium mb-[0.625rem] mt-6">
                Transcription Charges
              </h1>
              <div className="flex items-start gap-4 border-[0.0625rem] border-solid border-[#D3DAE4] rounded-lg p-[0.9375rem]">
                <div className="w-10 flex-[0_0_2.5rem] flex items-center justify-center overflow-hidden">
                  <Image
                    src={PhysicianIcon}
                    alt="Earned icon"
                    className="w-full h-auto"
                  />
                </div>
                <div>
                  <h1 className="text-[0.8125rem] font-normal text-[#8790AF] mb-[0.375rem]">
                    Earned
                  </h1>
                  <div
                    className="tooltip"
                    data-tip={`$${
                      response?.getTranscriptCommision?.length > 0
                        ? response?.getTranscriptCommision[0]?.totalCommission
                        : 0
                    }`}
                  >
                    <h2 className="text-[1.625rem] font-bold text-[#125ECB] truncate max-w-[9.3125rem]">
                      $
                      {response?.getTranscriptCommision?.length > 0
                        ? response?.getTranscriptCommision[0]?.totalCommission
                        : 0}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[1.875rem]">
        <div>
          {response.getSubscriptionPkg && (
            <>
              <h1 className="text-xl font-semibold mb-[1.125rem]">
                Transcript Details
              </h1>
              <div className="bg-white rounded-[1.125rem] p-[2.875rem] min-h-[8.875rem]">
                <div className="flex -mx-[1.875rem]">
                  <div className="flex items-start gap-4 border-r-[0.0625rem] border-dotted border-[#BDD2F1] px-[1.875rem]">
                    <div className="w-10 flex-[0_0_2.5rem] flex items-center justify-center overflow-hidden">
                      <Image
                        src={CompletedIcon}
                        alt="Completed icon"
                        className="w-full h-auto"
                      />
                    </div>
                    <div>
                      <h1 className="text-[0.8125rem] font-normal text-[#8790AF] mb-[0.375rem]">
                        Completed
                      </h1>
                      <div className="tooltip" data-tip="2,000">
                        <h2 className="text-[1.625rem] font-bold truncate max-w-[9.3125rem]">
                          2,000
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 px-[1.875rem]">
                    <div className="w-10 flex-[0_0_2.5rem] flex items-center justify-center overflow-hidden">
                      <Image
                        src={RedPendingIcon}
                        alt="Pending icon"
                        className="w-full h-auto"
                      />
                    </div>
                    <div>
                      <h1 className="text-[0.8125rem] font-normal text-[#8790AF] mb-[0.375rem]">
                        Pending
                      </h1>
                      <div className="tooltip" data-tip="150">
                        <h2 className="text-[1.625rem] font-bold truncate max-w-[9.3125rem]">
                          150
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div>
          {response?.getSubscriptionPkg && (
            <>
              <h1 className="text-xl font-semibold mb-[1.125rem]">
                Subscription
              </h1>
              <div
                className="p-[1.375rem] rounded-xl relative w-[16rem] pt-[4.0625rem]"
                style={{
                  backgroundImage: `url(${ActiveMembershipSubscriptionCardBg.src})`,
                  backgroundSize: 'cover',
                }}
              >
                <div className="w-[13.9375rem] flex items-center text-white justify-center overflow-hidden absolute top-[0.75rem] left-0">
                  {(response?.getSubscriptionPkg &&
                    response?.getSubscriptionPkg?.membership_package?.name) ||
                    ''}{' '}
                  {`(${
                    response?.getSubscriptionPkg &&
                    parseInt(response?.getSubscriptionPkg?.is_monthly) === 0
                      ? 'Exclusive Monthly'
                      : 'Exclusive Yearly'
                  })`}
                </div>
                <div
                  className="tooltip"
                  data-tip={`${
                    response?.getSubscriptionPkg &&
                    parseInt(response?.getSubscriptionPkg?.is_monthly) === 0
                      ? response?.getSubscriptionPkg?.membership_package
                          ?.monthly_price
                      : response?.getSubscriptionPkg?.membership_package
                          ?.yearly_price
                  }`}
                >
                  <h2 className="text-[2rem] font-bold text-white mb-[1.125rem] truncate max-w-[14.0625rem]">
                    $
                    {response?.getSubscriptionPkg &&
                    parseInt(response?.getSubscriptionPkg?.is_monthly) === 0
                      ? response?.getSubscriptionPkg?.membership_package
                          ?.monthly_price
                      : response?.getSubscriptionPkg?.membership_package
                          ?.yearly_price}
                  </h2>
                </div>
                <h1 className="text-[0.8125rem] font-normal text-[#E3ECF9]">
                  Expiry Date:{' '}
                  <span className="text-[#F4F6F8]">
                    {response?.getSubscriptionPkg &&
                      moment(response?.getSubscriptionPkg?.exp_date).format(
                        'YYYY-MM-DD'
                      )}
                  </span>
                </h1>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
