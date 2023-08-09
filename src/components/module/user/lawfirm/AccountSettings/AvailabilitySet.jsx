'use client';
import Image from 'next/image';
import React from 'react';
import removeicon from './../../../../../assets/images/icons/remove-icon.svg';
import closeicon from './../../../../../assets/images/icons/close-icon.svg';
import addicon from './../../../../../assets/images/icons/add-icon.svg';
import calendericon from './../../../../../assets/images/icons/calender-icon.svg';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import {
  dateextractor,
  emptychecker,
  getFormattedDate,
  getdaysbetween,
  getminutesbetween,
} from '@/helpers/mischelper';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import { WithTokenPostApi } from '@/services/module/api/postapi';

const AvailabilitySet = ({ userid }) => {
  const format = 'H:mm';
  //const [value, setvalue] = useState(moment().hour(0).minute(0));
  const axiosAuth = useAxiosAuth();
  const [startcalendar, setstartcalendar] = useState(null);
  const [endcalendar, setendcalendar] = useState(null);
  const [mondayerror, setmondayerror] = useState('');
  const [tuesdayerror, settuesdayerror] = useState('');
  const [wednesdayerror, setwednesdayerror] = useState('');
  const [thursdayerror, setthursdayerror] = useState('');
  const [fridayerror, setfridayerror] = useState('');
  const [saturdayerror, setsaturdayerror] = useState('');
  const [sundayerror, setsundayerror] = useState('');
  const [holidayerror, setholidayerror] = useState('');
  const [mondayavailability, setmondayavailability] = useState([
    {
      start: null,
      end: null,
      // start:moment().hour(0).minute(0),
      // end:moment().hour(0).minute(0)
    },
  ]);
  const [tuesdayavailability, settuesdayavailability] = useState([
    {
      start: null,
      end: null,
    },
  ]);
  const [wednesdayavailability, setwednesdayavailability] = useState([
    {
      start: null,
      end: null,
    },
  ]);
  const [thursdayavailability, setthursdayavailability] = useState([
    {
      start: null,
      end: null,
    },
  ]);
  const [fridayavailability, setfridayavailability] = useState([
    {
      start: null,
      end: null,
    },
  ]);
  const [saturdayavailability, setsaturdayavailability] = useState([
    {
      start: null,
      end: null,
    },
  ]);
  const [sundayavailability, setsundayavailability] = useState([
    {
      start: null,
      end: null,
    },
  ]);
  const [holidaylist, setholidaylist] = useState([
    {
      // start: "",
      // end: "",
      start: null,
      end: null,
    },
  ]);
  const {
    data: getdata,
    error,
    isLoading,
  } = useSWR(
    [`/calendar/findAvailabilityHolidayEventForm?userId=${userid}`, axiosAuth],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );
  const {
    trigger,
    isMutating,
    data: postdata,
  } = useSWRMutation(
    `/calendar/createAvailabilityAndHolidayForm/${userid}`,
    WithTokenPostApi
  );

  useEffect(() => {
    if (getdata?.status === 200) {
      let mondayvalue = getdata?.data?.monday;
      let tuesdayvalue = getdata?.data?.tuesday;
      let wednesdayvalue = getdata?.data?.wednesday;
      let thursdayvalue = getdata?.data?.thursday;
      let fridayvalue = getdata?.data?.friday;
      let saturdayvalue = getdata?.data?.saturday;
      let sundayvalue = getdata?.data?.sunday;
      let holiday = getdata?.data?.holiday;
      let convertedmondayData = mondayvalue.map((item) => {
        if (item.start === null || item.end === null) {
          return {
            start: null,
            end: null,
          };
        } else {
          const [startHour, startMinute] = item.start.split(':');
          const [endHour, endMinute] = item.end.split(':');
          return {
            start: moment()
              .hour(parseInt(startHour))
              .minute(parseInt(startMinute)),
            end: moment().hour(parseInt(endHour)).minute(parseInt(endMinute)),
          };
        }
      });
      let convertedtuesdayData = tuesdayvalue.map((item) => {
        if (item.start === null || item.end === null) {
          return {
            start: null,
            end: null,
          };
        } else {
          const [startHour, startMinute] = item.start.split(':');
          const [endHour, endMinute] = item.end.split(':');
          return {
            start: moment()
              .hour(parseInt(startHour))
              .minute(parseInt(startMinute)),
            end: moment().hour(parseInt(endHour)).minute(parseInt(endMinute)),
          };
        }
      });
      let convertedwednesdayData = wednesdayvalue.map((item) => {
        if (item.start === null || item.end === null) {
          return {
            start: null,
            end: null,
          };
        } else {
          const [startHour, startMinute] = item.start.split(':');
          const [endHour, endMinute] = item.end.split(':');
          return {
            start: moment()
              .hour(parseInt(startHour))
              .minute(parseInt(startMinute)),
            end: moment().hour(parseInt(endHour)).minute(parseInt(endMinute)),
          };
        }
      });
      let convertedthursdayData = thursdayvalue.map((item) => {
        if (item.start === null || item.end === null) {
          return {
            start: null,
            end: null,
          };
        } else {
          const [startHour, startMinute] = item.start.split(':');
          const [endHour, endMinute] = item.end.split(':');
          return {
            start: moment()
              .hour(parseInt(startHour))
              .minute(parseInt(startMinute)),
            end: moment().hour(parseInt(endHour)).minute(parseInt(endMinute)),
          };
        }
      });
      let convertedfridayData = fridayvalue.map((item) => {
        if (item.start === null || item.end === null) {
          return {
            start: null,
            end: null,
          };
        } else {
          const [startHour, startMinute] = item.start.split(':');
          const [endHour, endMinute] = item.end.split(':');
          return {
            start: moment()
              .hour(parseInt(startHour))
              .minute(parseInt(startMinute)),
            end: moment().hour(parseInt(endHour)).minute(parseInt(endMinute)),
          };
        }
      });
      let convertedsaturdayData = saturdayvalue.map((item) => {
        if (item.start === null || item.end === null) {
          return {
            start: null,
            end: null,
          };
        } else {
          const [startHour, startMinute] = item.start.split(':');
          const [endHour, endMinute] = item.end.split(':');
          return {
            start: moment()
              .hour(parseInt(startHour))
              .minute(parseInt(startMinute)),
            end: moment().hour(parseInt(endHour)).minute(parseInt(endMinute)),
          };
        }
      });
      let convertedsundayData = sundayvalue.map((item) => {
        if (item.start === null || item.end === null) {
          return {
            start: null,
            end: null,
          };
        } else {
          const [startHour, startMinute] = item.start.split(':');
          const [endHour, endMinute] = item.end.split(':');
          return {
            start: moment()
              .hour(parseInt(startHour))
              .minute(parseInt(startMinute)),
            end: moment().hour(parseInt(endHour)).minute(parseInt(endMinute)),
          };
        }
      });
      let convertedholidaydata = holiday.map((item) => {
        if (item.start === null || item.end === null) {
          return {
            start: null,
            end: null,
          };
        } else {
          return {
            start: eval(item?.start).toISOString(),
            end: eval(item?.end).toISOString(),
          };
        }
      });
      setsundayavailability(convertedsundayData);
      setsaturdayavailability(convertedsaturdayData);
      setfridayavailability(convertedfridayData);
      setthursdayavailability(convertedthursdayData);
      setwednesdayavailability(convertedwednesdayData);
      settuesdayavailability(convertedtuesdayData);
      setmondayavailability(convertedmondayData);
      setholidaylist(convertedholidaydata);
    }
  }, [getdata]);
  useEffect(() => {
    if (postdata?.status === 200) {
      toast.success(postdata?.data?.message);
    }
  }, [postdata]);
  function onMondayChange(e, i, type) {
    let formvalues = [...mondayavailability];
    if (type === 'start') {
      formvalues[i].start = e;
    }
    if (type === 'end') {
      formvalues[i].end = e;
    }
    setmondayavailability(formvalues);
    setmondayerror('');
  }
  const Mondayaddition = () => {
    let temp = [...mondayavailability];
    temp.push({ start: null, end: null });
    setmondayavailability(temp);
    setmondayerror('');
  };
  const Mondaydelete = (i) => {
    let newFormValues = [...mondayavailability];
    newFormValues.splice(i, 1);
    setmondayavailability(newFormValues);
    setmondayerror('');
    //sethandleChange(true)
  };
  const handleMondayStartClose = (i, data) => {
    if (
      data.end !== null &&
      data.start !== null &&
      getminutesbetween(data.end.format(format), data.start.format(format)) < 0
    ) {
      let formvalues = [...mondayavailability];
      formvalues[i].start = null;
      setmondayerror("Start time can't smaller than end time");
    }
  };
  const handleMondayEndClose = (i, data) => {
    if (
      data.end !== null &&
      data.start !== null &&
      getminutesbetween(data.start.format(format), data.end.format(format)) < 0
    ) {
      let formvalues = [...mondayavailability];
      formvalues[i].end = null;
      setmondayerror("End time can't smaller than start time");
    }
  };
  function onTuesdayChange(e, i, type) {
    let formvalues = [...tuesdayavailability];
    if (type === 'start') {
      formvalues[i].start = e;
    }
    if (type === 'end') {
      formvalues[i].end = e;
    }
    settuesdayavailability(formvalues);
    settuesdayerror('');
  }
  const Tuesdayaddition = () => {
    let temp = [...tuesdayavailability];
    temp.push({ start: null, end: null });
    settuesdayavailability(temp);
    settuesdayerror('');
  };
  const Tuesdaydelete = (i) => {
    let newFormValues = [...tuesdayavailability];
    newFormValues.splice(i, 1);
    settuesdayavailability(newFormValues);
    settuesdayerror('');
    //sethandleChange(true)
  };
  const handleTuesdayStartClose = (i, data) => {
    if (
      data.end !== null &&
      data.start !== null &&
      getminutesbetween(data.end.format(format), data.start.format(format)) < 0
    ) {
      let formvalues = [...tuesdayavailability];
      formvalues[i].start = null;
      settuesdayerror("Start time can't smaller than end time");
    }
  };
  const handleTuesdayEndClose = (i, data) => {
    if (
      data.end !== null &&
      data.start !== null &&
      getminutesbetween(data.start.format(format), data.end.format(format)) < 0
    ) {
      let formvalues = [...tuesdayavailability];
      formvalues[i].end = null;
      settuesdayerror("End time can't smaller than start time");
    }
  };
  function onWednesdayChange(e, i, type) {
    let formvalues = [...wednesdayavailability];
    if (type === 'start') {
      formvalues[i].start = e;
    }
    if (type === 'end') {
      formvalues[i].end = e;
    }
    setwednesdayavailability(formvalues);
    setwednesdayerror('');
  }
  const Wednesdayaddition = () => {
    let temp = [...wednesdayavailability];
    temp.push({ start: null, end: null });
    setwednesdayavailability(temp);
    setwednesdayerror('');
  };
  const Wednesdaydelete = (i) => {
    let newFormValues = [...wednesdayavailability];
    newFormValues.splice(i, 1);
    setwednesdayavailability(newFormValues);
    setwednesdayerror('');
    //sethandleChange(true)
  };
  const handleWednesdayStartClose = (i, data) => {
    if (
      data.end !== null &&
      data.start !== null &&
      getminutesbetween(data.end.format(format), data.start.format(format)) < 0
    ) {
      let formvalues = [...wednesdayavailability];
      formvalues[i].start = null;
      setwednesdayerror("Start time can't smaller than end time");
    }
  };
  const handleWednesdayEndClose = (i, data) => {
    if (
      data.end !== null &&
      data.start !== null &&
      getminutesbetween(data.start.format(format), data.end.format(format)) < 0
    ) {
      let formvalues = [...wednesdayavailability];
      formvalues[i].end = null;
      setwednesdayerror("End time can't smaller than start time");
    }
  };
  function onThursdayChange(e, i, type) {
    let formvalues = [...thursdayavailability];
    if (type === 'start') {
      formvalues[i].start = e;
    }
    if (type === 'end') {
      formvalues[i].end = e;
    }
    setthursdayavailability(formvalues);
    setthursdayerror('');
  }
  const Thursdayaddition = () => {
    let temp = [...thursdayavailability];
    temp.push({ start: null, end: null });
    setthursdayavailability(temp);
    setthursdayerror('');
  };
  const Thursdaydelete = (i) => {
    let newFormValues = [...thursdayavailability];
    newFormValues.splice(i, 1);
    setthursdayavailability(newFormValues);
    setthursdayerror('');
    //sethandleChange(true)
  };
  const handleThursdayStartClose = (i, data) => {
    if (
      data.end !== null &&
      data.start !== null &&
      getminutesbetween(data.end.format(format), data.start.format(format)) < 0
    ) {
      let formvalues = [...thursdayavailability];
      formvalues[i].start = null;
      setthursdayerror("Start time can't smaller than end time");
    }
  };
  const handleThursdayEndClose = (i, data) => {
    if (
      data.end !== null &&
      data.start !== null &&
      getminutesbetween(data.start.format(format), data.end.format(format)) < 0
    ) {
      let formvalues = [...thursdayavailability];
      formvalues[i].end = null;
      setthursdayerror("End time can't smaller than start time");
    }
  };
  function onFridayChange(e, i, type) {
    let formvalues = [...fridayavailability];
    if (type === 'start') {
      formvalues[i].start = e;
    }
    if (type === 'end') {
      formvalues[i].end = e;
    }
    setfridayavailability(formvalues);
    setfridayerror('');
  }
  const Fridayaddition = () => {
    let temp = [...fridayavailability];
    temp.push({ start: null, end: null });
    setfridayavailability(temp);
    setfridayerror('');
  };
  const Fridaydelete = (i) => {
    let newFormValues = [...fridayavailability];
    newFormValues.splice(i, 1);
    setfridayavailability(newFormValues);
    setfridayerror('');
    //sethandleChange(true)
  };
  const handleFridayStartClose = (i, data) => {
    if (
      data.end !== null &&
      data.start !== null &&
      getminutesbetween(data.end.format(format), data.start.format(format)) < 0
    ) {
      let formvalues = [...fridayavailability];
      formvalues[i].start = null;
      setfridayerror("Start time can't smaller than end time");
    }
  };
  const handleFridayEndClose = (i, data) => {
    if (
      data.end !== null &&
      data.start !== null &&
      getminutesbetween(data.start.format(format), data.end.format(format)) < 0
    ) {
      let formvalues = [...fridayavailability];
      formvalues[i].end = null;
      setfridayerror("End time can't smaller than start time");
    }
  };
  function onSaturdayChange(e, i, type) {
    let formvalues = [...saturdayavailability];
    if (type === 'start') {
      formvalues[i].start = e;
    }
    if (type === 'end') {
      formvalues[i].end = e;
    }
    setsaturdayavailability(formvalues);
    setsaturdayerror('');
  }
  const Saturdayaddition = () => {
    let temp = [...saturdayavailability];
    temp.push({ start: null, end: null });
    setsaturdayavailability(temp);
    setsaturdayerror('');
  };
  const Saturdaydelete = (i) => {
    let newFormValues = [...saturdayavailability];
    newFormValues.splice(i, 1);
    setsaturdayavailability(newFormValues);
    setsaturdayerror('');
    //sethandleChange(true)
  };
  const handleSaturdayStartClose = (i, data) => {
    if (
      data.end !== null &&
      data.start !== null &&
      getminutesbetween(data.end.format(format), data.start.format(format)) < 0
    ) {
      let formvalues = [...saturdayavailability];
      formvalues[i].start = null;
      setsaturdayerror("Start time can't smaller than end time");
    }
  };
  const handleSaturdayEndClose = (i, data) => {
    if (
      data.end !== null &&
      data.start !== null &&
      getminutesbetween(data.start.format(format), data.end.format(format)) < 0
    ) {
      let formvalues = [...saturdayavailability];
      formvalues[i].end = null;
      setsaturdayerror("End time can't smaller than start time");
    }
  };
  function onSundayChange(e, i, type) {
    let formvalues = [...sundayavailability];
    if (type === 'start') {
      formvalues[i].start = e;
    }
    if (type === 'end') {
      formvalues[i].end = e;
    }
    setsundayavailability(formvalues);
    setsundayerror('');
  }
  const Sundayaddition = () => {
    let temp = [...sundayavailability];
    temp.push({ start: null, end: null });
    setsundayavailability(temp);
    setsundayerror('');
  };
  const Sundaydelete = (i) => {
    let newFormValues = [...sundayavailability];
    newFormValues.splice(i, 1);
    setsundayavailability(newFormValues);
    setsundayerror('');
  };
  const handleSundayStartClose = (i, data) => {
    if (
      data.end !== null &&
      data.start !== null &&
      getminutesbetween(data.end.format(format), data.start.format(format)) < 0
    ) {
      let formvalues = [...sundayavailability];
      formvalues[i].start = null;
      setsundayerror("Start time can't smaller than end time");
    }
  };
  const handleSundayEndClose = (i, data) => {
    if (
      data.end !== null &&
      data.start !== null &&
      getminutesbetween(data.start.format(format), data.end.format(format)) < 0
    ) {
      let formvalues = [...sundayavailability];
      formvalues[i].end = null;
      setsundayerror("End time can't smaller than start time");
    }
  };
  const handleaddholiday = () => {
    setholidaylist([
      ...holidaylist,
      {
        start: null,
        end: null,
      },
    ]);
    setholidayerror('');
  };
  const handleremoveholiday = (i) => {
    let newFormValues = [...holidaylist];
    newFormValues.splice(i, 1);
    setholidaylist(newFormValues);
    setholidayerror('');
  };
  const handlestartcalendar = (i) => {
    if (startcalendar === i) {
      setstartcalendar(null);
    } else setstartcalendar(i);
    setholidayerror('');
  };
  const handleendcalendar = (i) => {
    if (endcalendar === i) {
      setendcalendar(null);
    } else setendcalendar(i);
    setholidayerror('');
  };
  const handleStartdate = (i, e, end) => {
    let newFormValues = [...holidaylist];
    if (getdaysbetween(new Date(e).toISOString(), end) > 0) {
      setholidayerror("start date can't be bigger than end date");
    } else if (
      getdaysbetween(new Date(e).toISOString(), moment().format()) < 0
    ) {
      setholidayerror("start date can't be smaller than today's date");
    } else {
      newFormValues[i].start = new Date(e).toISOString();
      setholidaylist(newFormValues);
      setstartcalendar(null);
      setholidayerror('');
    }
  };
  const handleEnddate = (i, e, start) => {
    let newFormValues = [...holidaylist];
    if (getdaysbetween(new Date(e).toISOString(), start) < 0) {
      setholidayerror("end date can't be smaller than current date");
    } else if (
      getdaysbetween(new Date(e).toISOString(), moment().format()) < 0
    ) {
      setholidayerror("end date can't be smaller than today's date");
    } else {
      newFormValues[i].end = new Date(e).toISOString();
      setholidaylist(newFormValues);
      setendcalendar(null);
      setholidayerror('');
    }
  };
  const handleseterror = (type, condition) => {
    if (type === 'monday') {
      if (condition === 'nullerror') {
        setmondayerror('Please add time in all cases');
      } else {
        setmondayerror(
          "Start time and end time can't be in between of previous start and end date"
        );
      }
      window.scroll(120, 240);
      return true;
    }
    if (type === 'tuesday') {
      if (condition === 'nullerror') {
        settuesdayerror('Please add time in all cases');
      } else {
        settuesdayerror(
          "Start time and end time can't be in between of previous start and end date"
        );
      }
      window.scroll(120, 240);
      return true;
    }
    if (type === 'wednesday') {
      if (condition === 'nullerror') {
        setwednesdayerror('Please add time in all cases');
      } else {
        setwednesdayerror(
          "Start time and end time can't be in between of previous start and end date"
        );
      }

      window.scroll(120, 240);
      return true;
    }
    if (type === 'thursday') {
      if (condition === 'nullerror') {
        setthursdayerror('Please add time in all cases');
      } else {
        setthursdayerror(
          "Start time and end time can't be in between of previous start and end date"
        );
      }
      window.scroll(120, 240);
      return true;
    }
    if (type === 'friday') {
      if (condition === 'nullerror') {
        setfridayerror('Please add time in all cases');
      } else {
        setfridayerror(
          "Start time and end time can't be in between of previous start and end date"
        );
      }

      window.scroll(120, 240);
      return true;
    }
    if (type === 'saturday') {
      if (condition === 'nullerror') {
        setsaturdayerror('Please add time in all cases');
      } else {
        setsaturdayerror(
          "Start time and end time can't be in between of previous start and end date"
        );
      }

      return true;
    }
    if (type === 'sunday') {
      if (condition === 'nullerror') {
        setsundayerror('Please add time in all cases');
      } else {
        setsundayerror(
          "Start time and end time can't be in between of previous start and end date"
        );
      }

      return true;
    }
    if (type === 'holiday') {
      if (condition === 'nullerror') {
        setholidayerror('Please add date in all cases');
      } else {
        setholidayerror(
          "Start date and end date can't be in between of previous start and end date"
        );
      }
      return true;
    }
  };
  const onSubmit = () => {
    let convertedupdatemondayData = '';
    let convertedupdatetuesdayData = '';
    let convertedupdatewednesdayData = '';
    let convertedupdatethursdayData = '';
    let convertedupdatefridayData = '';
    let convertedupdatesaturdayData = '';
    let convertedupdatesundayData = '';
    let convertedupdateholidaydata = '';
    let error = false;
    emptychecker(mondayavailability, 'day') === ''
      ? (convertedupdatemondayData = mondayavailability.map((item) => {
          return {
            start: item.start === null ? null : item.start.format(format),
            end: item.end === null ? null : item.end.format(format),
          };
        }))
      : (error = handleseterror(
          'monday',
          emptychecker(mondayavailability, 'day')
        ));
    emptychecker(tuesdayavailability, 'day') === ''
      ? (convertedupdatetuesdayData = tuesdayavailability.map((item) => {
          return {
            start: item.start === null ? null : item.start.format(format),
            end: item.end === null ? null : item.end.format(format),
          };
        }))
      : (error = handleseterror(
          'tuesday',
          emptychecker(tuesdayavailability, 'day')
        ));
    emptychecker(wednesdayavailability, 'day') === ''
      ? (convertedupdatewednesdayData = wednesdayavailability.map((item) => {
          return {
            start: item.start === null ? null : item.start.format(format),
            end: item.end === null ? null : item.end.format(format),
          };
        }))
      : (error = handleseterror(
          'wednesday',
          emptychecker(wednesdayavailability, 'day')
        ));
    emptychecker(thursdayavailability, 'day') === ''
      ? (convertedupdatethursdayData = thursdayavailability.map((item) => {
          return {
            start: item.start === null ? null : item.start.format(format),
            end: item.end === null ? null : item.end.format(format),
          };
        }))
      : (error = handleseterror(
          'thursday',
          emptychecker(thursdayavailability, 'day')
        ));
    emptychecker(fridayavailability, 'day') === ''
      ? (convertedupdatefridayData = fridayavailability.map((item) => {
          return {
            start: item.start === null ? null : item.start.format(format),
            end: item.end === null ? null : item.end.format(format),
          };
        }))
      : (error = handleseterror(
          'friday',
          emptychecker(fridayavailability, 'day')
        ));
    emptychecker(saturdayavailability, 'day') === ''
      ? (convertedupdatesaturdayData = saturdayavailability.map((item) => {
          return {
            start: item.start === null ? null : item.start.format(format),
            end: item.end === null ? null : item.end.format(format),
          };
        }))
      : (error = handleseterror(
          'saturday',
          emptychecker(saturdayavailability, 'day')
        ));
    emptychecker(sundayavailability, 'day') === ''
      ? (convertedupdatesundayData = sundayavailability.map((item) => {
          return {
            start: item.start === null ? null : item.start.format(format),
            end: item.end === null ? null : item.end.format(format),
          };
        }))
      : (error = handleseterror(
          'sunday',
          emptychecker(sundayavailability, 'day')
        ));
    emptychecker(holidaylist, 'holiday') === ''
      ? (convertedupdateholidaydata = holidaylist.map((item) => {
          return {
            start: dateextractor(item?.start, 'start'),
            end: dateextractor(item?.end, 'end'),
          };
        }))
      : (error = handleseterror(
          'holiday',
          emptychecker(holidaylist, 'holiday')
        ));
    if (!error) {
      let payload = {
        monday: convertedupdatemondayData,
        tuesday: convertedupdatetuesdayData,
        wednesday: convertedupdatewednesdayData,
        thursday: convertedupdatethursdayData,
        friday: convertedupdatefridayData,
        saturday: convertedupdatesaturdayData,
        sunday: convertedupdatesundayData,
        holiday: convertedupdateholidaydata,
      };
      trigger({ payload, axios: axiosAuth });
    }
  };
  const handleholidayclose = (type, i) => {
    if (type === 'start') {
      let newFormValues = [...holidaylist];
      newFormValues[i].start = null;
      setholidaylist(newFormValues);
    } else {
      let newFormValues = [...holidaylist];
      newFormValues[i].end = null;
      setholidaylist(newFormValues);
    }
  };
  return (
    <>
      <div className="calender-wrap-content">
        <div className="cl-row-single">
          <div className="cl-row">
            <div className="cl-col basis-auto">
              <span className="cl-col-label">Monday</span>
            </div>
            {mondayavailability?.map((field, index) => (
              <>
                {index !== 0 && (
                  <div className="cl-col basis-auto">
                    <span className="cl-col-label"></span>
                  </div>
                )}
                <div className="cl-col basis-4/12">
                  <TimePicker
                    showSecond={false}
                    value={field.start}
                    placeholder="Add start time"
                    className="s-time-picker"
                    onChange={(e) => onMondayChange(e, index, 'start')}
                    onClose={() => handleMondayStartClose(index, field)}
                    inputReadOnly
                  />
                </div>
                <div className="cl-col basis-2.5">
                  <span>to</span>
                </div>
                <div className="cl-col basis-4/12">
                  {/* <div className="form-field"> */}
                  <TimePicker
                    showSecond={false}
                    placeholder="Add end time"
                    value={field.end}
                    className="s-time-picker"
                    onChange={(e) => onMondayChange(e, index, 'end')}
                    onClose={() => handleMondayEndClose(index, field)}
                    inputReadOnly
                  />
                </div>
                {mondayavailability?.length !== 1 && (
                  <div className="cl-col basis-auto">
                    <div className="flex">
                      <div
                        className="cl-col-btn remove"
                        onClick={() => Mondaydelete(index)}
                      >
                        <Image src={removeicon} alt="" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ))}
            <div className="cl-col basis-auto">
              <div className="cl-col-btn add" onClick={Mondayaddition}>
                <Image src={addicon} alt="" />
              </div>
            </div>
          </div>
          {mondayerror !== '' ? (
            <div className="cl-row">
              <div className="cl-col basis-auto">
                <span className="cl-col-label"></span>
              </div>
              <div className="cl-col basis-auto">
                <span className=" text-red-700 text-[15px]">{mondayerror}</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="cl-row-single">
          <div className="cl-row">
            <div className="cl-col basis-auto">
              <span className="cl-col-label">Tuesday</span>
            </div>
            {tuesdayavailability?.map((field, index) => (
              <>
                {index !== 0 && (
                  <div className="cl-col basis-auto">
                    <span className="cl-col-label"></span>
                  </div>
                )}
                <div className="cl-col basis-4/12">
                  <TimePicker
                    showSecond={false}
                    placeholder="Add start time"
                    value={field.start}
                    className="s-time-picker"
                    onChange={(e) => onTuesdayChange(e, index, 'start')}
                    onClose={() => handleTuesdayStartClose(index, field)}
                    inputReadOnly
                  />
                </div>
                <div className="cl-col basis-2.5">
                  <span>to</span>
                </div>
                <div className="cl-col basis-4/12">
                  <TimePicker
                    showSecond={false}
                    placeholder="Add end time"
                    value={field.end}
                    className="s-time-picker"
                    onChange={(e) => onTuesdayChange(e, index, 'end')}
                    onClose={() => handleTuesdayEndClose(index, field)}
                    inputReadOnly
                  />
                </div>
                {tuesdayavailability?.length !== 1 && (
                  <div className="cl-col basis-auto">
                    <div className="flex">
                      <div
                        className="cl-col-btn remove"
                        onClick={() => Tuesdaydelete(index)}
                      >
                        <Image src={removeicon} alt="" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ))}
            <div className="cl-col basis-auto">
              <div className="cl-col-btn add" onClick={Tuesdayaddition}>
                <Image src={addicon} alt="" />
              </div>
            </div>
          </div>
          {tuesdayerror !== '' ? (
            <div className="cl-row">
              <div className="cl-col basis-auto">
                <span className="cl-col-label"></span>
              </div>
              <div className="cl-col basis-auto">
                <span className=" text-red-700 text-[15px]">
                  {tuesdayerror}
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="cl-row-single">
          <div className="cl-row">
            <div className="cl-col basis-auto">
              <span className="cl-col-label">Wednesday</span>
            </div>
            {wednesdayavailability?.map((field, index) => (
              <>
                {index !== 0 && (
                  <div className="cl-col basis-auto">
                    <span className="cl-col-label"></span>
                  </div>
                )}
                <div className="cl-col basis-4/12">
                  <TimePicker
                    showSecond={false}
                    placeholder="Add start time"
                    value={field.start}
                    className="s-time-picker"
                    onChange={(e) => onWednesdayChange(e, index, 'start')}
                    onClose={() => handleWednesdayStartClose(index, field)}
                    inputReadOnly
                  />
                </div>
                <div className="cl-col basis-2.5">
                  <span>to</span>
                </div>
                <div className="cl-col basis-4/12">
                  <TimePicker
                    showSecond={false}
                    placeholder="Add end time"
                    value={field.end}
                    className="s-time-picker"
                    onChange={(e) => onWednesdayChange(e, index, 'end')}
                    onClose={() => handleWednesdayEndClose(index, field)}
                    inputReadOnly
                  />
                </div>
                {wednesdayavailability?.length !== 1 && (
                  <div className="cl-col basis-auto">
                    <div className="flex">
                      <div
                        className="cl-col-btn remove"
                        onClick={() => Wednesdaydelete(index)}
                      >
                        <Image src={removeicon} alt="" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ))}
            <div className="cl-col basis-auto">
              <div className="cl-col-btn add" onClick={Wednesdayaddition}>
                <Image src={addicon} alt="" />
              </div>
            </div>
          </div>
          {wednesdayerror !== '' ? (
            <div className="cl-row">
              <div className="cl-col basis-auto">
                <span className="cl-col-label"></span>
              </div>
              <div className="cl-col basis-auto">
                <span className=" text-red-700 text-[15px]">
                  {wednesdayerror}
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="cl-row-single">
          <div className="cl-row">
            <div className="cl-col basis-auto">
              <span className="cl-col-label">Thursday</span>
            </div>
            {thursdayavailability?.map((field, index) => (
              <>
                {index !== 0 && (
                  <div className="cl-col basis-auto">
                    <span className="cl-col-label"></span>
                  </div>
                )}
                <div className="cl-col basis-4/12">
                  <TimePicker
                    showSecond={false}
                    placeholder="Add start time"
                    value={field.start}
                    className="s-time-picker"
                    onChange={(e) => onThursdayChange(e, index, 'start')}
                    onClose={() => handleThursdayStartClose(index, field)}
                    inputReadOnly
                  />
                </div>
                <div className="cl-col basis-2.5">
                  <span>to</span>
                </div>
                <div className="cl-col basis-4/12">
                  <TimePicker
                    showSecond={false}
                    placeholder="Add end time"
                    value={field.end}
                    className="s-time-picker"
                    onChange={(e) => onThursdayChange(e, index, 'end')}
                    onClose={() => handleThursdayEndClose(index, field)}
                    inputReadOnly
                  />
                </div>
                {thursdayavailability?.length !== 1 && (
                  <div className="cl-col basis-auto">
                    <div className="flex">
                      <div
                        className="cl-col-btn remove"
                        onClick={() => Thursdaydelete(index)}
                      >
                        <Image src={removeicon} alt="" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ))}
            <div className="cl-col basis-auto">
              <div className="cl-col-btn add" onClick={Thursdayaddition}>
                <Image src={addicon} alt="" />
              </div>
            </div>
          </div>
          {thursdayerror !== '' ? (
            <div className="cl-row">
              <div className="cl-col basis-auto">
                <span className="cl-col-label"></span>
              </div>
              <div className="cl-col basis-auto">
                <span className=" text-red-700 text-[15px]">
                  {thursdayerror}
                </span>
              </div>
            </div>
          ) : null}
        </div>
        <div className="cl-row-single">
          <div className="cl-row">
            <div className="cl-col basis-auto">
              <span className="cl-col-label">Friday</span>
            </div>
            {fridayavailability?.map((field, index) => (
              <>
                {index !== 0 && (
                  <div className="cl-col basis-auto">
                    <span className="cl-col-label"></span>
                  </div>
                )}
                <div className="cl-col basis-4/12">
                  <TimePicker
                    showSecond={false}
                    placeholder="Add start time"
                    value={field.start}
                    className="s-time-picker"
                    onChange={(e) => onFridayChange(e, index, 'start')}
                    onClose={() => handleFridayStartClose(index, field)}
                    inputReadOnly
                  />
                </div>
                <div className="cl-col basis-2.5">
                  <span>to</span>
                </div>
                <div className="cl-col basis-4/12">
                  <TimePicker
                    showSecond={false}
                    placeholder="Add end time"
                    value={field.end}
                    className="s-time-picker"
                    onChange={(e) => onFridayChange(e, index, 'end')}
                    onClose={() => handleFridayEndClose(index, field)}
                    inputReadOnly
                  />
                </div>
                {fridayavailability?.length !== 1 && (
                  <div className="cl-col basis-auto">
                    <div className="flex">
                      <div
                        className="cl-col-btn remove"
                        onClick={() => Fridaydelete(index)}
                      >
                        <Image src={removeicon} alt="" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ))}
            <div className="cl-col basis-auto">
              <div className="cl-col-btn add" onClick={Fridayaddition}>
                <Image src={addicon} alt="" />
              </div>
            </div>
          </div>
          {fridayerror !== '' ? (
            <div className="cl-row">
              <div className="cl-col basis-auto">
                <span className="cl-col-label"></span>
              </div>
              <div className="cl-col basis-auto">
                <span className=" text-red-700 text-[15px]">{fridayerror}</span>
              </div>
            </div>
          ) : null}
        </div>
        <div className="cl-row-single">
          <div className="cl-row">
            <div className="cl-col basis-auto">
              <span className="cl-col-label">Saturday</span>
            </div>
            {saturdayavailability?.map((field, index) => (
              <>
                {index !== 0 && (
                  <div className="cl-col basis-auto">
                    <span className="cl-col-label"></span>
                  </div>
                )}
                <div className="cl-col basis-4/12">
                  <TimePicker
                    showSecond={false}
                    placeholder="Add start time"
                    value={field.start}
                    className="s-time-picker"
                    onChange={(e) => onSaturdayChange(e, index, 'start')}
                    onClose={() => handleSaturdayStartClose(index, field)}
                    inputReadOnly
                  />
                </div>
                <div className="cl-col basis-2.5">
                  <span>to</span>
                </div>
                <div className="cl-col basis-4/12">
                  <TimePicker
                    showSecond={false}
                    placeholder="Add end time"
                    value={field.end}
                    className="s-time-picker"
                    onChange={(e) => onSaturdayChange(e, index, 'end')}
                    onClose={() => handleSaturdayEndClose(index, field)}
                    inputReadOnly
                  />
                </div>
                {saturdayavailability?.length !== 1 && (
                  <div className="cl-col basis-auto">
                    <div className="flex">
                      <div
                        className="cl-col-btn remove"
                        onClick={() => Saturdaydelete(index)}
                      >
                        <Image src={removeicon} alt="" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ))}
            <div className="cl-col basis-auto">
              <div className="cl-col-btn add" onClick={Saturdayaddition}>
                <Image src={addicon} alt="" />
              </div>
            </div>
          </div>
          {saturdayerror !== '' ? (
            <div className="cl-row">
              <div className="cl-col basis-auto">
                <span className="cl-col-label"></span>
              </div>
              <div className="cl-col basis-auto">
                <span className=" text-red-700 text-[15px]">
                  {saturdayerror}
                </span>
              </div>
            </div>
          ) : null}
        </div>
        <div className="cl-row-single">
          <div className="cl-row">
            <div className="cl-col basis-auto">
              <span className="cl-col-label">Sunday</span>
            </div>
            {sundayavailability?.map((field, index) => (
              <>
                {index !== 0 && (
                  <div className="cl-col basis-auto">
                    <span className="cl-col-label"></span>
                  </div>
                )}
                <div className="cl-col basis-4/12">
                  <TimePicker
                    showSecond={false}
                    placeholder="Add start time"
                    value={field.start}
                    className="s-time-picker"
                    onChange={(e) => onSundayChange(e, index, 'start')}
                    onClose={() => handleSundayStartClose(index, field)}
                    inputReadOnly
                  />
                </div>
                <div className="cl-col basis-2.5">
                  <span>to</span>
                </div>
                <div className="cl-col basis-4/12">
                  <TimePicker
                    showSecond={false}
                    placeholder="Add end time"
                    value={field.end}
                    className="s-time-picker"
                    onChange={(e) => onSundayChange(e, index, 'end')}
                    onClose={() => handleSundayEndClose(index, field)}
                    inputReadOnly
                  />
                </div>
                {sundayavailability?.length !== 1 && (
                  <div className="cl-col basis-auto">
                    <div className="flex">
                      <div
                        className="cl-col-btn remove"
                        onClick={() => Sundaydelete(index)}
                      >
                        <Image src={removeicon} alt="" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ))}
            <div className="cl-col basis-auto">
              <div className="cl-col-btn add" onClick={Sundayaddition}>
                <Image src={addicon} alt="" />
              </div>
            </div>
          </div>
          {sundayerror !== '' ? (
            <div className="cl-row">
              <div className="cl-col basis-auto">
                <span className="cl-col-label"></span>
              </div>
              <div className="cl-col basis-auto">
                <span className=" text-red-700 text-[15px]">{sundayerror}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="calender-wrap-title mb-4">Set My Holiday</h3>
      </div>
      <div className="cl-row-single">
        {holidaylist?.map((item, index) => (
          <div className="cl-row">
            <div className="cl-col basis-4/12">
              <div className="form-field">
                <input
                  type="text"
                  placeholder="Start date"
                  className="form-control"
                  value={
                    item?.start !== null ? getFormattedDate(item?.start) : ''
                  }
                  readOnly
                />
                <span className="absolute cursor-pointer right-[45px] top-2/4  -translate-y-2/4 ">
                  <Image
                    src={closeicon}
                    alt=""
                    onClick={() => handleholidayclose('start', index)}
                  />
                </span>
                <span className="calender-icon">
                  <Image
                    src={calendericon}
                    alt=""
                    onClick={() => handlestartcalendar(index)}
                  />
                </span>
              </div>
              {startcalendar === index ? (
                <Calendar
                  name="start"
                  onChange={(e) => {
                    handleStartdate(index, e, item?.end);
                  }}
                />
              ) : null}
            </div>
            <div className="cl-col basis-4/12">
              <div className="form-field">
                <input
                  type="text"
                  placeholder="End date"
                  className="form-control"
                  value={item?.end !== null ? getFormattedDate(item?.end) : ''}
                  readOnly
                />
                <span className="absolute cursor-pointer right-[45px] top-2/4  -translate-y-2/4 ">
                  <Image
                    src={closeicon}
                    alt=""
                    onClick={() => handleholidayclose('end', index)}
                  />
                </span>
                <span className="calender-icon">
                  <Image
                    src={calendericon}
                    alt=""
                    onClick={() => handleendcalendar(index)}
                  />
                </span>
              </div>
              {endcalendar === index ? (
                <Calendar
                  name="end"
                  onChange={(e) => {
                    handleEnddate(index, e, item?.start);
                  }}
                />
              ) : null}
            </div>
            {holidaylist?.length !== 1 && (
              <div className="cl-col basis-auto">
                <div className="flex gap-2">
                  <div className="cl-col-btn add">
                    <Image
                      src={removeicon}
                      alt=""
                      onClick={() => handleremoveholiday(index)}
                    />
                  </div>
                </div>
              </div>
            )}

            {index === holidaylist?.length - 1 && (
              <div className="cl-col basis-1/12">
                <div className="flex gap-2">
                  <div className="cl-col-btn add">
                    <Image src={addicon} alt="" onClick={handleaddholiday} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {holidayerror !== '' ? (
          <div className="cl-row">
            <div className="cl-col basis-auto">
              <span className=" text-red-700 text-[15px]">{holidayerror}</span>
            </div>
          </div>
        ) : null}
      </div>
      <div className="text-left mt-6">
        <button
          type="submit"
          // className="primary-btn"
          disabled={isMutating}
          className={`primary-btn ${isMutating ? 'disable' : ''}`}
          onClick={onSubmit}
        >
          Update
        </button>
      </div>
    </>
  );
};

export default AvailabilitySet;
