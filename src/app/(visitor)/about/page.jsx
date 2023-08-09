import Footer from '@/components/module/common/client/Footer'
import Header from '@/components/module/common/client/Header'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Facebook from '../../../assets/images/social-icons/facebook-icon.svg';
import LinkedIn from '../../../assets/images/social-icons/linkedin-icon.svg';
import listicon from '../../../assets/images/icons/list-icon.svg';
import AboutHeroImage from '../../../assets/images/about/hero/hero-image.png';
import ArrowRight from '../../../assets/images/about/arrow-right.svg';
import IntroOurTalentedTeam from '../../../assets/images/about/intro-our-talented-team/intro-our-talented-team.jpg';
import JohnDoe from '../../../assets/images/about/our-team/john-doe.jpg';
import Miguelina from '../../../assets/images/about/our-team/miguelina.jpg';
import userimgplaceholder from '../../../assets/images/user-img-placeholder.png';
import RicardoJSimmons from '../../../assets/images/about/our-team/ricardo-j-simmons.jpg';
import GreatServices from '../../../assets/images/about/great-services/great-services.jpg';
import { bannerFilePath, baseURL, cmsFilePath  } from '@/config'
import { removeTags } from '@/helpers/mischelper'
import { renderMarkdownToHTML } from '@/components/module/common/remarkable-editor/rendermarkdowntohtml'
import { usePathname } from 'next/navigation'
// export async function getdata() {
//   const res = await fetch(`${baseURL}/getAllCmsList`, {
//     next: { revalidate: 100 },
//   });
//   const data = await res.json();
//   return {
//     data,
//   };
// }
export async function getdata() {
  const res = await fetch(`${baseURL}/about/getAllAboutContent`, {
    next: { revalidate: 1 },
  });
  const data = await res.json();
  return {
    data,
  };
}
const About = async() => {
  const { data } = await getdata();
  return (
    <div className="App">
    <Header/>
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
                About Page
              </h1>
            </div>
          </section>
      <section className="c-what-we-do py-10 lg:py-24">
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
                  About
              </li>
            </ul>
          </div>
          <div className="grid lg:grid-cols-2 items-center justify-items-center gap-[5.8rem]">
            <div className="c-what-we-do-left">
              <Image
                className="object-cover-img"
                src={data?.data?.about_page_content[1]?.image !==""? cmsFilePath + data?.data?.about_page_content[1]?.image:IntroOurTalentedTeam}
                alt="Intro our talented team"
                width={500}
                height={500}
              />
            </div>
            <div className="c-what-we-do-right">
              <h2 className="c-what-we-do-title">
                {data?.data?.about_page_content[1]?.name}
              </h2>
              <p className="c-what-we-do-text"
              dangerouslySetInnerHTML={renderMarkdownToHTML(data?.data?.about_page_content[1]?.description)}
              >
               
              </p>
              {data?.data?.about_page_content[1]?.button_url !=="" && data?.data?.about_page_content[1]?.button_name !=="" &&
              <Link 
              href={`${data?.data?.about_page_content[1]?.button_url}`} 
              rel="noopener noreferrer"
              className="primary-btn btn-outline">
              {data?.data?.about_page_content[1]?.button_name}
            </Link>
              }
              
            </div>
          </div>
        </div>
      </section>

      <section className="c-services py-10 lg:pt-24 lg:pb-6">
        <div className="container">
          <div className="c-services-top">
            <h2 className="c-services-top-title text-center">{data?.data?.about_page_content[0]?.name}</h2>
            <p className="c-services-top-text"   dangerouslySetInnerHTML={renderMarkdownToHTML(data?.data?.about_page_content[0]?.description)}>
             
            </p>
          </div>
          <ul className="list-none">
            {data?.data?.team_list?.map((item,i)=>(
               <li className="px-[7.1875rem] py-[3.125rem] border-b-[0.0625rem] border-solid border-[rgba(18,94,203,0.21)]"
               key={i}
               >
               <div className="grid grid-cols-[9.125rem_minmax(45.75rem,_1fr)] gap-10">
                 <div className="w-[9.125rem] h-[10.875rem] rounded-[0.625rem] overflow-hidden">
                   <Image
                     src={item?.image !==null?cmsFilePath+item?.image:userimgplaceholder}
                     alt="team image"
                     className="w-full h-auto"
                     width={500}
                     height={500}
                   />
                 </div>
                 <div className="text-left">
                   <h1 className="text-[1.625rem]">{item?.name}</h1>
                   <span className="text-[0.9375rem] font-normal text-[#8790AF] pt-3 inline-block">
                     {item?.position}
                   </span>
                   <p className="text-[0.9375rem] font-normal leading-6 text-[#686E80] py-5 mb-0"
                  dangerouslySetInnerHTML={renderMarkdownToHTML(item?.description)}
                   >
                     
                   </p>
                   <ul className="flex items-center gap-2.5">
                    {item?.fb_link !==null &&  
                     <li>
                       <Link 
                        href={`${item?.fb_link}`} 
                        rel="noopener noreferrer" target="_blank"
                       className="w-6 h-6 overflow-hidden cursor-pointer">
                         <Image
                           src={Facebook}
                           alt="Facebook icon"
                           className="w-full h-auto"
                         />
                       </Link>
                     </li>}
                    {item?.linkedin_link !==null && 
                       <li>
                       <Link 
                        href={`${item?.linkedin_link}`} 
                        rel="noopener noreferrer" target="_blank"
                       
                       className="w-6 h-6 overflow-hidden cursor-pointer">
                         <Image
                           src={LinkedIn}
                           alt="LinkedIn icon"
                           className="w-full h-auto"
                         />
                       </Link>
                     </li>
                    }
                  
                   </ul>
                 </div>
               </div>
             </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="c-what-we-do py-10 lg:py-24">
        <div className="container-lg">
          <div className="grid lg:grid-cols-2 items-center justify-items-center gap-[5.8rem]">
            <div className="order-2 lg:order-1 c-what-we-do-right">
              <h2 className="c-what-we-do-title">
                {data?.data?.about_page_content[2]?.name}
              </h2>
              <p className="c-what-we-do-text" 
               dangerouslySetInnerHTML={renderMarkdownToHTML(data?.data?.about_page_content[2]?.description)}
              >
              </p>
              {data?.data?.about_page_content[2]?.button_name !=="" && data?.data?.about_page_content[2]?.button_url !=="" &&
               <Link 
               href={`${data?.data?.about_page_content[2]?.button_url}`} 
              rel="noopener noreferrer"
               className="primary-btn">
               {data?.data?.about_page_content[2]?.button_name}
             </Link>
              }
              
            </div>
            <div className="order-1 lg:order-2 c-what-we-do-left">
              <Image className="object-cover-img" src={data?.data?.about_page_content[2]?.image !==""?
              cmsFilePath+data?.data?.about_page_content[2]?.image :GreatServices} 
              alt=""
              width={500}
              height={500}
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

export default About