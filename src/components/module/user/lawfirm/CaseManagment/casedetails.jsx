'use client';
import Image from 'next/image';
import React from 'react';
import topbluemaskbg from '../../../../../assets/images/case-setails-mask-blue-bg.png';
import casenoicon from '../../../../../assets/images/case-icon/case-icon.png';
import courtno from '../../../../../assets/images/case-icon/court-no.png';
import claimno from '../../../../../assets/images/case-icon/claim-no.png';
import fileno from '../../../../../assets/images/case-icon/file-no.png';
import locationicon from '../../../../../assets/images/case-icon/location-title.svg';
import docicon from '../../../../../assets/images/case-icon/document-icon.svg';
import docxicon from '../../../../../assets/images/case-icon/docs-icon.svg';
import pdficon from '../../../../../assets/images/case-icon/pdf-icon.svg';
import caseediticon from '../../../../../assets/images/case-icon/case-details-edit-icon.svg';
import detailsicon from '../../../../../assets/images/case-icon/details-icon.svg';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import useSWR from 'swr';
import Createdeposition from './createdeposition';
import Upcomingdeposition from './upcomingdeposition';
import Previousdeposition from './previousdeposition';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import { useParams } from 'next/navigation';
import { filePath } from '@/config';
import Loader from '../Loader';
import Link from 'next/link';

const Casedetails = ({data}) => {
  const axiosAuth = useAxiosAuth();
  const { id: caseid } = useParams();
  const {
    data: getcasedata,
    error,
    isLoading,
  } = useSWR(
    [`case/getCaseDetails/${caseid}`, axiosAuth],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        return { data };
      },
    }
  );
  const handlefile = (file) => {
    window.open(`${filePath}/${file}`, '_blank');
  };
  return (
    <div className="case-details">
      {getcasedata !== undefined ? (
        <>
         <div className="p-title-flex flex items-center justify-between flex-wrap mb-6">
        <h2 className="c-page-title">Case Details</h2>
        {getcasedata?.data?.data?.status ==='1' && 
         <Link
         href={`${data?.user?.role_id === "6" ? "/AttorneyAssistant" : "/Attorney"}/casemanagement/editcase/${caseid}`}
           className="primary-btn cursor-pointer"
         >
           <Image src={caseediticon} alt="" /> Edit
         </Link>
        }
       
      </div>
          <div
            className="case-detaoils-top p-9 mb-8"
            style={{ backgroundImage: `url(${topbluemaskbg.src})` }}
            //style={{ backgroundImage: `url(${topbluemaskbg})`, }}
          >
            <div className="case-details-flex flex flex-wrap gap-14">
              <div className="case-details-col lg:basis-1/3 basis-full">
                <div className="col-top pb-12">
                  <h4 className="col-top-title">Defendant Lawyer/Law Firm</h4>
                  <ul className="case-tag">
                    {getcasedata?.data?.data?.defendant_lawyer?.map(
                      (item, i) => (
                        <li className="case-tag-item" key={i}>
                          {item?.label}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="col-details">
                  <h5 className="col-details-title">Defendant</h5>
                  <ul className="case-user">
                    <li className="case-user-item">
                      <strong className="case-user-name">Name</strong>
                      <strong className="case-user-email">Email ID</strong>
                    </li>
                    {getcasedata?.data?.data?.defendant?.map(
                      (defendant, i2) => (
                        <li className="case-user-item !flex-nowrap" key={i2}>
                          <div
                            className="tooltip text-left"
                            data-tip={defendant?.name}
                          >
                            <span className="case-user-sname truncate !block !max-w-[8.75rem]">
                              {defendant?.name}
                            </span>
                          </div>
                          <div
                            className="tooltip text-left"
                            data-tip={defendant?.email}
                          >
                            <span className="case-user-semail truncate !block !max-w-[8.75rem]">
                              {defendant?.email}
                            </span>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              <div className="divider-vs lg:basis-2.5 basis-full"></div>

              <div className="case-details-col lg:basis-1/3 basis-full">
                <div className="col-top pb-12">
                  <h4 className="col-top-title">Plaintiff Lawyer/Law Firm</h4>
                  <ul className="case-tag">
                    {getcasedata?.data?.data?.plaintiff_lawyer?.map(
                      (item, i) => (
                        <li className="case-tag-item" key={i}>
                          {item?.label}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="col-details">
                  <h5 className="col-details-title">Plaintiff</h5>
                  <ul className="case-user">
                    <li className="case-user-item">
                      <strong className="case-user-name">Name</strong>
                      <strong className="case-user-email">Email ID</strong>
                    </li>
                    {getcasedata?.data?.data?.plaintiff?.map(
                      (plaintiff, i2) => (
                        <li className="case-user-item !flex-nowrap" key={i2}>
                          <div
                            className="tooltip text-left"
                            data-tip={plaintiff?.name}
                          >
                            <span className="case-user-sname truncate !block !max-w-[8.75rem]">
                              {plaintiff?.name}
                            </span>
                          </div>
                          <div
                            className="tooltip text-left"
                            data-tip={plaintiff?.email}
                          >
                            <span className="case-user-semail truncate !block !max-w-[8.75rem]">
                              {plaintiff?.email}
                            </span>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="case-info mb-8">
            <h4 className="case-info-title pb-4">Case Information</h4>
            <div className="case-info-flex">
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-5">
                <div className="case-info-box text-center">
                  <Image src={casenoicon} alt="" className="case-info-icon" />
                  <span className="case-info-tag">Case Name</span>
                  <div
                    className="tooltip p-0"
                    data-tip={getcasedata?.data?.data?.case_name}
                  >
                    <span className="case-info-id truncate max-w-[16.25rem]">
                      {getcasedata?.data?.data?.case_name}
                    </span>
                  </div>
                </div>
                <div className="case-info-box text-center">
                  <Image src={casenoicon} alt="" className="case-info-icon" />
                  <span className="case-info-tag">Case No</span>
                  <div
                    className="tooltip p-0"
                    data-tip={getcasedata?.data?.data?.case_number}
                  >
                    <span className="case-info-id truncate max-w-[16.25rem]">
                      {getcasedata?.data?.data?.case_number}
                    </span>
                  </div>
                </div>
                <div className="case-info-box text-center">
                  <Image src={courtno} alt="" className="case-info-icon" />
                  <span className="case-info-tag">Court No</span>
                  <div
                    className="tooltip p-0"
                    data-tip={getcasedata?.data?.data?.court_number}
                  >
                    <span className="case-info-id truncate max-w-[16.25rem]">
                      {getcasedata?.data?.data?.court_number}
                    </span>
                  </div>
                </div>{' '}
                <div className="case-info-box text-center">
                  <Image src={claimno} alt="" className="case-info-icon" />
                  <span className="case-info-tag">Claim No</span>
                  <div
                    className="tooltip p-0"
                    data-tip={getcasedata?.data?.data?.claim_number}
                  >
                    <span className="case-info-id truncate max-w-[16.25rem]">
                      {getcasedata?.data?.data?.claim_number}
                    </span>
                  </div>
                </div>
                <div className="case-info-box text-center">
                  <Image src={fileno} alt="" className="case-info-icon" />
                  <span className="case-info-tag">File No</span>
                  <div
                    className="tooltip p-0"
                    data-tip={getcasedata?.data?.data?.file_number}
                  >
                    <span className="case-info-id truncate max-w-[16.25rem]">
                      {getcasedata?.data?.data?.file_number}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-5 mb-8">
            <div className="location-box xl:col-span-3 lg:col-span-4">
              <div className="flex flex-wrap items-center gap-4">
                <Image src={locationicon} alt="" />
                <h4 className="location-box-title">Location</h4>
              </div>
              <div className="location-post grid grid-cols-3 gap-4">
                <div className="location-item">
                  <span className="location-label">State</span>
                  <strong className="location-value">
                    {getcasedata?.data?.data?.state?.label}
                  </strong>
                </div>
                <div className="location-item">
                  <span className="location-label">County</span>
                  <strong className="location-value">
                    {getcasedata?.data?.data?.county?.label}
                  </strong>
                </div>
                <div className="location-item">
                  <span className="location-label">City</span>
                  <strong className="location-value">
                    {getcasedata?.data?.data?.city?.label}
                  </strong>
                </div>
              </div>
            </div>
             {getcasedata?.data?.data?.files?.length >0 && 
              <div className="location-box xl:col-span-2 lg:col-span-4">
              <div className="flex flex-wrap items-center gap-4">
                <Image src={docicon} alt="" />
                <h4 className="location-box-title">Documents</h4>
              </div>
              <div className="doc-post grid grid-cols-2 gap-4">
                {getcasedata?.data?.data?.files?.map((file, i) => (
                  <div
                    className="doc-item cursor-pointer"
                    key={i}
                    onClick={() => handlefile(file?.file_name)}
                  >
                    {file?.file_name?.slice(-3) === 'pdf' ? (
                      <Image src={pdficon} alt="" className="doc-img" />
                    ) : (
                      <Image src={docxicon} alt="" className="doc-img" />
                    )}
                    <div className="doc-value">View Attachment</div>
                  </div>
                ))}
              </div>
            </div>
             }
           
          </div>
             {getcasedata?.data?.data?.details !=="" &&
             <div className="grid grid-cols-12">
             <div className="location-box col-span-12">
               <div className="flex flex-wrap items-center gap-4 mb-2">
                 <Image src={detailsicon} alt="" />
                 <h4 className="location-box-title">Details</h4>
               </div>
               <div className="case-details-text">
                 <p>{getcasedata?.data?.data?.details}</p>
               </div>
             </div>
           </div>
             
             }
          
              {getcasedata?.data?.data?.status ==='1' && 
              <>
                  <Createdeposition caseid={caseid} axiosAuth={axiosAuth} />
                  <Upcomingdeposition caseid={caseid} axiosAuth={axiosAuth} />
                  </>
              }
          <Previousdeposition caseid={caseid} axiosAuth={axiosAuth} />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Casedetails;
