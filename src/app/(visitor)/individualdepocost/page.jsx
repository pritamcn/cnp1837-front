import Footer from '@/components/module/common/client/Footer';
import Header from '@/components/module/common/client/Header';
import React from 'react';
import HeroImage from '../../../assets/images/individual-depo-cost/hero/hero-image.png';
import ArrowRight from '../../../assets/images/about/arrow-right.svg';
import listicon from '../../../assets/images/icons/list-icon.svg';
import Link from 'next/link';
import Image from 'next/image';
import { bannerFilePath, baseURL } from '@/config';
import { renderMarkdownToHTML } from '@/components/module/common/remarkable-editor/rendermarkdowntohtml';

export async function getdata() {
  const res = await fetch(`${baseURL}/depo/getAllIndividualDepoContent`, {
    next: { revalidate: 100 },
  });
  const data = await res.json();
  return {
    data,
  };
}
const Individualdepocost = async () => {
  const { data } = await getdata();
  return (
    <div className="App">
      <Header />
      <div className="home-main">
      <section className="hero-image-wrap relative">
            <div className="hero-image flex items-center justify-center text-center u-min-height--250 relative">
              <div className="absolute top-0 left-0 w-full flex-1 flex items-center justify-center overflow-hidden h-full">
                <Image
                  src={bannerFilePath + data?.data?.individual_depo_banner?.image}
                  alt="Mountains with snow"
                  layout="fill"
                  objectFit="cover"
                  className="!relative"
                />
              </div>
              <h1 className="absolute z-50 hero-title !mb-0">
                Individual depo call
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
                <li className="px-[0.19rem]">Individual depo call</li>
              </ul>
            </div>
            <div className="c-services-top text-center">
              <h2 className="c-services-top-title">{data?.data?.individual_depo_content[0]?.name}</h2>
              <p className="c-services-top-text" 
              dangerouslySetInnerHTML={renderMarkdownToHTML(data?.data?.individual_depo_content[0]?.description)}
              >
              </p>
            </div>
            <div className="grid grid-cols-2 gap-[1.875rem]">
              <label
                for="audio-video-file"
                className="rounded-[0.875rem] bg-[#E3E3E3] p-10 min-h-[35.9375rem] hover:bg-white hover:shadow-[0_7px_24px_0_rgba(0,0,80,0.1)] hover:cursor-pointer relative text-left"
              >
                <h1 className="text-[1.625rem] font-medium">
                  One Call + Recorded <br /> Audio File
                </h1>
                <h2 className="text-[3.125rem] font-bold py-[1.875rem]">
                  ${data?.data?.audio_single_call_details?.price}
                </h2>
                <ul className="c-list !-my-[0.8125rem] pb-[1.875rem] border-b-[0.0625rem] border-solid border-[#E3E3E3]">
                  {data?.data?.audio_single_call_details?.description
                    .split('<p>')
                    .map((str, i) => (
                      <>
                        {str !== '' && (
                          <li className="!py-[0.8125rem]" key={i}>
                            <Image src={listicon} alt="" />{' '}
                            <span>{str.substring(0, str.length - 4)}</span>{' '}
                          </li>
                        )}
                      </>
                    ))}
                </ul>
              </label>

              <label
                for="audio-file"
                className="rounded-[0.875rem] bg-[#E3E3E3] p-10 min-h-[35.9375rem] hover:bg-white hover:shadow-[0_7px_24px_0_rgba(0,0,80,0.1)] hover:cursor-pointer relative text-left"
              >
                <h1 className="text-[1.625rem] font-medium">
                  One Call + Recorded <br /> Video File
                </h1>
                <h2 className="text-[3.125rem] font-bold py-[1.875rem]">
                  ${data.data.video_single_call_details?.price}
                </h2>
                <ul className="c-list !-my-[0.8125rem] pb-[1.875rem] border-b-[0.0625rem] border-solid border-[#E3E3E3]">
                  {data?.data?.video_single_call_details?.description
                    .split('<p>')
                    .map((str, i) => (
                      <>
                        {str !== '' && (
                          <li className="!py-[0.8125rem]" key={i}>
                            <Image src={listicon} alt="" />{' '}
                            <span>{str.substring(0, str.length - 4)}</span>{' '}
                          </li>
                        )}
                      </>
                    ))}
                </ul>
              </label>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Individualdepocost;
