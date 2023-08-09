import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import gettouchImage from './../../../../../assets/images/get-touch-img.jpg';
import { renderMarkdownToHTML } from '@/components/module/common/remarkable-editor/rendermarkdowntohtml';
import { cmsFilePath } from '@/config';
const GetTouch = ({value}) => {
  return (
    <section className="c-what-we-do py-10 lg:py-24">
    <div className='container-lg'>
      <div className="grid lg:grid-cols-2 items-center justify-items-center gap-[5.8rem]">
        <div className="order-2 lg:order-1 c-what-we-do-right">
          <h2 className='c-what-we-do-title'>{value?.name}</h2>
          <p className='c-what-we-do-text' 
          dangerouslySetInnerHTML={renderMarkdownToHTML(value?.description)}
          ></p>
           {value?.button_name !=="" && value?.button_url !=="" &&
           <Link 
           href={`${value?.button_url}`} 
           rel="noopener noreferrer"
           className="primary-btn">Contact Us</Link>
           }
          
        </div>
        <div className="order-1 lg:order-2 c-what-we-do-left">
          <Image className='object-cover-Image' 
          src={cmsFilePath +value?.image} alt=""
          width={500}
          height={500}
          />
        </div>
      </div>
    </div>
  </section>
  )
}

export default GetTouch