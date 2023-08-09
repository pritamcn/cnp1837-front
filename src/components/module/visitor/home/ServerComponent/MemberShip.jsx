import Link from 'next/link';
import React from 'react';
import heroimage from './../../../../../assets/images/home-hero-image.jpg';
import Image from 'next/image';
import { bannerFilePath } from '@/config';
import { renderMarkdownToHTML } from '@/components/module/common/remarkable-editor/rendermarkdowntohtml';
const MemberShip = ({ banner, content }) => {
  return (
    <section className="hero-image-wrap relative">
      <div className="hero-image flex items-center justify-center text-center relative">
        <div className="absolute top-0 left-0 w-full flex-1 flex items-center justify-center overflow-hidden h-full">
          <Image
            src={bannerFilePath + banner}
            alt="Hero image"
            layout="fill"
            objectFit="cover"
            className="!relative"
          />
        </div>
        <div className="container absolute">
          <div className="text-left max-w-[41.875rem]">
            <div className="content float-left py-4 px-5 my-5">
              <h1 className="hero-title">{content?.name}</h1>
              <p
                className="hero-text !text-white"
                dangerouslySetInnerHTML={renderMarkdownToHTML(
                  content?.description
                )}
              ></p>
            </div>
            {content?.button_name !== '' && content?.button_url !== '' && (
              <div className="cta clear-left px-5">
                <Link
                  href={`${content?.button_url}`}
                  rel="noopener noreferrer"
                  className="primary-btn"
                >
                  {content?.button_name}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberShip;
