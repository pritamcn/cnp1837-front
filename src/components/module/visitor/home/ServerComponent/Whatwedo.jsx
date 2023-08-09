import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import whatwedoimg from './../../../../../assets/images/what-we-do-img.jpg';
import listicon from './../../../../../assets/images/icons/list-icon.svg';
import { cmsFilePath } from '@/config';
import { renderMarkdownToHTML } from '@/components/module/common/remarkable-editor/rendermarkdowntohtml';
const Whatwedo = ({content}) => {
  return (
    <section className="c-what-we-do py-10 lg:py-24">
    <div className='container-lg'>
      <div className="grid lg:grid-cols-2 items-center justify-items-center gap-[5.8rem]">
        <div className="c-what-we-do-left">
          <Image className='object-cover-Image' 
          src={cmsFilePath + content?.image} alt="" 
          width={500}
          height={500}
          />
        </div>
        <div className="c-what-we-do-right">
          <h2 className='c-what-we-do-title'>{content?.name}</h2>
          <p className='c-what-we-do-text' 
          dangerouslySetInnerHTML={renderMarkdownToHTML(content?.description)}
          >
            </p>
           {content?.button_name !=="" && content?.button_url !=="" && 
            <Link 
            href={`${content?.button_url}`} 
            rel="noopener noreferrer"
            className="primary-btn btn-outline">Read More</Link>
           }
         
        </div>
      </div>
    </div>
  </section>
  )
}

export default Whatwedo