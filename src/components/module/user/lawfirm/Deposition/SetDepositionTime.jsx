'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Select, { components } from 'react-select';
import Timemodal from '../Modal/Timemodal';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { useParams } from 'next/navigation';
import { WithTokenPostApi } from '@/services/module/api/postapi';
moment.locale('en-GB');
const localizer = momentLocalizer(moment);

export default function SetDepositionTime({ userid, email }) {
  const [eventsData, setEventsData] = useState([]);
  const [eventtype, seteventtype] = useState('');
  const [clickdepoid, setclickdepoid] = useState('');
  const [user, setuser] = useState([]);
  const [starttime, setstarttime] = useState('');
  const params = useParams();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [year, setyear] = useState(new Date().getFullYear());
  const [month, setmonth] = useState(new Date().getMonth());
  const [userlist, setuserlist] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const axiosAuth = useAxiosAuth();
  const { data: getInviteeData, isLoading } = useSWR(
    [`case/getInviteeUserDetailsByDepositionId/${params.id}`, axiosAuth],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );
  const {
    trigger: eventtrigger,
    isMutating,
    data: eventdata,
  } = useSWRMutation(
    `/calendar/eventMonthDetailsForUsers/${userid}`,
    WithTokenPostApi
  );
  useEffect(() => {
    if (eventdata?.status === 200) {
      let data = eventdata?.data?.map((time) => {
        let startdate = new Date(time.start);
        let enddate = new Date(time.end);
        return {
          start: new Date(
            startdate.getFullYear(),
            startdate.getMonth(),
            startdate.getDate(),
            startdate.getHours(),
            startdate.getMinutes()
          ),
          end: new Date(
            enddate.getFullYear(),
            enddate.getMonth(),
            enddate.getDate(),
            enddate.getHours(),
            enddate.getMinutes()
          ),
          allDay: time.allDay,
          title: time.title,
          //title:time.title ==="Unavailable" || time.title==="Not Available"? "":time.title,
          user_id: time.user_id,
          deposition_id: time?.deposition_id,
        };
      });
      setEventsData(data);
    }
  }, [eventdata]);
  const handleSelect = ({ start, end }) => {
    setstarttime(start);
    openModal();
  };
  useEffect(() => {
    if (getInviteeData?.status === 200) {
      let finaldata = getInviteeData?.data?.map((item) => {
        return {
          value: item.id,
          label:
            item.email === email
              ? 'Me'
              : `${item.first_name} ${item.last_name}(${item.email})`,
        };
      });
      let all = finaldata?.push({ value: 'all', label: 'all' });
      setuserlist(finaldata);
    }
  }, [getInviteeData]);
  const eventPropGetter = (event, start, end, isSelected) => {
    let newStyle = {
      backgroundColor: 'lightblue',
      color: 'black',
      borderRadius: '0px',
      border: 'none',
    };

    if (event.title === 'Unavailable') {
      newStyle.backgroundColor = 'lightgrey';
      newStyle.color = 'lightgrey';
    }
    if (event.title === 'Holiday') {
      newStyle.backgroundColor = '#e090ee';
    }
    if (event.title === 'Not Available') {
      newStyle.backgroundColor = 'lightgrey';
      newStyle.color = 'lightgrey';
    }

    return {
      className: '',
      style: newStyle,
    };
  };

  const onNavigate = (newDate, view, action) => {
    if (newDate.getMonth() !== month) {
      setmonth(newDate.getMonth());
      if (user?.length !== 0) {
        let payload = {
          year,
          month: newDate.getMonth(),
          userIds: user,
        };
        eventtrigger({ payload, axios: axiosAuth });
      }
    }
    if (newDate.getFullYear() !== year) {
      setyear(newDate.getFullYear());
      if (user?.length !== 0) {
        let payload = {
          year: newDate.getFullYear(),
          month,
          userIds: user,
        };
        eventtrigger({ payload, axios: axiosAuth });
      }
    }
  };

  
  function openModal() {
    setIsOpen(true);
    seteventtype('');
    setclickdepoid(params.id);
  }

  // function afterOpenModal() {
  //   // references are now sync'd and can be accessed.
  //   subtitle.style.color = '#f00';
  // }
  const handleSelectoption = (e) => {
    setSelectedOption(e);
    let user = [];
    if (e.value === 'all') {
      let value = userlist?.map((item) => item?.value);
      value.pop();
      user = value;
      setuser(user);
    } else {
      user = [e.value];
      setuser([e.value]);
    }
    let payload = {
      year,
      month,
      userIds: user,
    };
    eventtrigger({ payload, axios: axiosAuth });
  };
  function closeModal() {
    setIsOpen(false);
  }
  const handleEvent = (e) => {
    setclickdepoid(e?.deposition_id);
    seteventtype(e.title);
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between min-h-12 mb-6">
        <h2 className="c-page-title !mb-0">Time set for deposition</h2>
        <div className="flex items-center gap-5">
          <div className="flex items-center">
            <label htmlFor="find-users" className="h5 mr-3">
              Select user:
            </label>
            <Select
              className="s-select w-[18.4375rem] z-50"
              value={selectedOption}
              // defaultValue={selectedOption}
              onChange={(e) => handleSelectoption(e)}
              options={userlist}
            />
          </div>
          <ul className="menu border border-solid bg-white border-gray-300 w-56 rounded-sm p-2">
            <li className="flex-row flex-nowrap items-center justify-between">
              <div className="w-20 h-2 bg-[#e090ee] !rounded-none p-0"></div>
              <div
                className="tooltip hover:bg-transparent p-0"
                data-tip="Holiday"
              >
                <h5 className="truncate max-w-[6.6875rem]">Holiday</h5>
              </div>
            </li>
            <li className="flex-row flex-nowrap items-center justify-between">
              <div className="w-20 h-2 bg-blue-300 !rounded-none p-0"></div>
              <div
                className="tooltip hover:bg-transparent p-0"
                data-tip="Events"
              >
                <h5 className="truncate max-w-[6.6875rem]">Events</h5>
              </div>
            </li>
            <li className="flex-row flex-nowrap items-center justify-between">
              <div className="w-20 h-2 bg-gray-300 !rounded-none p-0"></div>
              <div
                className="tooltip hover:bg-transparent p-0"
                data-tip="Not available"
              >
                <h5 className="truncate max-w-[6.6875rem]">Not available</h5>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <Calendar
        views={['day', 'month', 'week']}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="week"
        events={eventsData}
        style={{ height: '90vh' }}
        // onView={handleViewChange}
        eventPropGetter={eventPropGetter}
        onSelectEvent={handleEvent}
        onSelectSlot={handleSelect}
        onNavigate={onNavigate}
      />
      {modalIsOpen &&
        eventtype !== 'Unavailable' &&
        eventtype !== 'Not Available' &&
        eventtype !== 'Holiday' && (
          <Timemodal
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            depoid={params.id}
            clickdepoid={clickdepoid}
            axiosAuth={axiosAuth}
            starttimechoose={starttime}
          />
        )}
    </>
  );
}
