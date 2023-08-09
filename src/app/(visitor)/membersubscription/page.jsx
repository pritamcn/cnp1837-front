import Footer from '@/components/module/common/client/Footer';
import Header from '@/components/module/common/client/Header';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ArrowRight from '../../../assets/images/about/arrow-right.svg';
import MembershipSubscriptionHeroImage from '../../../assets/images/membership-subscription/hero/hero-image.png';
import { bannerFilePath, baseURL } from '@/config';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import check from '../../../assets/images/icons/list-icon.svg';
import { removeTags } from '@/helpers/mischelper';
import { renderMarkdownToHTML } from '@/components/module/common/remarkable-editor/rendermarkdowntohtml';

export async function getdata() {
  const res = await fetch(`${baseURL}/about/getAllMemberShipContent`, {
    next: { revalidate: 1 },
  });
  const data = await res.json();
  return {
    data,
  };
}
const MemberSubscription = async () => {
  const value = await getServerSession(authOptions);
  if (value !== null) {
    redirect('/Success');
  } else {
    const { data } = await getdata();
    return (
      <div className="App">
        <Header />
        <div className="home-main">
          <section className="hero-image-wrap relative">
            <div className="hero-image flex items-center justify-center text-center u-min-height--250 relative">
              <div className="absolute top-0 left-0 w-full flex-1 flex items-center justify-center overflow-hidden h-full">
                <Image
                  src={bannerFilePath + data?.data?.home_banner?.image}
                  alt="Mountains with snow"
                  layout="fill"
                  objectFit="cover"
                  className="!relative"
                />
              </div>
              <h1 className="absolute z-50 hero-title !mb-0">
                Membership Subscription
              </h1>
            </div>
          </section>
          

          <section className="c-what-we-do py-10 lg:pt-24 lg:pb-6">
            <div className="container-lg">
              <div className="grid grid-cols-1 relative bottom-[4.1875rem]">
                <ul className="list-none flex items-center -mx-[0.19rem] text-[0.8125rem] font-normal">
                  <li className="px-[0.19rem]">
                    <Link
                      href="/"
                      className="text-[#125ECB] hover:text-[#125ECB]"
                    >
                      Home
                    </Link>
                  </li>
                  <li className="px-[0.19rem]">
                    <Image src={ArrowRight} alt="Arrow right icon" />
                  </li>
                  <li className="px-[0.19rem] text-[#8790AF] ">
                    Membership Subscription
                  </li>
                </ul>
              </div>
              <div className="c-services-top text-center">
                <h2 className="c-services-top-title">
                  {data?.data?.about_page_content[0]?.name}
                </h2>
                <p className="c-services-top-text" 
                dangerouslySetInnerHTML={renderMarkdownToHTML(data?.data?.about_page_content[0]?.description)}
                >
                </p>
              </div>
              <div className="max-w-[66.8125rem] p-[3.125rem] rounded-[1.25rem] bg-white shadow-[0_5px_27px_0_rgba(57,69,85,0.09)] mx-auto mt-16 relative min-h-[30.3125rem]">
                <h3 className="absolute top-1/2 -translate-y-1/2 max-w-[calc(100%-54.5625rem)] text-center">
                  Attorney package plan
                </h3>
                <div className="grid grid-cols-3 gap-[1.625rem] absolute w-full -top-[0.875rem] right-[1.6875rem] max-w-[49.125rem]">
                  {data?.data?.attorney_subscription_details?.map((item, i) => (
                    <div
                      className="c-card c-card--membership-subscription p-6 rounded-xl flex items-center justify-center flex-col transition group min-h-[24.5625rem] border border-solid border-primary"
                      key={i}
                    >
                      <div className="flex-1 text-center">
                        <h1 className="text-xl font-normal group-hover:text-white mt-5">
                          {item?.name}
                        </h1>
                        <div className="flex items-center justify-center gap-2">
                          <h2 className="text-[1.75rem] font-bold py-6 group-hover:text-white">
                            ${item?.monthly_price}
                            <span className="text-[0.9375rem] font-normal text-[#686E80] group-hover:text-white">
                              /month
                            </span>
                          </h2>
                          <h2 className="text-[1.75rem] font-bold py-6 group-hover:text-white">
                            <span className="text-[1.875rem] font-black text-[#686E80] group-hover:text-white">
                              /
                            </span>
                          </h2>
                          <h2 className="text-[1.75rem] font-bold py-6 group-hover:text-white">
                            ${item?.yearly_price}
                            <span className="text-[0.9375rem] font-normal text-[#686E80] group-hover:text-white">
                              /year
                            </span>
                          </h2>
                        </div>
                        <ul className="c-list !-my-[0.8125rem] pb-[1.875rem] border-b-[0.0625rem] border-solid border-[#E3E3E3]">
                          <li className="!py-[0.8125rem] group-hover:text-white">
                            <Image src={check} alt="Check" />
                            <span>
                              Total call monthly: {item?.tot_call_monthly}
                            </span>
                          </li>
                          <li className="!py-[0.8125rem] group-hover:text-white">
                            <Image src={check} alt="Check" />
                            <span>
                              Total call yearly: {item?.tot_call_yearly}
                            </span>
                          </li>
                          <li className="!py-[0.8125rem] group-hover:text-white">
                            <Image src={check} alt="Check" />
                            <span>
                              Total download monthly:{' '}
                              {item?.tot_download_monthly}
                            </span>
                          </li>
                          <li className="!py-[0.8125rem] group-hover:text-white">
                            <Image src={check} alt="Check" />
                            <span>
                              Total download yearly: {item?.tot_download_yearly}
                            </span>
                          </li>
                        </ul>
                        <Link
                          className="primary-btn w-full group-hover:text-[#001725] group-hover:bg-white mb-2"
                          href="/Signin"
                        >
                          Choose Plan
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="max-w-[66.8125rem] p-[3.125rem] rounded-[1.25rem] bg-white shadow-[0_5px_27px_0_rgba(57,69,85,0.09)] mx-auto mt-16 relative min-h-[24.3125rem]">
                <h3 className="absolute top-1/2 -translate-y-1/2 max-w-[calc(100%-54.5625rem)] text-center">
                  Physician package plan
                </h3>
                <div className="grid grid-cols-3 gap-[1.625rem] absolute w-full -top-[0.875rem] right-[1.6875rem] max-w-[49.125rem]">
                  {data?.data?.physician_subscription_details?.map(
                    (item, i) => (
                      <div
                        className="c-card c-card--membership-subscription p-6 rounded-xl flex items-center justify-center flex-col transition group min-h-[24.5625rem] border border-solid border-primary"
                        key={i}
                      >
                        <div className="flex-1 text-center">
                          <h1 className="text-xl font-normal group-hover:text-white mt-5">
                            {item?.name}
                          </h1>
                          <div className="flex items-center justify-center gap-2">
                            <h2 className="text-[1.75rem] font-bold py-6 group-hover:text-white">
                              ${item?.monthly_price}
                              <span className="text-[0.9375rem] font-normal text-[#686E80] group-hover:text-white">
                                /month
                              </span>
                            </h2>
                            <h2 className="text-[1.75rem] font-bold py-6 group-hover:text-white">
                              <span className="text-[1.875rem] font-black text-[#686E80] group-hover:text-white">
                                /
                              </span>
                            </h2>
                            <h2 className="text-[1.75rem] font-bold py-6 group-hover:text-white">
                              ${item?.yearly_price}
                              <span className="text-[0.9375rem] font-normal text-[#686E80] group-hover:text-white">
                                /year
                              </span>
                            </h2>
                          </div>
                          <Link
                            className="primary-btn w-full group-hover:text-[#001725] group-hover:bg-white mb-2"
                            href="/Signin"
                          >
                            Choose Plan
                          </Link>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="max-w-[66.8125rem] p-[3.125rem] rounded-[1.25rem] bg-white shadow-[0_5px_27px_0_rgba(57,69,85,0.09)] mx-auto mt-16 relative min-h-[24.3125rem]">
                <h3 className="absolute top-1/2 -translate-y-1/2 max-w-[calc(100%-54.5625rem)] text-center">
                  Court reporter package plan
                </h3>
                <div className="grid grid-cols-3 gap-[1.625rem] absolute w-full -top-[0.875rem] right-[1.6875rem] max-w-[49.125rem]">
                  {data?.data?.court_reporter_subscription_details?.map(
                    (item, i) => (
                      <div
                        className="c-card c-card--membership-subscription p-6 rounded-xl flex items-center justify-center flex-col transition group min-h-[24.5625rem] border border-solid border-primary"
                        key={i}
                      >
                        <div className="flex-1 text-center">
                          <h1 className="text-xl font-normal group-hover:text-white mt-5">
                            {item?.name}
                          </h1>
                          <div className="flex items-center justify-center gap-2">
                            <h2 className="text-[1.75rem] font-bold py-6 group-hover:text-white">
                              ${item?.monthly_price}
                              <span className="text-[0.9375rem] font-normal text-[#686E80] group-hover:text-white">
                                /month
                              </span>
                            </h2>
                            <h2 className="text-[1.75rem] font-bold py-6 group-hover:text-white">
                              <span className="text-[1.875rem] font-black text-[#686E80] group-hover:text-white">
                                /
                              </span>
                            </h2>
                            <h2 className="text-[1.75rem] font-bold py-6 group-hover:text-white">
                              ${item?.yearly_price}
                              <span className="text-[0.9375rem] font-normal text-[#686E80] group-hover:text-white">
                                /year
                              </span>
                            </h2>
                          </div>
                          <Link
                            className="primary-btn w-full group-hover:text-[#001725] group-hover:bg-white mb-2"
                            href="/Signin"
                          >
                            Choose Plan
                          </Link>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    );
  }
};

export default MemberSubscription;
