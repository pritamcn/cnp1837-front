import moment from 'moment';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const DashboardSearch = ({ onSubmit }) => {
    const [startdate, setStartdate] = useState('');
    const [enddate, setEnddate] = useState('');

    const onSubmitHandler = (evt) => {
        evt.preventDefault();
        let stratvalue = moment(startdate);
        let endvalue = moment(enddate);
        if (endvalue.diff(stratvalue) >= 0) {
            onSubmit({ startdate, enddate })
        } else {
            toast.error('The end date is always greater than the start date');
        }
    }

    return (
        <form
            action=""
            className="rounded-xl bg-[#FFFAF2] mt-[1.125rem]"
        >
            <div className="flex items-center gap-[0.875rem]">
                <label className="whitespace-nowrap text-[#686E80] text-[0.8125rem] font-normal">
                    Filter By
                </label>
                <input
                    type="date"
                    placeholder="Start Date"
                    className="input input-bordered w-full rounded bg-white focus:outline-none text-[0.9375rem]"
                    value={startdate}
                    onChange={(e) => setStartdate(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="End Date"
                    className="input input-bordered w-full rounded bg-white focus:outline-none text-[0.9375rem]"
                    disabled={startdate === ''}
                    min={startdate}
                    value={startdate === '' ? '' : enddate}
                    onChange={(e) => setEnddate(e.target.value)}
                />
                <button
                    type="button"
                    className="primary-btn !min-w-[6.0625rem]"
                    onClick={(e) => onSubmitHandler(e)}
                >
                    Apply
                </button>
            </div>
        </form>
    )
}

export default DashboardSearch;