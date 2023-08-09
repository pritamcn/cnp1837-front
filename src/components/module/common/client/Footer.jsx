import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import footerlogo from './../../../../assets/images/footer-logo.png';
import facebookicon from './../../../../assets/images/social-icons/facebook-icon.svg';
import linkedinicon from './../../../../assets/images/social-icons/linkedin-icon.svg';
import phoneicon from './../../../../assets/images/icons/phone-icon.svg';
import mailicon from './../../../../assets/images/icons/mail-icon.svg';
import mapicon from './../../../../assets/images/icons/map-icon.svg';
import { baseURL } from '@/config';
export async function getdata() {
  const res = await fetch(`${baseURL}/contact/getAllContactDetailContent`, {
    next: { revalidate: 1 },
  });
  const data = await res.json();
  return {
    data
  };
}
const Footer = async() => {
  const { data } = await getdata();
  return (
    <footer className='c-footer'>
    <div className="container">
      <div className="c-footer-top grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 md:gap-8 gap-4">
        <div className="c-footer-top-left">
          <div className="flex lg:flex-1">
            <Link href="/" className='c-footer-logo'>
              <Image src={footerlogo} alt="" />
            </Link>
          </div>
          <h2 className="c-footer-title">Join the Community</h2>
          <div className="flex items-center gap-x-2">
            <Link href={`${data?.data?.contact_detail_content[0]?.fb_link}`} rel="noopener noreferrer" target="_blank" className="w-6 h-6 cursor-pointer hover:bg-gray-700 rounded-full flex items-center justify-center">
              <Image src={facebookicon} alt="" />
            </Link>
            <Link href={`${data?.data?.contact_detail_content[0]?.linkedin_link}`} rel="noopener noreferrer" target="_blank" className="w-6 h-6 cursor-pointer hover:bg-gray-700 rounded-full flex items-center justify-center">
              <Image src={linkedinicon} alt="" />
            </Link>
          </div>
        </div>
        <div className="c-footer-top-middle">
          <h2 className="c-footer-title">Quick links</h2>
          <ul className='c-footer-links'>
            <li><Link href="/" className="c-footer-item">Home</Link></li>
            <li><Link href="/services" className="c-footer-item">Services</Link></li>
            <li><Link href="/about" className="c-footer-item">About</Link></li>
            <li><Link href="/contact" className="c-footer-item">Contact</Link></li>
          </ul>
        </div>
        <div className="c-footer-top-last">
          <h2 className="c-footer-title">Contact</h2>
          <ul className='c-footer-links'>
            <li className='phone'><Image src={phoneicon} alt="" /><div  className="c-footer-item pl-2">{data?.data?.contact_detail_content[0]?.phone}</div></li>
            <li className='mail'><Image src={mailicon} alt="" /><div  className="c-footer-item pl-2">{data?.data?.contact_detail_content[0]?.email}</div></li>
            <li className='map'><Image src={mapicon} alt="" /><div  className="c-footer-item pl-2">{data?.data?.contact_detail_content[0]?.address}</div></li>
          </ul>
        </div>
      </div>
      <div className="c-footer-bottom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 md:gap-8 gap-4">
        <div className="flex flex-col">
          <p className="c-footer-bottom-text">
            Created by {data?.data?.contact_detail_content[0]?.created_by}
          </p>
        </div>
        <div className="flex flex-col">
          <Link href="/privacypolicy" className="c-footer-item text-right">Privacy Policy</Link>
        </div>
      </div>
    </div>
  </footer>
  )
}

export default Footer