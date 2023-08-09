'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import videobgimg from './../../../../../assets/images/video-bg.jpg';
import { renderMarkdownToHTML } from '@/components/module/common/remarkable-editor/rendermarkdowntohtml';
import { cmsFilePath } from '@/config';
const DefendingRights = ({ value }) => {
  const [video, setvideo] = useState({
    url: value?.button_url,
    playing: true,
    light: true,
    muted: false,
  });
  const handlePause = () => {
    setvideo({ ...video, playing: false, light: true });
  };

  const handlePlay = () => {
    setvideo({ ...video, playing: true, light: false });
  };
  return (
    <section className="c-engage lg:pt-0 lg:pb-6">
      <div className="container-video">
        <div className="container-lg">
          <div className="c-services-top">
            <h2 className="c-services-top-title">{value?.name}</h2>
            <p
              className="c-services--top-text"
              dangerouslySetInnerHTML={renderMarkdownToHTML(value?.description)}
            ></p>
          </div>
        </div>
        <div className="video-wrapper">
          <div className="video-wrapper">
            <div
              className="video-container overflow-hidden"
              id="video-container"
            >
              <ReactPlayer
                url={video.url}
                playing={video.playing}
                light={
                  video.light ? (
                    <Image
                      src={
                        value?.image !== ''
                          ? cmsFilePath + value?.image
                          : videobgimg
                      }
                      alt="light"
                      width={500}
                      height={500}
                    />
                  ) : null
                }
                onPlay={handlePlay}
                onPause={handlePause}
                muted={video.muted}
                width="100%"
                id="video"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DefendingRights;
