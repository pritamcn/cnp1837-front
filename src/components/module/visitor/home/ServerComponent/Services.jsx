import React from 'react'
import gettouchimg from './../../../../../assets/images/get-touch-img.jpg';
import Link from 'next/link';
import Image from 'next/image';
import { serviceFilePath } from '@/config';
import { renderMarkdownToHTML } from '@/components/module/common/remarkable-editor/rendermarkdowntohtml';
const Services = ({value,content}) => {
  return (
    <section className="c-services py-10 lg:pt-24 lg:pb-6">
    <div className="container-lg">
      <div className='c-services-top'>
        <h2 className='c-services-top-title text-center'>{content?.name}</h2>
        <p className='c-services-top-text' dangerouslySetInnerHTML={renderMarkdownToHTML(content?.description)}>
          
          </p>
      </div>
      <div className='c-services-grid'>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[3rem]">
          {value?.length >0 && value?.map((item,i)=>(
             <div className="flex flex-col items-start justify-start" key={i}>
             <div className='c-services-Image'>
             <Image
                      className="object-cover-Image"
                      src={item?.image !==''? serviceFilePath+item?.image:gettouchimg}
                      alt="Service"
                      width={500}
                      height={500}
                    />
             </div>
             <h4 className='c-services-title'>{item?.name}</h4>
             <p className='c-services-text'
              dangerouslySetInnerHTML={renderMarkdownToHTML(item?.description)}></p>
           </div>
          ))}
        </div>
      </div>
      <div className='flex justify-center m-[40px]'>
        <Link href='/services' className="primary-btn btn-outline">View All Services</Link>
      </div>
    </div>
  </section>
  )
}

export default Services