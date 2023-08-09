import Footer from '@/components/module/common/client/Footer';
import Header from '@/components/module/common/client/Header';
import Link from 'next/link';
import React from 'react';
import ArrowRight from '../../../assets/images/about/arrow-right.svg';
import Service1 from '../../../assets/images/services/services-we-provide/service-1.jpg';
import Image from 'next/image';
import { bannerFilePath, baseURL,  cmsFilePath,  serviceFilePath } from '@/config';
import { renderMarkdownToHTML } from '@/components/module/common/remarkable-editor/rendermarkdowntohtml';
export async function getdata() {
  const res = await fetch(`${baseURL}/service/getAllServiceContent`,{ next: { revalidate: 1 } });
    const data = await res.json();
    return {
      data,
    };
}
const Services = async() => {
  const {data}=await getdata()
  return (
    <div className="App">
     <Header />
    <div className="home-main">
    <section className="hero-image-wrap relative">
            <div className="hero-image flex items-center justify-center text-center u-min-height--250 relative">
              <div className="absolute top-0 left-0 w-full flex-1 flex items-center justify-center overflow-hidden h-full">
                <Image
                  src={bannerFilePath + data?.data?.service_banner?.image}
                  alt="Mountains with snow"
                  layout="fill"
                  objectFit="cover"
                  className="!relative"
                />
              </div>
              <h1 className="absolute z-50 hero-title !mb-0">
                Services
              </h1>
            </div>
          </section>

      <section className="c-what-we-do py-10 lg:pt-24 lg:pb-6">
        <div className="container-lg">
          <div className="grid grid-cols-1 relative bottom-[4.1875rem]">
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
                Service
              </li>
            </ul>
          </div>
          <div className="c-services-top">
            <h2 className="c-services-top-title text-center">{data?.data?.service_content[0]?.name}</h2>
            <p className="c-services-top-text" 
            dangerouslySetInnerHTML={renderMarkdownToHTML(data?.data?.service_content[0]?.description)}
            >
            </p>

          </div>
          <div className="c-services-grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3rem]">
              {data?.data?.services?.map((item,i)=>(
                  <div className="flex flex-col items-start justify-start" key={i}>
                  <div className="c-services-img">
                    <Image
                      className="object-cover-img"
                      src={item?.image !==''? serviceFilePath+item?.image:Service1}
                      alt="Service"
                      width={500}
                      height={500}
                    />
                  </div>
                  <h4 className="c-services-title">{item?.name}</h4>
                  <p className="c-services-text" 
                  dangerouslySetInnerHTML={renderMarkdownToHTML(item?.description)}
                  >
                   
                  </p>
                </div>
              ))}
            
            </div>
          </div>
        </div>
      </section>

      <section className="c-what-we-do py-10 lg:py-24">
        <div className="container-lg">
          <div className="grid lg:grid-cols-2 items-center justify-items-center gap-[5.8rem]">
            <div className="c-what-we-do-left">
              <Image
                className="object-cover-img"
                src={cmsFilePath + data?.data?.service_content[1]?.image}
                width={500}
                height={500}
                alt="Intro our talented team"
              />
            </div>
            <div className="c-what-we-do-right">
              <h2 className="c-what-we-do-title">{data?.data?.service_content[1]?.name}</h2>
              <p className="c-what-we-do-text" 
                dangerouslySetInnerHTML={renderMarkdownToHTML(data?.data?.service_content[1]?.description)}
              >
                
              </p>
              {data?.data?.service_content[1]?.button_name !=="" && data?.data?.service_content[1]?.button_url !=="" 
              && 
              <Link 
              href={`${data?.data?.service_content[1]?.button_url}`} 
              rel="noopener noreferrer" className="primary-btn btn-outline">
              {data?.data?.service_content[1]?.button_name}
            </Link>
              }
             
            </div>
          </div>
        </div>
      </section>

      <section className="c-services py-10 lg:py-24">
        <div className="container-lg">
          <div className="grid lg:grid-cols-2 items-center justify-items-center gap-[5.8rem]">
            <div className="order-2 lg:order-1 c-what-we-do-right">
              <h2 className="c-what-we-do-title">{data?.data?.service_content[2]?.name}</h2>
              <p className="c-what-we-do-text" 
              dangerouslySetInnerHTML={renderMarkdownToHTML(data?.data?.service_content[2]?.description)}
              >
              </p>
              {data?.data?.service_content[2]?.button_name !=="" && data?.data?.service_content[2]?.button_url !=="" 
              && 
              <Link 
              href={`${data?.data?.service_content[2]?.button_url}`} 
              rel="noopener noreferrer" className="primary-btn btn-outline">
              {data?.data?.service_content[2]?.button_name}
            </Link>
              }
            </div>
            <div className="order-1 lg:order-2 c-what-we-do-left">
            <Image
                className="object-cover-img"
                src={cmsFilePath + data?.data?.service_content[2]?.image}
                width={500}
                height={500}
                alt="touch with us"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
    <Footer/>
  </div>
  )
}

export default Services