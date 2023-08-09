"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import previcon from '../../../../../assets/images/icons/table-grey-prev-icon.svg';
import nexticon from '../../../../../assets/images/icons/table-grey-next-icon.svg';
import soliddownicon from '../../../../../assets/images/icons/grey-solid-down-icon.svg';
import AscendingIcon from '../../../../../assets/images/case-management/ascending-icon.svg';
import DecendingIcon from '../../../../../assets/images/case-management/decending-icon.svg';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import CommissionManagementSearch from './CommissionManagementSearch';
import Loader from '../Loader';

const CommissionManagementTable = () => {

    const axiosAuth = useAxiosAuth();
    const [commissionList, setCommissionList] = useState([]);
    const [commissionCount, setCommissionCount] = useState(0);
    const [startpagecount, setstartpagecount] = useState(1);
    const [searchvalue, setSearchvalue] = useState('');
    const [endpagecount, setendpagecount] = useState(10);
    const [sortName, setSortName] = useState('total_count');
    const [asc, setAsc] = useState('ASC');
    const [row, setrow] = useState(false);
    const [rowvalue, setrowvalue] = useState(10);

    const { mutate, data: gettranscriptiondata, isLoading } = useSWR(
        [
            `/transcript/getTranscriptCommissionList?startCount=${startpagecount}&endCount=${endpagecount}&search=${searchvalue}&sort_name=${sortName}&sort_order=${asc}`,
            axiosAuth,
        ],
        ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
        {
            revalidateOnFocus: false,
        }
    );

    useEffect(() => {
        if (gettranscriptiondata?.status === 200) {

            let modifyData = gettranscriptiondata?.data?.data.map((item) => {
                return {
                    id: item?.user_id,
                    depo_id: item?.transcription?.deposition_id,
                    deponent_name: item?.transcription?.case_deposition?.deponent_name,
                    version: item?.transcription?.version,
                    name: item?.user?.first_name + ' ' + item?.user?.last_name,
                    role: item?.user?.role?.role,
                    total_commission: item?.total_commission,
                    total_count: item?.total_count
                }
            })

            setCommissionList(modifyData);
            setCommissionCount(gettranscriptiondata?.data?.totalCount);
        }
    }, [gettranscriptiondata]);

    const handleprev = () => {
        if (startpagecount < commissionCount - rowvalue && startpagecount !== 1) {
            setstartpagecount((prev) => prev - rowvalue);
            setendpagecount((prev) => prev - rowvalue);
            window.scroll(40, 40)
        } else if (startpagecount < commissionCount || startpagecount === commissionCount) {
            let temppagecount = startpagecount - rowvalue;
            let temppage2count = temppagecount + (rowvalue - 1);
            setstartpagecount(temppagecount);
            setendpagecount(temppage2count);
            window.scroll(40, 40)
        }
    };

    const handlenext = () => {
        if (endpagecount < commissionCount - rowvalue) {
            setstartpagecount((prev) => prev + rowvalue);
            setendpagecount((prev) => prev + rowvalue);
        } else if (endpagecount < commissionCount) {
            setstartpagecount((prev) => prev + rowvalue);
            setendpagecount(commissionCount);
        }
    };

    const handleRow = (number) => {
        setrowvalue(number);
        setstartpagecount(1);
        setendpagecount(number);
        setrow(false);
    };

    const handlesort = (sort, condition) => {
        setAsc(condition);
        setSortName(sort);
        setstartpagecount(1);
        setendpagecount(rowvalue);
    };

    const searchHandler = (value) => {
        setSearchvalue(value);
    }

    return (
        <>
            <div className='m-card p-5'>
                <form action="">
                    <div className='m-card-search mb-4'>
                        <CommissionManagementSearch searchHandler={searchHandler} />
                    </div>
                </form>
                <div className='m-card-table'>
                    <div className='c-table'>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Deponent Name</th>
                                        <th>Name</th>
                                        <th>Role</th>
                                        <th>Version</th>
                                        <th>Downloads
                                            <button
                                                className="ml-1"
                                                type="button"
                                                onClick={() => handlesort('total_count', 'ASC')}
                                            >
                                                <span
                                                    className={`w-3 overflow-hidden flex items-center justify-center
                    ${sortName === 'total_count' && asc === 'ASC'
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
                                                onClick={() => handlesort('total_count', 'DESC')}
                                            >
                                                <span
                                                    className={`w-3 overflow-hidden flex items-center justify-center
                    ${sortName === 'total_count' && asc === 'DESC'
                                                            ? 'bg-blue-200'
                                                            : null
                                                        }`}
                                                >
                                                    <Image src={DecendingIcon} alt="Decending icon" />
                                                </span>
                                            </button>
                                        </th>
                                        <th>Transcription Fee ($)
                                            <button
                                                className="ml-1"
                                                type="button"
                                                onClick={() => handlesort('total_commission', 'ASC')}
                                            >
                                                <span
                                                    className={`w-3 overflow-hidden flex items-center justify-center
                    ${sortName === 'total_commission' && asc === 'ASC'
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
                                                onClick={() => handlesort('total_commission', 'DESC')}
                                            >
                                                <span
                                                    className={`w-3 overflow-hidden flex items-center justify-center
                    ${sortName === 'total_commission' && asc === 'DESC'
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
                                {isLoading || gettranscriptiondata === undefined ? (
                                    <tr>
                                        <td colSpan={6} className="text-center">
                                            <Loader />
                                        </td>
                                    </tr>) :
                                    <tbody>
                                        {
                                            commissionList.length > 0 ? commissionList.map((item, itemIndex) => {
                                                return <tr key={itemIndex}>
                                                    <td>{item?.deponent_name ? item?.deponent_name : '--'}</td>
                                                    <td>{item?.name}</td>
                                                    <td>{item?.role}</td>
                                                    <td>{item?.total_count}</td>
                                                    <td>{item?.version}</td>
                                                    <td>{item?.total_commission}</td>
                                                </tr>
                                            }) : (
                                                <tr>
                                                    <td colSpan={6} className="text-center">
                                                        Sorry no data found
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                }
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {commissionCount > 10 && (
                <div className="table-meta-wrap">
                    {commissionCount > 19 && (
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

                                        {commissionCount > 49 && (
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
                            {startpagecount}-{endpagecount} of {commissionCount}
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
                            disabled={endpagecount === commissionCount}
                            onClick={handlenext}
                        >
                            <Image src={nexticon} alt="" />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default CommissionManagementTable;