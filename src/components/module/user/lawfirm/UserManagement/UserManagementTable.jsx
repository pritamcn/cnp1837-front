"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import previcon from '../../../../../assets/images/icons/table-grey-prev-icon.svg';
import nexticon from '../../../../../assets/images/icons/table-grey-next-icon.svg';
import soliddownicon from '../../../../../assets/images/icons/grey-solid-down-icon.svg';
import addicon from '../../../../../assets/images/icons/white-add-icon.svg';
import editactionbtn from '../../../../../assets/images/icons/edit-action-btn.svg';
import AscendingIcon from '../../../../../assets/images/case-management/ascending-icon.svg';
import DecendingIcon from '../../../../../assets/images/case-management/decending-icon.svg';
import MoreVeticalIcon from '../../../../../assets/images/chat/more-vertical-icon.svg';
import CreateUser from '../Modal/CreateUser';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import UserManagementSearch from './UserManagementSearch';
import Loader from '../Loader';

const UserManagementTable = () => {

    const axiosAuth = useAxiosAuth();
    const [userList, setUserList] = useState([]);
    const [usercount, setUserCount] = useState(0);
    const [startpagecount, setstartpagecount] = useState(1);
    const [searchvalue, setSearchvalue] = useState('');
    const [endpagecount, setendpagecount] = useState(10);
    const [sortName, setSortName] = useState('first_name');
    const [asc, setAsc] = useState('asc');
    const [row, setrow] = useState(false);
    const [rowvalue, setrowvalue] = useState(10);
    const [userModalData, setUserModalData] = useState({
        modalStatus: false,
        id: '',
        email: '',
        first_name: '',
        last_name: '',
        password: ''
    });

    const { mutate, data: getuserdata, isLoading } = useSWR(
        [
            `/user/getUsers?search=${searchvalue}&endCount=${endpagecount}&startCount=${startpagecount}&sort_name=${sortName}&sort_order=${asc}`,
            axiosAuth,
        ],
        ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
        {
            revalidateOnFocus: false,
        }
    );

    useEffect(() => {
        if (getuserdata?.status === 200) {
            setUserList(getuserdata?.data?.data);
            setUserCount(getuserdata?.data?.totalCount);
        }
    }, [getuserdata]);

    const handleprev = () => {
        if (startpagecount < usercount - rowvalue && startpagecount !== 1) {
            setstartpagecount((prev) => prev - rowvalue);
            setendpagecount((prev) => prev - rowvalue);
            window.scroll(40, 40)
        } else if (startpagecount < usercount || startpagecount === usercount) {
            let temppagecount = startpagecount - rowvalue;
            let temppage2count = temppagecount + (rowvalue - 1);
            setstartpagecount(temppagecount);
            setendpagecount(temppage2count);
            window.scroll(40, 40)
        }
    };

    const handlenext = () => {
        if (endpagecount < usercount - rowvalue) {
            setstartpagecount((prev) => prev + rowvalue);
            setendpagecount((prev) => prev + rowvalue);
        } else if (endpagecount < usercount) {
            setstartpagecount((prev) => prev + rowvalue);
            setendpagecount(usercount);
        }
    };

    const handleRow = (number) => {
        setrowvalue(number);
        setstartpagecount(1);
        setendpagecount(number);
        setrow(false);
    };

    const handlemodal = (type, item) => {
        if (type === 'add') {
            setUserModalData({
                modalStatus: true,
                id: '',
                email: '',
                first_name: '',
                last_name: '',
                password: ''
            });
        } else {
            setUserModalData({
                modalStatus: true,
                id: item?.id,
                email: item?.email,
                first_name: item?.first_name,
                last_name: item?.last_name,
                password: ''
            });
        }
    };

    const handlesort = (sort, condition) => {
        setAsc(condition);
        setSortName(sort);
        setstartpagecount(1);
        setendpagecount(rowvalue);
    };

    const handlechange = () => {
        setUserModalData({
            modalStatus: false,
            id: '',
            email: '',
            first_name: '',
            last_name: '',
            password: ''
        });
        mutate();
    };

    const searchHandler = (value) => {
        setSearchvalue(value);
    }

    return (
        <>
            <div className='p-title-flex flex items-center justify-between flex-wrap mb-6'>
                <h2 className='c-page-title'>User Management</h2>
                <label htmlFor="create-user" onClick={() => handlemodal('add', 0)} className="primary-btn cursor-pointer"><Image src={addicon} alt="" /> Add User</label>
            </div>
            <div className='m-card p-5'>
                <form action="">
                    <div className='m-card-search mb-4'>
                        <UserManagementSearch searchHandler={searchHandler} />
                    </div>
                </form>
                <div className='m-card-table'>
                    <div className='c-table'>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th>Actions</th>
                                        <th>First Name <button
                                            className="ml-1"
                                            type="button"
                                            onClick={() => handlesort('first_name', 'asc')}
                                        >
                                            <span
                                                className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'first_name' && asc === 'asc'
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
                                                onClick={() => handlesort('first_name', 'desc')}
                                            >
                                                <span
                                                    className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'first_name' && asc === 'desc'
                                                            ? 'bg-blue-200'
                                                            : null
                                                        }`}
                                                >
                                                    <Image src={DecendingIcon} alt="Decending icon" />
                                                </span>
                                            </button></th>
                                        <th>Last Name<button
                                            className="ml-1"
                                            type="button"
                                            onClick={() => handlesort('last_name', 'asc')}
                                        >
                                            <span
                                                className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'last_name' && asc === 'asc'
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
                                                onClick={() => handlesort('last_name', 'desc')}
                                            >
                                                <span
                                                    className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'last_name' && asc === 'desc'
                                                            ? 'bg-blue-200'
                                                            : null
                                                        }`}
                                                >
                                                    <Image src={DecendingIcon} alt="Decending icon" />
                                                </span>
                                            </button></th>
                                        <th>Email ID <button
                                            className="ml-1"
                                            type="button"
                                            onClick={() => handlesort('email', 'asc')}
                                        >
                                            <span
                                                className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'email' && asc === 'asc'
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
                                                onClick={() => handlesort('email', 'desc')}
                                            >
                                                <span
                                                    className={`w-3 overflow-hidden flex items-center justify-center
                        ${sortName === 'email' && asc === 'desc'
                                                            ? 'bg-blue-200'
                                                            : null
                                                        }`}
                                                >
                                                    <Image src={DecendingIcon} alt="Decending icon" />
                                                </span>
                                            </button></th>
                                    </tr>
                                </thead>
                                {isLoading || getuserdata === undefined ? (
                                    <tr>
                                        <td colSpan={6} className="text-center">
                                            <Loader />
                                        </td>
                                    </tr>
                                ) :
                                    <tbody>
                                        {
                                            userList.length > 0 ? userList.map((item, itemIndex) => {
                                                return <tr key={itemIndex}>
                                                    <td>

                                                        <details className="dropdown">
                                                            <summary
                                                                className="btn !bg-transparent !rounded-none !h-auto outline-none !min-h-0 !p-0 !pr-0 tooltip normal-case"
                                                                data-tip="More"
                                                            >
                                                                <i className="w-[1.125rem] flex items-center justify-center">
                                                                    <Image
                                                                        src={MoreVeticalIcon}
                                                                        alt="More vetical icon"
                                                                        className="w-full h-auto"
                                                                    />
                                                                </i>
                                                            </summary>
                                                            <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box">
                                                                <li className="!p-0 focus:!bg-transparent active:!bg-transparent">
                                                                    <div className="items-center !p-0">

                                                                        <div
                                                                            className="tooltip tooltip-right"
                                                                            data-tip="Edit"
                                                                        >
                                                                            <a>
                                                                                <label
                                                                                    htmlFor='create-user'
                                                                                    onClick={() => handlemodal('edit', item)}
                                                                                    className="w-9 overflow-hidden flex items-center justify-center p-2 flex-[0_0_0.5625rem] cursor-pointer"
                                                                                >
                                                                                    <Image
                                                                                        src={editactionbtn}
                                                                                        alt="View icon"
                                                                                        className="w-full h-auto"
                                                                                    />
                                                                                </label>
                                                                            </a>
                                                                        </div>

                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </details>

                                                    </td>
                                                    <td>{item?.first_name}</td>
                                                    <td>{item?.last_name}</td>
                                                    <td>{item?.email}</td>
                                                </tr>
                                            }) : (
                                                <tr>
                                                    <td colSpan={6} className="p-0">
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
            {/* Pagination start */}
            {usercount > 10 && (
                <div className="table-meta-wrap">
                    {usercount > 19 && (
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

                                        {usercount > 49 && (
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
                            {startpagecount}-{endpagecount} of {usercount}
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
                            disabled={endpagecount === usercount}
                            onClick={handlenext}
                        >
                            <Image src={nexticon} alt="" />
                        </button>
                    </div>
                </div>
            )}
            {/* Pagination end */}



            {userModalData.modalStatus && <>
                <input type="checkbox" id="create-user" className="modal-toggle" />
                <CreateUser userData={userModalData} closeModal={handlechange} />
            </>}
        </>
    )
}

export default UserManagementTable;