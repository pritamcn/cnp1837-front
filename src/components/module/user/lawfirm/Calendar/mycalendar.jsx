'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import JsFileDownloader from 'js-file-downloader';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useSWRMutation from 'swr/mutation';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { useParams } from 'next/navigation';
import { WithTokenPostApi } from '@/services/module/api/postapi';
import EventDetailsModal from '../Modal/EventdetailsModal';
import { Url } from '@/config';
moment.locale('en-GB');
const localizer = momentLocalizer(moment);
export default function MyCalendarComponent({ userid }) {
  const [eventsData, setEventsData] = useState([]);
  const [eventtype, seteventtype] = useState("");
  const [clickdepoid, setclickdepoid] = useState("");
  // const [starttime, setstarttime] = useState("");
  const params = useParams()
  const [modalIsOpen, setIsOpen] = useState(false);
  const [year, setyear] = useState(new Date().getFullYear());
  const [month, setmonth] = useState(new Date().getMonth());
  const axiosAuth = useAxiosAuth();

  const {
    trigger: eventtrigger,
    isMutating,
    data: eventdata,
  } = useSWRMutation(
    `/calendar/eventMonthDetailsForUsers/${userid}`,
    WithTokenPostApi
  );

  const {
    trigger: exporttrigger,
    data: exportdata
  } = useSWRMutation(
    `/calendar/export`,
    WithTokenPostApi
  );

  useEffect(() => {
    if (eventdata?.status === 200) {
      let data = eventdata?.data?.map((time) => {
        let startdate = new Date(time.start);
        let enddate = new Date(time.end)
        return {
          start: new Date(startdate.getFullYear(), startdate.getMonth(), startdate.getDate(), startdate.getHours(), startdate.getMinutes()),
          end: new Date(enddate.getFullYear(), enddate.getMonth(), enddate.getDate(), enddate.getHours(), enddate.getMinutes()),
          allDay: time.allDay,
          title: time.title,
          //title:time.title ==="Unavailable" || time.title==="Not Available"? "":time.title,
          user_id: time.user_id,
          deposition_id: time?.deposition_id
        }
      })
      setEventsData(data)
    }
  }, [eventdata]);
  const handleSelect = ({ start, end }) => {
    
  };
  useEffect(() => {
    if (userid !== "") {
      let payload = {
        year,
        month,
        userIds: [userid],
      };
      eventtrigger({ payload, axios: axiosAuth });
    }
  }, [userid]);

  const eventPropGetter = (event, start, end, isSelected) => {
    let newStyle = {
      backgroundColor: 'lightblue',
      color: 'black',
      borderRadius: '0px',
      border: 'none',
    };

    if (event.title === 'Unavailable') {
      newStyle.backgroundColor = 'lightgrey'
      newStyle.color = 'lightgrey'
    };
    if (event.title === 'Holiday') {
      newStyle.backgroundColor = '#e090ee';
    }
    if (event.title === 'Not Available') {
      newStyle.backgroundColor = 'lightgrey'
      newStyle.color = 'lightgrey'
    }

    return {
      className: '',
      style: newStyle,
    };
  };

  const onNavigate = (newDate, view, action) => {
    if (newDate.getMonth() !== month) {
      setmonth(newDate.getMonth())
      let payload = {
        year,
        month: newDate.getMonth(),
        userIds: [userid]
      };
      eventtrigger({ payload, axios: axiosAuth });
    }
    if (newDate.getFullYear() !== year) {
      setyear(newDate.getFullYear())
      let payload = {
        year: newDate.getFullYear(),
        month,
        userIds: [userid]
      };
      eventtrigger({ payload, axios: axiosAuth });
    }
  };
  // function openModal() {
  //   setIsOpen(true);
  //   seteventtype("");
  //   setclickdepoid(params.id)
  // }
  function closeModal() {
    setIsOpen(false);
  }
  const handleEvent = (e) => {
    setclickdepoid(e?.deposition_id)
    seteventtype(e.title)
    setIsOpen(true)
  }

  const exportDataHandler = () => {
    exporttrigger({ axios: axiosAuth });
  }

  useEffect(() => {
    if (exportdata?.status === 200) {
      if (exportdata?.data?.filePath != '')
        onDownloadHandler(Url + "" + exportdata?.data?.filePath);
    }
  }, [exportdata]);

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

      <div className="flex items-center justify-between min-h-12 mb-6">
        <h2 className="c-page-title !mb-0">Calendar</h2>
        <div className="flex items-center justify-end gap-5">
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
          <button type="button" onClick={exportDataHandler} className="primary-btn">
            Export
          </button>
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
      {modalIsOpen && (eventtype !== "Unavailable" && eventtype !== "Not Available" && eventtype !== "Holiday") &&
        <EventDetailsModal
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          clickdepoid={clickdepoid}
          axiosAuth={axiosAuth}
        />
      }

    </>
  );
}
