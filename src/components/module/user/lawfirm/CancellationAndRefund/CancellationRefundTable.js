"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import previcon from '../../../../../assets/images/icons/table-grey-prev-icon.svg';
import nexticon from '../../../../../assets/images/icons/table-grey-next-icon.svg';
import soliddownicon from '../../../../../assets/images/icons/grey-solid-down-icon.svg';
import previewcaseicon from '../../../../../assets/images/icons/preview-case-icon.svg';
import MoreVeticalIcon from '../../../../../assets/images/chat/more-vertical-icon.svg';
import {
    WithTokenGetApi,
} from '@/services/module/api/getapi';
import useSWR from 'swr';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import AscendingIcon from '../../../../../assets/images/case-management/ascending-icon.svg';
import DecendingIcon from '../../../../../assets/images/case-management/decending-icon.svg';
import CancellationRefundSearch from './CancellationRefundSearch';
import moment from 'moment';
import Loader from '../Loader';

const CancellationRefundTable = () => {

    const axiosAuth = useAxiosAuth();
    const [caselist, setcaselist] = useState([]);
    const [casecount, setcasecount] = useState(0);
    const [startpagecount, setstartpagecount] = useState(1);
    const [endpagecount, setendpagecount] = useState(10);
    const [row, setrow] = useState(false);
    const [rowvalue, setrowvalue] = useState(10);
    const [searchvalue, setSearchvalue] = useState('');
    const [sortName, setSortName] = useState('due_date');
    const [asc, setAsc] = useState('DESC');
    const [status, setstatus] = useState(5);
    const [startdatevalue, setstartdatevalue] = useState('');
    const [enddatevalue, setenddatevalue] = useState('');

    const { data: getcasedata, isLoading } = useSWR(
        [
            `/payment/getAttorneyPaymentList?deponent_name=${searchvalue}&startCount=${startpagecount}&endCount=${endpagecount}&sort_order=${asc}&sort_name=${sortName}&startDate=${startdatevalue}&endDate=${enddatevalue}&status=${status}`,
            axiosAuth,
        ],
        ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
        {
            revalidateOnFocus: false,
        }
    );

    useEffect(() => {
        if (getcasedata?.status === 200 && getcasedata?.data?.data?.length > 0) {
            setcaselist(getcasedata?.data?.data);
            setcasecount(getcasedata?.data?.totalCount);
        }
        if (getcasedata?.status === 200 && getcasedata?.data?.data?.length === 0) {
            setcaselist([]);
            setcasecount(0);
        }
    }, [getcasedata]);

    const handleRow = (number) => {
        setrowvalue(number);
        setstartpagecount(1);
        setendpagecount(number);
        setrow(false);
    };

    const handleprev = () => {
        if (startpagecount < casecount - rowvalue && startpagecount !== 1) {
            setstartpagecount((prev) => prev - rowvalue);
            setendpagecount((prev) => prev - rowvalue);
            window.scroll(40, 40);
        } else if (startpagecount < casecount || startpagecount === casecount) {
            let temppagecount = startpagecount - rowvalue;
            let temppage2count = temppagecount + (rowvalue - 1);
            setstartpagecount(temppagecount);
            setendpagecount(temppage2count);
            window.scroll(40, 40);
        }
    };

    const handlenext = () => {
        if (endpagecount < casecount - rowvalue) {
            setstartpagecount((prev) => prev + rowvalue);
            setendpagecount((prev) => prev + rowvalue);
        } else if (endpagecount < casecount) {
            setstartpagecount((prev) => prev + rowvalue);
            setendpagecount(casecount);
        }
    };

    const searchHandler = (value) => {
        if (value?.searchcondition === true) {
            setSearchvalue(value?.search);
            setenddatevalue('');
            setstartdatevalue('');
            setstatus(5);
        } else {
            setenddatevalue(
                value?.enddate === '' ? '' : moment(value?.enddate).format('YYYY-MM-DD')
            );
            setstartdatevalue(
                value?.startdate === '' ? '' : moment(value?.startdate).format('YYYY-MM-DD')
            );
            setstatus(value?.status);
            setSearchvalue('');
        }
        setstartpagecount(1);
        setendpagecount(rowvalue);
        setSortName('deponent_name');
        setAsc('ASC');
    }

    const handlesort = (sort, condition) => {
        setAsc(condition);
        setSortName(sort);
        setstartpagecount(1);
        setendpagecount(rowvalue);
    };

    return (
        <>
            <div className='m-card p-5'>
                <form action="">
                    <div className='m-card-search mb-4'>
                        <CancellationRefundSearch searchHandler={searchHandler} />
                    </div>
                </form>
                <div className='m-card-table'>
                    <div className='c-table'>
                        <div className="overflow-visible">
                            <table className="table w-full">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th className='w-2/12'>Deponent Name
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
                                        <th className='w-1/6'>Date
                                            <button
                                                className="ml-1"
                                                type="button"
                                                onClick={() => handlesort('due_date', 'ASC')}
                                            >
                                                <span
                                                    className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'due_date' && asc === 'ASC'
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
                                                onClick={() => handlesort('due_date', 'DESC')}
                                            >
                                                <span
                                                    className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'due_date' && asc === 'DESC'
                                                            ? 'bg-blue-200'
                                                            : null
                                                        }`}
                                                >
                                                    <Image src={DecendingIcon} alt="Decending icon" />
                                                </span>
                                            </button>
                                        </th>
                                        <th className='w-1/6'>Status</th>
                                        <th className='w-1/6'>Refund Amount ($)</th>
                                    </tr>
                                </thead>
                                {isLoading || getcasedata === undefined ? (
                                    <tr>
                                        <td colSpan={6} className="text-center">
                                            <Loader />
                                        </td>
                                    </tr>) :
                                    <tbody>
                                        {caselist?.length > 0 ? (caselist.map((item, index) => {
                                            return <tr key={index}>
                                                <td>
                                                    {item?.case_deposition?.deponent_name ? item?.case_deposition?.deponent_name : '--'}
                                                </td>

                                                <td>
                                                    {item?.due_date ? moment(item?.due_date).subtract(2, 'day').format('MM/DD/YYYY HH:MM') : '--'}
                                                </td>

                                                <td>
                                                    {item?.status ? item?.status == '3' ? 'Refund' : 'Cancel' : '--'}
                                                </td>

                                                <td>
                                                    {item?.amount ? item?.amount : '--'}
                                                </td>

                                            </tr>
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
            {/* Pagination start */}
            {casecount > 10 && (
                <div className="table-meta-wrap">
                    {casecount > 19 && (
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

                                        {casecount > 49 && (
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
                            {startpagecount}-{endpagecount} of {casecount}
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
                            disabled={endpagecount === casecount}
                            onClick={handlenext}
                        >
                            <Image src={nexticon} alt="" />
                        </button>
                    </div>
                </div>
            )}
            {/* Pagination end */}
            {/* {casemodal !== '' && (
                <CaseReviewDetailsModal
                    handlechange={handlechange}
                    caseid={casemodal}
                    axiosAuth={axiosAuth}
                />
            )} */}
        </>
    )
}

export default CancellationRefundTable;