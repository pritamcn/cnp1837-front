import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import listicon from './../../../../../assets/images/icons/list-icon.svg';
import redtag from './../../../../../assets/images/red-tag.png';
import { removeTags } from '@/helpers/mischelper';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { renderMarkdownToHTML } from '@/components/module/common/remarkable-editor/rendermarkdowntohtml';
const Engage = async ({ value }) => {
  const data = await getServerSession(authOptions);
  const subcriptionClasses =
    data === null
      ? 'grid lg:grid-cols-2 items-start gap-[2.5rem] subscription-box'
      : 'grid lg:grid-cols-1 items-start gap-[2.5rem] subscription-box';
  const buyASingleCallClasses =
    data === null ? 'grid grid-rows-2 gap-8' : 'grid grid-cols-2 gap-8';
  return (
    <section className="c-engage lg:pt-0 lg:pb-24">
      <div className="container-lg">
        <div className="c-services-top">
          <h2 className="c-services-top-title text-center">
            {value?.home_page_content[1].name}
          </h2>
          <p
            className="c-services--top-text"
            dangerouslySetInnerHTML={renderMarkdownToHTML(
              value?.home_page_content[1].description
            )}
          ></p>
        </div>
        <div className={subcriptionClasses}>
          {data === null && (
            <div className="grid-cols-7 order-2 lg:order-1 popular-plan">
              <div className="popular-plan-box">
                <div className="most-popular">
                  <Image src={redtag} alt="" />
                  <span>Most Popular</span>
                </div>
                <div className="c-what-we-do-right">
                  <div className="popular-plan-top">
                    <h3 className="c-what-we-do-title">
                      Membership Subscription
                    </h3>
                    <h2 className="popular-plan-price">
                      ${value?.memberShipSubscription?.monthly_price}
                      <small className="popular-plan-tag">/month</small> &nbsp;/
                      ${value?.memberShipSubscription?.yearly_price}
                      <small className="popular-plan-tag">/year</small>
                    </h2>
                    <h4 className="popular-plan-type my-5">
                      {value?.memberShipSubscription?.name}
                    </h4>
                  </div>
                  <ul className="c-list">
                    {value?.memberShipSubscription?.description
                      .split('<p>')
                      .map((str, i) => (
                        <>
                          {str !== '' && (
                            <li key={i}>
                              <Image src={listicon} alt="" />{' '}
                              <span>{str.substring(0, str.length - 4)}</span>{' '}
                            </li>
                          )}
                        </>
                      ))}
                  </ul>
                  <Link
                    href="/membersubscription"
                    className="primary-btn w-full"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="grid-cols-5 order-1 lg:order-2 single-plan">
            <h3 className="single-plan-title">Buy a Single Call</h3>
            <div className={buyASingleCallClasses}>
              <div className="plan-box">
                <div className="flex plan-box-top">
                  <h4 className="plan-box-title">
                    One Call + Recorded Audio File
                  </h4>
                  <div className="price-amount">
                    ${value?.singleCall[1]?.price}
                  </div>
                </div>
                <div className="flex justify-start price-box-text">
                  <p>{removeTags(value?.singleCall[1]?.description)}</p>
                </div>
                <div className="flex justify-start">
                  <Link
                    href="/individualdepocost"
                    className="btn-outline primary-btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              <div className="plan-box">
                <div className="flex plan-box-top">
                  <h4 className="plan-box-title">
                    One Call + Recorded Video File{' '}
                  </h4>
                  <div className="price-amount">
                    ${value?.singleCall[0]?.price}
                  </div>
                </div>
                <div className="flex justify-start price-box-text">
                  <p>{removeTags(value?.singleCall[0]?.description)}</p>
                </div>
                <div className="flex justify-start">
                  <Link
                    href="/individualdepocost"
                    className="btn-outline primary-btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Engage;
