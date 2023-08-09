"use client";
import React, { useState } from 'react';
import calendericon from '../../../../../assets/images/icons/calender-icon.svg';
import closeicon from '../../../../../assets/images/icons/close-icon.svg';
import Image from 'next/image';
import Calendar from 'react-calendar';
import { getFormattedDate } from '@/helpers/mischelper';

const CaseReviewSearch = ({ searchHandler }) => {
    const [startcalendar, setstartcalendar] = useState(false);
    const [search, setsearch] = useState(true);
    const [endcalendar, setendcalendar] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [startcalendarvalue, setstartcalendarvalue] = useState('');
    const [endcalendarvalue, setendcalendarvalue] = useState('');

    const handleSearch = () => {
        searchHandler({ searchValue, startcalendarvalue, endcalendarvalue });
    }

    const handleStartdate = (e) => {
        setstartcalendarvalue(new Date(e).toISOString());
        setstartcalendar(false);
    };
    const handleEnddate = (e) => {
        setendcalendarvalue(new Date(e).toISOString());
        setendcalendar(false);
    };

    const handleAdvance = (e) => {
        e.preventDefault();
        setsearch(false);
        setSearchValue('')
    };

    const handleClear = () => {
        setsearch(true);
        setendcalendarvalue('');
        setstartcalendarvalue('');
    };

    const handlestartclose = () => {
        setstartcalendarvalue('');
    };

    const handleendclose = () => {
        setendcalendarvalue('');
    };

    return (
        <>
            <div className='flex items-start gap-4'>
                {search ? (
                    <>
                        <div className='w-full'>
                            <input type="text" placeholder='Case name' id='search-form' className='form-control' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                        </div>

                        <div className="flex flex-col justify-end">
                            <button
                                type="button"
                                className="primary-btn cursor-pointer !h-[2.625rem] flex items-center justify-center !p-0"
                                onClick={() => handleSearch()}
                            >
                                Search
                            </button>
                            <button
                                type='button'
                                className="advance-filter-btn !gap-0"
                                onClick={(e) => handleAdvance(e)}
                            >
                                Advance Search
                            </button>
                        </div>
                    </>) : (<>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
                            <div className="select-dropdown col-span-1">
                                <div
                                    data-value=""
                                    className="select-dropdown__button flex items-center !p-0"
                                >
                                    <span className="flex items-center flex-1 h-full relative">
                                        <input
                                            type="text"
                                            id="search-form"
                                            className="form-control !h-full"
                                            placeholder="Start date"
                                            value={
                                                startcalendarvalue !== ''
                                                    ? getFormattedDate(startcalendarvalue)
                                                    : ''
                                            }
                                            readOnly
                                            onChange={(e) => setsearchvalue(e.target.value)}
                                        />
                                        <div className="absolute top-2/4 right-0 -translate-y-2/4 flex items-center gap-2">
                                            <button
                                                className="p-[0.6875rem] w-[2.1875rem] overflow-hidden pr-0"
                                                onClick={handlestartclose}
                                                disabled={startcalendarvalue === ''}
                                            >
                                                <Image
                                                    src={closeicon}
                                                    className="w-full h-auto"
                                                    alt="close"
                                                />
                                            </button>
                                            <button
                                                className="p-[0.6875rem] w-[2.1875rem] overflow-hidden pl-0"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setstartcalendar(!startcalendar)
                                                }}
                                            >
                                                <Image
                                                    src={calendericon}
                                                    alt=""
                                                    className="w-full h-auto"
                                                />
                                            </button>
                                        </div>
                                    </span>
                                </div>
                                {startcalendar ? (
                                    <Calendar
                                        name="start"
                                        onChange={(e) => {
                                            handleStartdate(e);
                                        }}
                                        className="absolute z-50 !w-full"
                                    />
                                ) : null}
                            </div>
                            <div className="select-dropdown col-span-1">
                                <div
                                    data-value=""
                                    className="select-dropdown__button flex items-center !p-0"
                                >
                                    <span className="flex items-center flex-1 h-full relative">
                                        <input
                                            type="text"
                                            id="search-form"
                                            className="form-control !h-full"
                                            placeholder="End date"
                                            value={
                                                endcalendarvalue !== ''
                                                    ? getFormattedDate(endcalendarvalue)
                                                    : ''
                                            }
                                            readOnly
                                        />
                                        <div className="absolute top-2/4 right-0 -translate-y-2/4 flex items-center gap-2">
                                            <button
                                                className="p-[0.6875rem] w-[2.1875rem] overflow-hidden pr-0"
                                                onClick={handleendclose}
                                                disabled={endcalendarvalue === ''}
                                            >
                                                <Image
                                                    src={closeicon}
                                                    className="w-full h-auto"
                                                    alt="close"
                                                />
                                            </button>
                                            <button
                                                className="p-[0.6875rem] w-[2.1875rem] overflow-hidden pl-0"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setendcalendar(!endcalendar);
                                                }}
                                            >
                                                <Image
                                                    src={calendericon}
                                                    alt=""
                                                    className="w-full h-auto"
                                                />
                                            </button>
                                        </div>
                                    </span>
                                </div>
                                {endcalendar ? (
                                    <Calendar
                                        name="start"
                                        onChange={(e) => {
                                            handleEnddate(e);
                                        }}
                                        className="absolute z-50 !w-full"
                                    />
                                ) : null}
                            </div>
                        </div>
                        <div className="flex flex-col justify-end">
                            <button
                                type="button"
                                className="primary-btn cursor-pointer !h-[2.625rem] flex items-center justify-center !py-0"
                                onClick={() => handleSearch()}
                            >
                                Advanced Search
                            </button>
                            <button
                                className="advance-filter-btn !gap-0"
                                onClick={handleClear}
                            >
                                Clear
                            </button>
                        </div>
                    </>)
                }
            </div>
        </>
    )
}

export default CaseReviewSearch;