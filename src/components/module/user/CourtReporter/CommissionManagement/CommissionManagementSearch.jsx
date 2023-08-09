import React, { useState } from 'react';

const CommissionManagementSearch = ({ searchHandler }) => {

    const [searchValue, setSearchValue] = useState('');

    const handleSearch = () => {
        searchHandler(searchValue);
    }

    return (
        <div className='flex gap-4 items-center'>
            <div className='w-auto'>
                <label htmlFor="search-form" className='m-card-input-label'>Search:</label>
            </div>
            <div className='w-full'>
                <input type="text" placeholder='Name' id='search-form' className='form-control' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
            </div>

            <div className="flex flex-col justify-end">
                <button
                    type="button"
                    className="primary-btn cursor-pointer !h-[2.625rem] flex items-center justify-center !p-0"
                    onClick={() => handleSearch()}
                >
                    Search
                </button>
            </div>
        </div>
    )
}

export default CommissionManagementSearch;