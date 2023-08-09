import Footer from '@/components/module/common/client/Footer';
import Header from '@/components/module/common/client/Header';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Facebook from '../../../assets/images/social-icons/facebook-icon.svg';
import LinkedIn from '../../../assets/images/social-icons/linkedin-icon.svg';
import ArrowRight from '../../../assets/images/about/arrow-right.svg';
import FormImg from '../../../assets/images/contact/get-in-touch-with-us/form-bg.png';
import EmailIcon from '../../../assets/images/contact/get-in-touch-with-us/email-icon.svg';
import PhoneIcon from '../../../assets/images/contact/get-in-touch-with-us/phone-icon.svg';
import ContactClient from '@/components/module/visitor/contact/contact';
import { bannerFilePath, baseURL } from '@/config';
export async function getdata() {
  const res = await fetch(`${baseURL}/contact/getAllContactDetailContent`, {
    next: { revalidate: 1 },
  });
  const data = await res.json();
  return {
    data
  };
}
const Contact = async() => {
  const { data } = await getdata();
  return (
    <div className="App">
      <Header />
      <div className="home-main">
      <section className="hero-image-wrap relative">
            <div className="hero-image flex items-center justify-center text-center u-min-height--250 relative">
              <div className="absolute top-0 left-0 w-full flex-1 flex items-center justify-center overflow-hidden h-full">
                <Image
                  src={bannerFilePath + data?.data?.contact_detail_banner?.image}
                  alt="Mountains with snow"
                  layout="fill"
                  objectFit="cover"
                  className="!relative"
                />
              </div>
              <h1 className="absolute z-50 hero-title !mb-0">
                Contact
              </h1>
            </div>
          </section>

        <section className="c-what-we-do py-[5.3125rem]">
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
                <li className="px-[0.19rem]">Contact</li>
              </ul>
            </div>
            <div className="max-w-[48.25rem] mx-auto">
              <div
                className="p-[2.375rem] rounded-[0.875rem] text-left"
                style={{
                  backgroundImage: `url(${FormImg.src})`,
                }}
              >
                <h2 className="c-services-top-title !mb-[1.875rem]">
                  Get in Touch with Us
                </h2>
                <ContactClient />
              </div>
              <div className="text-left mt-[1.75rem]">
                <h2 className="c-services-top-title !mb-[0.375rem] !text-[1.625rem]">
                  Contact Details
                </h2>
                <p className="c-services-top-text">
                  Feel free to contact with us any time.
                </p>
                <div className="flex items-center mt-[1.0625rem]">
                  <div className="flex items-start gap-9">
                    <div className="flex items-start">
                      <div className="w-[1.375rem] flex-[0_0_1.375rem] flex items-center justify-center overflow-hidden mr-[0.875rem]">
                        <Image
                          src={EmailIcon}
                          alt="Email icon"
                          className="w-full h-auto"
                        />
                      </div>
                      <div>
                        <h1 className="text-[0.9375rem] font-medium pb-1">
                          Email
                        </h1>
                        <h2 className="text-[0.9375rem] font-normal text-[#686E80]">
                          {data?.data?.contact_detail_content[0]?.email}
                        </h2>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-[1.375rem] flex-[0_0_1.375rem] flex items-center justify-center overflow-hidden mr-[0.875rem]">
                        <Image
                          src={PhoneIcon}
                          alt="Phone icon"
                          className="w-full h-auto"
                        />
                      </div>
                      <div>
                        <h1 className="text-[0.9375rem] font-medium pb-1">
                          Phone
                        </h1>
                        <h2 className="text-[0.9375rem] font-normal text-[#686E80]">
                          {data?.data?.contact_detail_content[0]?.phone}
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div className="divider divider-horizontal w-[0.0625rem] before:w-[0.0625rem] before:bg-[#8790AF] after:w-[0.0625rem] after:bg-[#8790AF] mx-10"></div>
                  <div className="flex items-center">
                    <h1 className="text-xl font-medium pr-[0.9375rem]">
                      Follow Us On
                    </h1>
                    <ul className="list-none -mx-[0.375rem] flex items-center">
                      <li className="px-[0.375rem]">
                        <Link
                          title="Click to go to our facebook page"
                          href={`${data?.data?.contact_detail_content[0]?.fb_link}`} 
                          rel="noopener noreferrer" target="_blank"
                          className="w-7 h-7 flex items-center justify-center overflow-hidden"
                        >
                          <Image src={Facebook} alt="Facebook icon" />
                        </Link>
                      </li>
                      <li className="px-[0.375rem]">
                        <Link
                         href={`${data?.data?.contact_detail_content[0]?.linkedin_link}`} 
                         rel="noopener noreferrer" 
                         target="_blank"
                          title="Click to go to our twitter page"
                          className="w-7 h-7 flex items-center justify-center overflow-hidden"
                        >
                          <Image src={LinkedIn} alt="Linkedin icon" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
