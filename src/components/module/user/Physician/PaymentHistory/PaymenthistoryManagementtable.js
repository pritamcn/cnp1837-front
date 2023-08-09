'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import DecendingIcon from '../../../../../assets/images/deposition-request/decending-icon.svg';
import AscendingIcon from '../../../../../assets/images/deposition-request/ascending-icon.svg';
import previcon from '../../../../../assets/images/icons/table-grey-prev-icon.svg';
import nexticon from '../../../../../assets/images/icons/table-grey-next-icon.svg';
import soliddownicon from '../../../../../assets/images/icons/grey-solid-down-icon.svg';
import PaymenthistoryManagementsearchbar from './PaymenthistoryManagementsearchbar';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import { getFormattedDate } from '@/helpers/mischelper';
import Loader from '../Loader';

const Paymenthistorymanagementtable = () => {
  const axiosAuth = useAxiosAuth();
  const [paymentList, setPaymentList] = useState([]);
  const [paymentcount, setPaymentCount] = useState(0);

  const [sortName, setSortName] = useState('due_date');
  const [asc, setAsc] = useState('desc');
  const [startpagecount, setstartpagecount] = useState(1);
  const [endpagecount, setendpagecount] = useState(10);
  const [searchCaseValue, setSearchCaseValue] = useState('');
  const [searchDepoValue, setSearchDepoValue] = useState('');
  const [startdatevalue, setstartdatevalue] = useState('');
  const [enddatevalue, setenddatevalue] = useState('');
  const [rowvalue, setrowvalue] = useState(10);
  const [row, setrow] = useState(false);
  const [status, setstatus] = useState(4);

  const {
    data: paymentData,
    error,
    isLoading: getdataLoading,
    mutate,
  } = useSWR(
    [
      `/payment/getPaymentList?sort_name=${sortName}&sort_order=${asc}&startCount=${startpagecount}&endCount=${endpagecount}&case_name=${searchCaseValue}&deponent_name=${searchDepoValue}&start_date=${startdatevalue}&end_date=${enddatevalue}&status=${status}`,
      axiosAuth,
    ],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (paymentData?.status === 200 && paymentData?.data?.data?.length > 0) {
      let modifyData = paymentData?.data?.data.map((item) => {
        return {
          id: item?.id,
          case_id: item?.case_deposition?.case?.case_number,
          case_name: item?.case_deposition?.case?.case_name ? item?.case_deposition?.case?.case_name?.toLowerCase()?.split(' vs ') : '--',
          depo_id: item?.case_deposition?.deposition_number,
          deponent_name: item?.case_deposition?.deponent_name,
          due_date:
            parseInt(item.status) === 0
              ? getFormattedDate(item.due_date)
              : '--',
          received_date:
            parseInt(item.status) === 1
              ? getFormattedDate(item.updatedAt)
              : '--',
          payee:
            item?.case_deposition?.user?.first_name +
            ' ' +
            item?.case_deposition?.user?.last_name,
          amount: item?.amount,
          status: parseInt(item?.status),
          refund_policy: paymentData?.data?.refund_policy,
        };
      });
      setPaymentList(modifyData);
      setPaymentCount(paymentData?.data?.totalCount);
    }
    if (paymentData?.status === 200 && paymentData?.data?.data?.length === 0) {
      setPaymentList([]);
      setPaymentCount(0);
    }
  }, [paymentData]);

  const handleSearchvalue = (value) => {
    if (value?.searchcondition === true) {
      setSearchCaseValue(value?.casesearch);
      setSearchDepoValue(value?.deposearch);
      setenddatevalue('');
      setstartdatevalue('');
      setstatus(4);
    } else {
      setenddatevalue(value?.enddate);
      setstartdatevalue(value?.startdate);
      setstatus(value?.status);
      setSearchCaseValue('');
      setSearchDepoValue('');
    }
    setstartpagecount(1);
    setendpagecount(rowvalue);
    setSortName('case_name');
    setAsc('asc');
  };

  // Sort handler
  const handlesort = (sort, condition) => {
    setAsc(condition);
    setSortName(sort);
    setstartpagecount(1);
    setendpagecount(rowvalue);
  };

  const handleprev = () => {
    if (startpagecount < paymentcount - rowvalue && startpagecount !== 1) {
      setstartpagecount((prev) => prev - rowvalue);
      setendpagecount((prev) => prev - rowvalue);
      window.scroll(40, 40);
    } else if (
      startpagecount < paymentcount ||
      startpagecount === paymentcount
    ) {
      let temppagecount = startpagecount - rowvalue;
      let temppage2count = temppagecount + (rowvalue - 1);
      setstartpagecount(temppagecount);
      setendpagecount(temppage2count);
      window.scroll(40, 40);
    }
  };

  const handlenext = () => {
    if (endpagecount < paymentcount - rowvalue) {
      setstartpagecount((prev) => prev + rowvalue);
      setendpagecount((prev) => prev + rowvalue);
    } else if (endpagecount < paymentcount) {
      setstartpagecount((prev) => prev + rowvalue);
      setendpagecount(paymentcount);
    }
  };
  const handleRow = (number) => {
    setrowvalue(number);
    setstartpagecount(1);
    setendpagecount(number);
    setrow(false);
  };

  return (
    <>
      <div className="m-card p-5">
        <PaymenthistoryManagementsearchbar
          handleSearchvalue={handleSearchvalue}
        />
        <div className="m-card-table">
          <div className="c-table overflow-auto">
            <div className="overflow-visible">
              <table className="table w-full">
                <thead>
                  <tr className="">
                    <th className="w-auto normal-case">Status</th>
                    <th className="w-auto normal-case">
                      Case Name
                      <button
                        className="ml-1"
                        type="button"
                        onClick={() => handlesort('case_name', 'asc')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'case_name' && asc === 'asc'
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
                        onClick={() => handlesort('case_name', 'desc')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'case_name' && asc === 'desc'
                              ? 'bg-blue-200'
                              : null
                            }`}
                        >
                          <Image src={DecendingIcon} alt="Decending icon" />
                        </span>
                      </button>
                    </th>
                    <th className="w-auto normal-case">
                      Deponent Name
                      <button
                        className="ml-1"
                        type="button"
                        onClick={() => handlesort('deponent_name', 'asc')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'deponent_name' && asc === 'asc'
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
                        onClick={() =>
                          handlesort('deponent_name', 'desc')
                        }
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'deponent_name' && asc === 'desc'
                              ? 'bg-blue-200'
                              : null
                            }`}
                        >
                          <Image src={DecendingIcon} alt="Decending icon" />
                        </span>
                      </button>
                    </th>
                    <th className="w-auto normal-case">
                      Payee
                      <button
                        className="ml-1"
                        type="button"
                        onClick={() => handlesort('payee', 'asc')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'payee' && asc === 'asc'
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
                        onClick={() => handlesort('payee', 'desc')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'payee' && asc === 'desc'
                              ? 'bg-blue-200'
                              : null
                            }`}
                        >
                          <Image src={DecendingIcon} alt="Decending icon" />
                        </span>
                      </button>
                    </th>
                    <th className="w-auto normal-case">Amount</th>
                    <th className="w-auto normal-case">Note</th>
                    <th className="w-auto normal-case">
                      Received Date
                      <button
                        className="ml-1"
                        type="button"
                        onClick={() => handlesort('updated_at', 'asc')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'updated_at' && asc === 'asc'
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
                        onClick={() => handlesort('updated_at', 'desc')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'updated_at' && asc === 'desc'
                              ? 'bg-blue-200'
                              : null
                            }`}
                        >
                          <Image src={DecendingIcon} alt="Decending icon" />
                        </span>
                      </button>
                    </th>
                    <th className="w-auto normal-case">
                      Due Date
                      <button
                        className="ml-1"
                        type="button"
                        onClick={() => handlesort('due_date', 'asc')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'due_date' && asc === 'asc'
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
                        onClick={() => handlesort('due_date', 'desc')}
                      >
                        <span
                          className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'due_date' && asc === 'desc'
                              ? 'bg-blue-200'
                              : null
                            }`}
                        >
                          <Image src={DecendingIcon} alt="Decending icon" />
                        </span>
                      </button>
                    </th>
                  </tr>
                </thead>
                {getdataLoading || paymentData === undefined ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      <Loader />
                    </td>
                  </tr>
                ) :
                  <tbody>
                    {paymentList.length > 0 ? (
                      paymentList.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="whitespace-normal">
                              <p
                                className={`text-blue-60 ${item.status === 0
                                  ? 'md:text-yellow-600'
                                  : 'md:text-green-600'
                                  }`}
                              >
                                {item.status === 0 ? 'Pending' :item.status === 1 ? 'Paid': item.status === 2 ? 'Canceled':'Refund'}
                              </p>
                            </td>
                            <td className="whitespace-normal">
                              {typeof item.case_name == 'string' ? item.case_name : <>{item.case_name[0]}
                                <span className="block">vs</span>
                                {item.case_name[1]}</>}
                            </td>
                            <td className="whitespace-normal">
                              {item.deponent_name ? item.deponent_name : '--'}
                            </td>
                            <td className="whitespace-normal">{item?.payee}</td>
                            <td className="whitespace-normal">{`$${item?.amount}`}</td>
                            <td className="whitespace-normal">
                              {item?.refund_policy}
                            </td>
                            <td className="whitespace-normal">
                              {item?.received_date}
                            </td>
                            <td className="whitespace-normal">
                              {item?.due_date}
                            </td>
                          </tr>
                        );
                      })
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
      </div>
      {paymentcount > 10 && (
        <div className="table-meta-wrap">
          {paymentcount > 19 && (
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

                    {paymentcount > 49 && (
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
              {startpagecount}-{endpagecount} of {paymentcount}
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
              disabled={endpagecount === paymentcount}
              onClick={handlenext}
            >
              <Image src={nexticon} alt="" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Paymenthistorymanagementtable;
