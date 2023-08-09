'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import downicon from '../../../../../assets/images/icons/chevron-down-icon.svg';
import calendericon from '../../../../../assets/images/icons/calender-icon.svg';
import closeicon from '../../../../../assets/images/icons/close-icon.svg';
import { getFormattedDate, getdaysbetween } from '@/helpers/mischelper';
import Calendar from 'react-calendar';
const NotificationSearchbar = ({ handleSearchvalue,data }) => {
  const [startcalendar, setstartcalendar] = useState(false);
  const [endcalendar, setendcalendar] = useState(false);
  const [startcalendarvalue, setstartcalendarvalue] = useState('');
  const [startcalendarerror, setstartcalendarerror] = useState("");
  const [endcalendarerror, setendcalendarerror] = useState("");
  const [endcalendarvalue, setendcalendarvalue] = useState('');
  const [search, setsearch] = useState(true);
  const [searchvalue, setsearchvalue] = useState('');
  const [status, setstatus] = useState(false);
  const [statusvalue, setstatusvalue] = useState(2);
  const handleStatus = (number) => {
    setstatus(false);
    setstatusvalue(number);
  };
  const handleStartdate = (e) => {
    if (endcalendarvalue ==="" ) {
      setstartcalendarvalue(new Date(e).toISOString());
    setstartcalendar(false);
    setstartcalendarerror("")
    setendcalendarerror("")
    }
    else if(endcalendarvalue !=="" && getdaysbetween(new Date(e).toISOString(), endcalendarvalue) < 0){
      setstartcalendarvalue(new Date(e).toISOString());
      setstartcalendar(false);
      setstartcalendarerror("")
      setendcalendarerror("")
    }
    else {
      setstartcalendarerror("Start date can't be greater than end date")
    } 
    
  };
  const handleEnddate = (e) => {
    if (startcalendarvalue ==="" ) {
      setendcalendarvalue(new Date(e).toISOString());
    setendcalendar(false);
    setstartcalendarerror("")
    setendcalendarerror("")
    }
    else if(startcalendarvalue !=="" && getdaysbetween(new Date(e).toISOString(), startcalendarvalue) > 0){
      setendcalendarvalue(new Date(e).toISOString());
    setendcalendar(false);
    setstartcalendarerror("")
    setendcalendarerror("")
    }
    else {
      setendcalendarerror("End date can't be smaller than start date")
    } 
  };
  const handleSearch = () => {
    if((startcalendarvalue ==="" && endcalendarvalue ==="") ||(startcalendarvalue !=="" && endcalendarvalue !=="")){
        let value = {
            search: searchvalue,
            startdate: startcalendarvalue,
            enddate: endcalendarvalue,
            status: statusvalue,
            searchcondition: search,
          };
          handleSearchvalue(value);
    }
   if(startcalendarvalue !=="" && endcalendarvalue ===""){
    setendcalendarerror("End date can't be empty")
   }
   if(startcalendarvalue ==="" && endcalendarvalue !==""){
    setstartcalendarerror("Start date can't be empty")
   }
  };
 
  const handlestartclose = () => {
    setstartcalendarvalue('');
  };
  const handleendclose = () => {
    setendcalendarvalue('');
  };
  return (
    <div className="m-card-search mb-4">
      <div className="flex items-start gap-4">
         
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
              <div className="select-dropdown col-span-1">
                <button
                  role="button"
                  data-value=""
                  className="select-dropdown__button"
                  onClick={() => setstatus(!status)}
                >
                  <span>
                    {statusvalue === 0
                      ? 'Read'
                      : statusvalue === 1
                        ? 'Unread'
                        : statusvalue === 2
                        ? 'All'
                        : 
                        statusvalue === 3
                        ? 'Case Edit'
                        :  statusvalue === 4
                        ? 'Case Request'
                        :
                        statusvalue === 5
                        ? 'Deposition Edit'
                        :
                        statusvalue === 6
                        ? 'Deposition Request'
                        :statusvalue === 7
                        ? 'Cancellation & Refund'
                        :statusvalue === 8
                        ? 'Payment History'
                        :
                        statusvalue === 9
                        ? 'Transcript'
                        : statusvalue===10?'Deposition Cancel'
                        :'Zoom Link'

                        }
                  </span>
                  <Image src={downicon} className="i-chevron-down" alt="" />
                </button>
                {status && (
                  <ul className="absolute z-50 !w-full bg-white border border-solid border-gray-300 border-t-0 rounded-br rounded-bl">
                    <li
                      data-value="1"
                      className="select-dropdown__list-item"
                      onClick={() => handleStatus(0)}
                    >
                      Read
                    </li>
                    <li
                      data-value="2"
                      className="select-dropdown__list-item"
                      onClick={() => handleStatus(1)}
                    >
                      Unread
                    </li>
                    {(data?.user?.role_id ==="3" || data?.user?.role_id ==="6"
                    
                    ) &&
                    <li
                      data-value="2"
                      className="select-dropdown__list-item"
                      onClick={() => handleStatus(3)}
                    >
                      Case Edit
                    </li>
                    }
                    {(data?.user?.role_id ==="3" || data?.user?.role_id ==="6") &&
                     <li
                     data-value="2"
                     className="select-dropdown__list-item"
                     onClick={() => handleStatus(4)}
                   >
                     Case Request
                   </li>
                    
                    }
                   {(data?.user?.role_id ==="3" || data?.user?.role_id ==="6") && 
 <li
 data-value="2"
 className="select-dropdown__list-item"
 onClick={() => handleStatus(5)}
>
 Deposition Edit
</li>
                   
                   }
                   
                    <li
                      data-value="2"
                      className="select-dropdown__list-item"
                      onClick={() => handleStatus(6)}
                    >
                      Deposition Request
                    </li>
                    <li
                      data-value="2"
                      className="select-dropdown__list-item"
                      onClick={() => handleStatus(7)}
                    >
                      Cancellation & Refund
                    </li>
                    <li
                      data-value="2"
                      className="select-dropdown__list-item"
                      onClick={() => handleStatus(8)}
                    >
                      Payment History
                    </li>
                    {(data?.user?.role_id ==="3" || data?.user?.role_id ==="6" ||
                    data?.user?.role_id==="8" || data?.user?.role_id ==="4" ) && 
                    <li
                    data-value="2"
                    className="select-dropdown__list-item"
                    onClick={() => handleStatus(9)}
                  >
                    Transcript
                  </li>
                    
                    }
                    {(data?.user?.role_id ==="3" || data?.user?.role_id ==="6") && 
                      <li
                      data-value="2"
                      className="select-dropdown__list-item"
                      onClick={() => handleStatus(10)}
                    >
                      Deposition Cancel
                    </li>
                    
                    
                    }
                  
                      <li
                      data-value="2"
                      className="select-dropdown__list-item"
                      onClick={() => handleStatus(11)}
                    >
                      Zoom Link
                    </li>
                    <li
                      data-value="2"
                      className="select-dropdown__list-item"
                      onClick={() => handleStatus(2)}
                    >
                      All
                    </li>
                  </ul>
                )}
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
                        placeholder="Start date"
                        value={
                          startcalendarvalue !== ''
                            ? getFormattedDate(startcalendarvalue)
                            : ''
                        }
                        readOnly
                        // onChange={(e)=>setsearchvalue(e.target.value)}
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
                          onClick={() => setstartcalendar(!startcalendar)}
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
                  <span className="text-red-700 text-[15px]">
                    {startcalendarerror}
                  </span>
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
                          onClick={() => setendcalendar(!endcalendar)}
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
                  <span className="text-red-700 text-[15px]">
                    {endcalendarerror}
                  </span>
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
                onClick={handleSearch}
              >
               Search
              </button>
            
            </div>
          
        
      </div>
    </div>
  );
};

export default NotificationSearchbar;
