'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import {
  WithTokenGetApi,
  WithTokenTriggerGetApi,
} from '@/services/module/api/getapi';
import useSWRMutation from 'swr/mutation';
import previcon from '../../../../../assets/images/icons/table-grey-prev-icon.svg';
import nexticon from '../../../../../assets/images/icons/table-grey-next-icon.svg';
import soliddownicon from '../../../../../assets/images/icons/grey-solid-down-icon.svg';
import AscendingIcon from '../../../../../assets/images/case-management/ascending-icon.svg';
import DecendingIcon from '../../../../../assets/images/case-management/decending-icon.svg';
import { durationextractor } from '@/helpers/mischelper';
import Loader from '../Loader';
import moment from 'moment';
import TranscriptManagementSearchbar from './DepositionRequestSearchbar';
import FileIcon from '../../../../../assets/images/deposition-request/file-icon.svg';
import JsFileDownloader from 'js-file-downloader';
import { transcriptFilePath } from '@/config';

const TranscriptManagementTable = () => {
  const axiosAuth = useAxiosAuth();
  const [depositionList, setDepositionList] = useState([]);
  const [transcriptionList, setTranscriptionList] = useState([]);
  const [depocount, setdepocount] = useState(0);

  const [sortName, setSortName] = useState('end_time');
  const [asc, setAsc] = useState('DESC');
  const [startpagecount, setstartpagecount] = useState(1);
  const [endpagecount, setendpagecount] = useState(10);
  const [searchCaseValue, setSearchCaseValue] = useState('');
  const [searchDepoValue, setSearchDepoValue] = useState('');
  const [startdatevalue, setstartdatevalue] = useState('');
  const [enddatevalue, setenddatevalue] = useState('');
  const [rowvalue, setrowvalue] = useState(10);
  const [row, setrow] = useState(false);
  const [transcriptLoading, setTranscriptLoading] = useState(false);

  const {
    data: depositionData,
    error,
    isLoading: getdataLoading,
    mutate,
  } = useSWR(
    [
      `/transcript/getListCourtReporter?case_name=${searchCaseValue}&deponent_name=${searchDepoValue}&sort_name=${sortName}&sort_order=${asc}&startCount=${startpagecount}&endCount=${endpagecount}&start_date=${startdatevalue}&end_date=${enddatevalue}`,
      axiosAuth,
    ],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );

  const {
    trigger: transcripttrigger,
    data: gettranscriptdata,
    error: transcriptionerror,
  } = useSWRMutation(`/transcript/getTranscriptFiles`, WithTokenTriggerGetApi);

  useEffect(() => {
    if (gettranscriptdata?.status === 200) {
      setTranscriptionList(gettranscriptdata?.data?.data);
      setTranscriptLoading(false);
    }
    if (gettranscriptdata === undefined) {
      setTranscriptionList([]);
      setTranscriptLoading(false);
    }
  }, [gettranscriptdata, transcriptionerror]);

  useEffect(() => {
    if (
      depositionData?.status === 200 &&
      depositionData?.data?.list?.length > 0
    ) {
      let modifyData = depositionData?.data?.list.map((item) => {
        return {
          id: item?.deposition_id,
          case_no: item?.case_number,
          case_name: item?.case_name ? item?.case_name?.toLowerCase()?.split(' vs ') : '--',
          depo_no: item?.deposition_number,
          deponent_name: item?.deponent_name,
          start_time: item?.start_time,
          end_time: item?.end_time,
          duration: item?.start_time
            ? durationextractor(item?.start_time, item?.end_time)
            : '--',
          invitees_by: item?.invited_by ? item?.invited_by?.split('(')[0] : '',
          file_count: item?.file_count,
        };
      });

      setDepositionList(modifyData);
      setdepocount(depositionData?.data?.totalCount);
    }
    if (
      depositionData?.status === 200 &&
      depositionData?.data?.list?.length === 0
    ) {
      setDepositionList([]);
      setdepocount(0);
    }
  }, [depositionData]);

  const handlesort = (sort, condition) => {
    setAsc(condition);
    setSortName(sort);
    setstartpagecount(1);
    setendpagecount(rowvalue);
  };

  const handleprev = () => {
    if (startpagecount < depocount - rowvalue && startpagecount !== 1) {
      setstartpagecount((prev) => prev - rowvalue);
      setendpagecount((prev) => prev - rowvalue);
      window.scroll(40, 40);
    } else if (startpagecount < depocount || startpagecount === depocount) {
      let temppagecount = startpagecount - rowvalue;
      let temppage2count = temppagecount + (rowvalue - 1);
      setstartpagecount(temppagecount);
      setendpagecount(temppage2count);
      window.scroll(40, 40);
    }
  };
  const handlenext = () => {
    if (endpagecount < depocount - rowvalue) {
      setstartpagecount((prev) => prev + rowvalue);
      setendpagecount((prev) => prev + rowvalue);
      window.scroll(40, 20);
    } else if (endpagecount < depocount) {
      setstartpagecount((prev) => prev + rowvalue);
      setendpagecount(depocount);
      window.scroll(40, 20);
    }
  };

  const handleRow = (number) => {
    setrowvalue(number);
    setstartpagecount(1);
    setendpagecount(number);
    setrow(false);
  };

  const handleSearchvalue = (value) => {
    if (value?.searchcondition === true) {
      setSearchCaseValue(value?.casesearch);
      setSearchDepoValue(value?.deposearch);
      setenddatevalue('');
      setstartdatevalue('');
    } else {
      setenddatevalue(
        value?.enddate === '' ? '' : moment(value?.enddate).format('YYYY-MM-DD')
      );
      setstartdatevalue(
        value?.startdate === ''
          ? ''
          : moment(value?.startdate).format('YYYY-MM-DD')
      );
      setSearchCaseValue(value?.casesearch);
      setSearchDepoValue(value?.deposearch);
    }
    setstartpagecount(1);
    setendpagecount(rowvalue);
    setSortName('case_name');
    setAsc('ASC');
  };

  const handleDynamicTable = (id, index) => {
    let tempdata = depositionList.find(
      (item, itemIndex) => itemIndex === index
    );
    if (tempdata.isShow) {
      let modifiedData = depositionList.map((depoItem, itemIndex) => {
        if (itemIndex === index) {
          return { ...depoItem, isShow: false };
        } else {
          return depoItem;
        }
      });
      setDepositionList(modifiedData);
      setTranscriptLoading(false);
    } else {
      let modifiedData = depositionList.map((depoItem, itemIndex) => {
        if (itemIndex === index) {
          return { ...depoItem, isShow: true };
        } else if (itemIndex !== index && depoItem?.isShow === true) {
          return { ...depoItem, isShow: false };
        } else {
          return depoItem;
        }
      });
      setDepositionList(modifiedData);
      transcripttrigger({ id, axios: axiosAuth });
      setTranscriptLoading(true);
    }

    let dynamicRowCheck = depositionList?.find(
      (item) => item.dynamictableInput === 'yes'
    );
    if (dynamicRowCheck === undefined) {
      let temprow = [...depositionList];
      const rowsInput = {
        dynamictableInput: 'yes',
        dynamicrowsunderid: id,
        case_no: null,
        depo_no: '',
        duration: '',
        start_time: '',
        end_time: '',
        file_count: '',
        id: '',
        invitees_by: '',
      };
      transcripttrigger({ id, axios: axiosAuth });
      temprow.splice(index + 1, 0, rowsInput);
      setDepositionList(temprow);
      setTranscriptLoading(true);
    }
    if (
      dynamicRowCheck !== undefined &&
      dynamicRowCheck?.dynamicrowsunderid === id
    ) {
      let temprow = [...depositionList];
      let filteredRow = temprow?.filter(
        (item) => item?.dynamicrowsunderid !== id
      );
      setDepositionList(filteredRow);
      setTranscriptionList([]);
    }
    if (
      dynamicRowCheck !== undefined &&
      dynamicRowCheck?.dynamicrowsunderid !== id
    ) {
      let temprow = [...depositionList];
      let rowsInput = {
        dynamictableInput: 'yes',
        dynamicrowsunderid: id,
        case_no: null,
        depo_no: '',
        duration: '',
        start_time: '',
        end_time: '',
        file_count: '',
        id: '',
        invitees_by: '',
      };
      transcripttrigger({ id, axios: axiosAuth });
      temprow.splice(index + 1, 0, rowsInput);
      let removableRow = temprow?.find(
        (item) =>
          item?.dynamicrowsunderid !== id && item?.dynamictableInput === 'yes'
      );
      let filteredRow = temprow?.filter(
        (item) => item?.dynamicrowsunderid !== removableRow?.dynamicrowsunderid
      );
      setDepositionList(filteredRow);
      setTranscriptLoading(true);
    }
  };

  const onDownloadHandler = (link) => {
    const download = new JsFileDownloader({
      url: link,
      autoStart: false,
    });

    download
      .start()
      .then(function () {
      })
      .catch(function (error) {
      });
  };

  return (
    <>
      <div className="m-card p-5">
        <TranscriptManagementSearchbar
          handleSearchvalue={handleSearchvalue}
        />
        <div className="m-card-table">
          <div className="c-table overflow-auto">
            <table className="table w-full">
              {/* head */}
              <thead>
                <tr>
                  <th className="w-4"></th>
                  <th className="w-auto">
                    Deponent Name
                    <button
                      className="ml-1"
                      type="button"
                      onClick={() => handlesort('deponent_name', 'ASC')}
                    >
                      <span
                        className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'deponent_name' && asc === 'ASC'
                            ? 'bg-blue-200'
                            : null
                          }`}
                      >
                        <Image src={AscendingIcon} alt="Ascending icon" />
                      </span>
                    </button>
                    <button
                      className="ml-1"
                      type="button"
                      onClick={() => handlesort('deponent_name', 'DESC')}
                    >
                      <span
                        className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'deponent_name' && asc === 'DESC'
                            ? 'bg-blue-200'
                            : null
                          }`}
                      >
                        <Image src={DecendingIcon} alt="Decending icon" />
                      </span>
                    </button>
                  </th>
                  <th className="w-auto">
                    Case Name
                    <button
                      className="ml-1"
                      type="button"
                      onClick={() => handlesort('case_name', 'ASC')}
                    >
                      <span
                        className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'case_name' && asc === 'ASC'
                            ? 'bg-blue-200'
                            : null
                          }`}
                      >
                        <Image src={AscendingIcon} alt="Ascending icon" />
                      </span>
                    </button>
                    <button
                      className="ml-1"
                      type="button"
                      onClick={() => handlesort('case_name', 'DESC')}
                    >
                      <span
                        className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'case_name' && asc === 'DESC'
                            ? 'bg-blue-200'
                            : null
                          }`}
                      >
                        <Image src={DecendingIcon} alt="Decending icon" />
                      </span>
                    </button>
                  </th>
                  <th className="w-auto">
                    End Time
                    <button
                      className="ml-1"
                      type="button"
                      onClick={() => handlesort('end_time', 'ASC')}
                    >
                      <span
                        className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'end_time' && asc === 'ASC'
                            ? 'bg-blue-200'
                            : null
                          }`}
                      >
                        <Image src={AscendingIcon} alt="Ascending icon" />
                      </span>
                    </button>
                    <button
                      className="ml-1"
                      type="button"
                      onClick={() => handlesort('end_time', 'DESC')}
                    >
                      <span
                        className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'end_time' && asc === 'DESC'
                            ? 'bg-blue-200'
                            : null
                          }`}
                      >
                        <Image src={DecendingIcon} alt="Decending icon" />
                      </span>
                    </button>
                  </th>
                  <th className="w-auto">
                    File Count
                    <button
                      className="ml-1"
                      type="button"
                      onClick={() => handlesort('file_count', 'ASC')}
                    >
                      <span
                        className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'file_count' && asc === 'ASC'
                            ? 'bg-blue-200'
                            : null
                          }`}
                      >
                        <Image src={AscendingIcon} alt="Ascending icon" />
                      </span>
                    </button>
                    <button
                      className="ml-1"
                      type="button"
                      onClick={() => handlesort('file_count', 'DESC')}
                    >
                      <span
                        className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'file_count' && asc === 'DESC'
                            ? 'bg-blue-200'
                            : null
                          }`}
                      >
                        <Image src={DecendingIcon} alt="Decending icon" />
                      </span>
                    </button>
                  </th>
                  <th className="w-auto">Duration</th>
                  <th className="w-auto">INVITED BY</th>
                </tr>
              </thead>
              {getdataLoading ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    <Loader />
                  </td>
                </tr>
              ) :
                <tbody>
                  {depositionList?.length > 0 ? (
                    depositionList?.map((item, i) => (
                      <tr key={i}>
                        {item?.dynamictableInput === 'yes' ? (
                          <td colSpan={7} className="p-0">
                            <div className="case-details-table">
                              {transcriptLoading ? (
                                <Loader />
                              ) : transcriptionList?.length > 0 ? (
                                <>
                                  <div className="grid grid-cols-3 gap-0 case-details-tr">
                                    <div className="case-details-th">
                                      Version No
                                    </div>
                                    <div className="case-details-th">
                                      Create Date
                                    </div>
                                    <div className="case-details-th">
                                      Transcript Files
                                    </div>
                                  </div>
                                  {transcriptionList?.map(
                                    (transItem, index) => (
                                      <div
                                        className="grid grid-cols-3 gap-0 case-details-tr"
                                        key={index}
                                      >
                                        <div className="case-details-td">
                                          {transItem?.version}
                                        </div>
                                        <div className="case-details-td">
                                          {moment(
                                            transItem?.created_at
                                          ).format('MM/DD/YYYY HH:MM')}
                                        </div>
                                        <div className="case-details-td">
                                          <div
                                            className="tooltip tooltip-right"
                                            data-tip="Download"
                                          >
                                            <button
                                              type="button"
                                              onClick={() =>
                                                onDownloadHandler(
                                                  transcriptFilePath +
                                                  '/' +
                                                  transItem?.file_path
                                                )
                                              }
                                              className="w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem]"
                                            >
                                              <Image
                                                src={FileIcon}
                                                alt="Video icon"
                                                className="w-full h-auto"
                                              />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </>
                              ) : (
                                <div className="grid grid-cols-8 gap-4 case-details-tr">
                                  Sorry no data found
                                </div>
                              )}
                            </div>
                          </td>
                        ) : (
                          <>
                            <td>
                              <div
                                className="down-arrow"
                                onClick={() =>
                                  handleDynamicTable(item?.id, i)
                                }
                              ></div>
                            </td>
                            <td>
                              {item?.deponent_name
                                ? item?.deponent_name
                                : '--'}
                            </td>
                            <td>
                              {typeof item?.case_name == 'string' ? item?.case_name : <>{item?.case_name[0]}
                                <span className="block">vs</span>
                                {item?.case_name[1]}</>}
                            </td>
                            <td>
                              {item?.end_time
                                ? moment(item?.end_time).format(
                                  'MM/DD/YYYY HH:MM'
                                )
                                : 'N/A'}
                            </td>
                            <td>{item?.file_count}</td>
                            <td>{item?.duration}</td>
                            <td>{item?.invitees_by}</td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
                        Sorry no data found
                      </td>
                    </tr>
                  )}
                </tbody>
              }
            </table>
          </div>
        </div>
      </div>
      {/* Pagination start */}
      {depocount > 10 && (
        <div className="table-meta-wrap">
          {depocount > 19 && (
            <div className="meta-row-count">
              <span className="meta-label">Rows per page:</span>
              <div className="select-dropdown">
                <button
                  role="button"
                  data-value=""
                  className="select-dropdown__button active"
                  onClick={() => setrow(!row)}
                >
                  <span>{rowvalue}</span>
                  <Image
                    src={soliddownicon}
                    className="i-chevron-down"
                    alt=""
                  />
                </button>
                {row && (
                  <ul className="select-dropdown__list active">
                    <li
                      data-value="1"
                      className="select-dropdown__list-item"
                      onClick={() => handleRow(10)}
                    >
                      10
                    </li>
                    <li
                      data-value="2"
                      className="select-dropdown__list-item"
                      onClick={() => handleRow(20)}
                    >
                      20
                    </li>

                    {depocount > 49 && (
                      <li
                        data-value="3"
                        className="select-dropdown__list-item"
                        onClick={() => handleRow(50)}
                      >
                        50
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          )}

          <div className="table-pagination">
            <span className="table-pagination-text">
              {startpagecount}-{endpagecount} of {depocount}
            </span>
            <button
              className="table-pagination-prev"
              onClick={handleprev}
              disabled={startpagecount === 1}
            >
              <Image src={previcon} alt="" />
            </button>
            <button
              className="table-pagination-next"
              disabled={endpagecount === depocount}
              onClick={handlenext}
            >
              <Image src={nexticon} alt="" />
            </button>
          </div>
        </div>
      )}
      {/* Pagination end */}
    </>
  );
};

export default TranscriptManagementTable;
