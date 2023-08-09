import React from 'react';
import ArrowRight from '../../../assets/images/about/arrow-right.svg';
import Header from '@/components/module/common/client/Header';
import Footer from '@/components/module/common/client/Footer';
import Link from 'next/link';
import Image from 'next/image';
import ServicesHeroImage from '../../../assets/images/services/hero/hero-image.jpg';
import { bannerFilePath, baseURL } from '@/config';
import { renderMarkdownToHTML } from '@/components/module/common/remarkable-editor/rendermarkdowntohtml';
export async function getdata() {
  const res = await fetch(`${baseURL}/privacy/getAllPrivacyContent`, {
    next: { revalidate: 1 },
  });
  const data = await res.json();
  return {
    data
  };
}
const privacypolicy =async () => {
  const { data } = await getdata();
  return (
    <div className="App">
   <Header />
    <div className="home-main">
    <section className="hero-image-wrap relative">
            <div className="hero-image flex items-center justify-center text-center u-min-height--250 relative">
              <div className="absolute top-0 left-0 w-full flex-1 flex items-center justify-center overflow-hidden h-full">
                <Image
                  src={bannerFilePath + data?.data?.privacy_banner?.image}
                  alt="Mountains with snow"
                  layout="fill"
                  objectFit="cover"
                  className="!relative"
                />
              </div>
              <h1 className="absolute z-50 hero-title !mb-0">
                privacy policy
              </h1>
            </div>
          </section>
      <section className="c-what-we-do pt-[8.3125rem] pb-[5.875rem] relative">
        <div className="container">
          <div className="grid grid-cols-1 absolute top-24">
            <ul className="list-none flex items-center -mx-[0.19rem] text-[0.8125rem] font-normal">
              <li className="px-[0.19rem]">
                <Link href="/" className="text-[#125ECB] hover:text-[#125ECB]">
                  Home
                </Link>
              </li>
              <li className="px-[0.19rem]">
                <Image src={ArrowRight} alt="Arrow right icon" />
              </li>
              <li className="px-[0.19rem]">
                Privacy Policy
              </li>
            </ul>
          </div>
          <div className="text-left">
            <h1 className="text-[2rem] font-semibold mb-5">{data?.data?.privacy_content[0]?.name}</h1>
            <p className="mb-10" 
            dangerouslySetInnerHTML={renderMarkdownToHTML(data?.data?.privacy_content[0]?.description)}
            >
        
            </p>
           
          </div>
        </div>
      </section>
    </div>
     <Footer/>
  </div>
  )
}

export default privacypolicy