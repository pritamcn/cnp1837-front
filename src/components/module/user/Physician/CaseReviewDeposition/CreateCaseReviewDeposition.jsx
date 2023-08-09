'use client';
import React, { useEffect, useState } from 'react';
import topbluebg from '../../../../../assets/images/create-case-top-blue-bg.png';
import calendericon from './../../../../../assets/images/icons/calender-icon.svg';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useController, useForm } from 'react-hook-form';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import {
  WithTokenPostApi,
} from '@/services/module/api/postapi';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import Select from 'react-select';
import Calendar from 'react-calendar';
import TimePicker from 'rc-time-picker';
import {
  getFormattedDate,
  getdaysbetween,
  getminutesbetween,
} from '@/helpers/mischelper';
import Image from 'next/image';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const CreateCaseReviewDeposition = () => {
  const axiosAuth = useAxiosAuth();
  const { data: session, update } = useSession();

  const [defendentlist, setdefendentlist] = useState([]);
  const [plantifflist, setplantifflist] = useState([]);

  const [startcalendarvalue, setstartcalendarvalue] = useState('');
  const [startdateerror, setstartdateerror] = useState('');
  const [startcalendar, setstartcalendar] = useState(false);
  const [enderror, setenderror] = useState('');
  const [enddateerror, setenddateerror] = useState('');
  const [starterror, setstarterror] = useState('');
  const [starttime, setstarttime] = useState(null);
  const [endcalendarvalue, setendcalendarvalue] = useState('');
  const [endcalendar, setendcalendar] = useState(false);
  const [endtime, setendtime] = useState(null);

  const format = 'H:mm';

  const {
    trigger,
    isMutating,
    data: createData,
    error: createError,
  } = useSWRMutation(
    `/createDepoRequest/${session?.user?.id}`,
    WithTokenPostApi
  );

  const {
    data: getdata,
    error,
    isLoading: getdataLoading,
  } = useSWR(
    [`/getAllAttorneyList`, axiosAuth],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (getdata?.data?.data?.length > 0) {
      setplantifflist(getdata?.data?.data);
      setdefendentlist(getdata?.data?.data);
    }
  }, [getdata]);

  const defendentlawyerSchema = z.object({
    label: z.string().min(1, { message: "Defendent lawyer can't be empty" }),
    value: z.number().optional(),
  });
  const plantifflawyerSchema = z.object({
    label: z.string().min(1, { message: "Plaintiff lawyer can't be empty" }),
    value: z.number().optional(),
  });

  const schema = z.object({
    defendant_lawyer: z
      .array(defendentlawyerSchema)
      .min(1, { message: "Defendent lawyer can't be empty" }),
    plaintiff_lawyer: z
      .array(plantifflawyerSchema)
      .min(1, { message: "Plaintiff lawyer can't be empty" }),
    case_name: z.string().min(1, { message: "Case name can't be empty" }),
    defendant_box_tick: z.boolean(),
    plaintiff_box_tick: z.boolean(),
    general_availability: z.string(),
  });

  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      defendant_lawyer: [],
      plaintiff_lawyer: [],
      case_name: '',
      defendant_box_tick: false,
      plaintiff_box_tick: false,
      general_availability: 'false',
    },
  });

  const {
    field: {
      value: defendentValue,
      onChange: defendentOnChange,
      ...restdefendentField
    },
  } = useController({ name: 'defendant_lawyer', control });

  const {
    field: {
      value: plantiffValue,
      onChange: plantiffOnChange,
      ...restplantiffField
    },
  } = useController({ name: 'plaintiff_lawyer', control });

  const { errors, isDirty } = formState;

  const handledefendentchange = (e, context) => {
    if (context.action === 'remove-value') {
      let plantiff = [...plantifflist];
      let finalplantiff = [...plantiff, context.removedValue];
      setplantifflist(finalplantiff);
    }
    if (context.action === 'clear') {
      let plantiff = [...plantifflist];
      let finalplantiff = [...plantiff, ...context.removedValues];
      setplantifflist(finalplantiff);
    }

    if (context.action === 'select-option') {
      let plantiff = [...plantifflist];
      let finalplantiff = plantiff.filter(
        (item1) => !e.some((item2) => item2?.value === item1?.value)
      );
      setplantifflist(finalplantiff);
    }
  };

  const handleplantiffchange = (e, context) => {
    if (context.action === 'remove-value') {
      let defendent = [...defendentlist];
      let finaldefendent = [...defendent, context.removedValue];
      setdefendentlist(finaldefendent);
    }
    if (context.action === 'clear') {
      let defendent = [...defendentlist];
      let finaldefendent = [...defendent, ...context.removedValues];
      setdefendentlist(finaldefendent);
    }
    if (context.action === 'select-option') {
      let defendent = [...defendentlist];
      let finaldefendent = defendent.filter(
        (item1) => !e.some((item2) => item2?.value === item1?.value)
      );
      setdefendentlist(finaldefendent);
    }
  };

  const handleStartClose = (starttime, endtime) => {
    if (
      starttime !== null &&
      endtime !== null &&
      startcalendarvalue === endcalendarvalue &&
      getminutesbetween(starttime.format(format), endtime.format(format)) < 0
    ) {
      setstarttime(null);
      setstarterror("Start time can't greater than end time");
    }
  };

  const handleStartChange = (e) => {
    setstarttime(e);
    setstarterror('');
    setenderror('');
  };

  const handleStartdate = (e) => {
    if (getdaysbetween(new Date(e).toISOString(), moment().format()) < 0) {
      setstartdateerror("start date can't be less than today's date");
    }
    else {
      setstartcalendarvalue(new Date(e).toISOString());
      setendcalendarvalue(new Date(e).toISOString());
      setstartcalendar(false);
      setstartdateerror('');
      setenddateerror('');
    }
  };

  const handleEndChange = (e) => {
    setendtime(e);
    setstarterror('');
    setenderror('');
  };

  const handleEndClose = (starttime, endtime) => {
    if (
      starttime !== null &&
      endtime !== null &&
      startcalendarvalue === endcalendarvalue &&
      getminutesbetween(starttime.format(format), endtime.format(format)) < 0
    ) {
      setendtime(null);
      setenderror("End time can't be greater than start time");
    }
  };

  const chnageDateValue = (type) => {
    if (type === false) {
      setstartcalendarvalue('');
      setstartcalendar(false);
      setstarttime(null);
      setendcalendarvalue('');
      setendcalendar(false);
      setendtime(null);
      setenderror('');
      setstarterror('')
      setstartdateerror('');
    }
  };

  const validate = () => {
    let avalibility = getValues('general_availability');
    let isError = false;
    if (avalibility == 'true' && starttime === null) {
      setstarterror("Start time can't be empty");
      isError = true;
    }
    if (avalibility == 'true' && startcalendarvalue === '') {
      setstartdateerror("Start date can't be empty");
      isError = true;
    }
    if (avalibility == 'true' && endtime === null) {
      setenderror("End time can't be empty");
      isError = true;
    }
    if (avalibility == 'true' && endcalendarvalue === '') {
      setenddateerror("End date can't be empty");
      isError = true;
    }
    return isError;
  };

  const onSubmit = (data) => {
    let isError = validate();
    if (!isError) {
      let payload = {};
      if (data?.general_availability === 'true') {
        const startDate = moment(startcalendarvalue);
        const endDate = moment(endcalendarvalue);

        const mergedStartDate = startDate.set({
          hour: starttime.hour(),
          minute: starttime.minute(),
          second: starttime.second(),
        });

        const mergedEndDate = endDate.set({
          hour: endtime.hour(),
          minute: endtime.minute(),
          second: endtime.second(),
        });

        if (mergedEndDate.diff(mergedStartDate, 'minute') > 0) {
          payload = {
            case_name: data?.case_name,
            defendant_lawyers: data?.defendant_lawyer.map(
              (item) => item?.label?.split(/\(|\)/)[1]
            ),
            plaintiff_lawyers: data?.plaintiff_lawyer.map(
              (item) => item?.label?.split(/\(|\)/)[1]
            ),
            defendant_box_tick: data?.defendant_box_tick,
            plaintiff_box_tick: data?.plaintiff_box_tick,
            creator_availability_start: mergedStartDate?.format(
              'YYYY-MM-DD HH:mm:ss'
            ),
            creator_availability_end: mergedEndDate?.format(
              'YYYY-MM-DD HH:mm:ss'
            ),
          };
          trigger({ payload, axios: axiosAuth });
        } else {
          toast.error("start date can't be bigger than end date");
        }
      } else {
        payload = {
          case_name: data?.case_name,
          defendant_lawyers: data?.defendant_lawyer.map(
            (item) => item?.label?.split(/\(|\)/)[1]
          ),
          plaintiff_lawyers: data?.plaintiff_lawyer.map(
            (item) => item?.label?.split(/\(|\)/)[1]
          ),
          defendant_box_tick: data?.defendant_box_tick,
          plaintiff_box_tick: data?.plaintiff_box_tick,
          creator_availability_start: '',
          creator_availability_end: '',
        };
        trigger({ payload, axios: axiosAuth });
      }
    }
  };

  useEffect(() => {
    if (createData?.status === 200) {
      toast.success('Case review created successfully');
      reset();
      setstartcalendarvalue('');
      setstartcalendar(false);
      setstarttime(null);
      setendcalendarvalue('');
      setendcalendar(false);
      setendtime(null);
      //  redirect('/Physician/caserequest');
      redirect(`${session?.user?.role_id === "8" ? "/Expert" : "/Physician"}/caserequest`)
    }
  }, [createData]);
  return (
    <div className="m-card">
      <div className="create-case-top-img">
        <img src={topbluebg} className="w-full" alt="" />
      </div>
      <div className="c-case-wrap p-[3.125rem] ">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="c-case-wrap-row">
            <div className="grid gap-y-5">
              <div className="c-case-wrap-flex flex md:space-x-8 space-y-5 md:space-y-0 items-center md:flex-row flex-wrap md:flex-nowrap">
                <div className="c-case-wrap-col basis-full">
                  <h5 className="c-case-wrap-row-title w-full">Case Name</h5>
                  <div className="form-field">
                    <input
                      type="text"
                      placeholder="Enter Case Name"
                      className="form-control"
                      {...register('case_name')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="c-case-wrap-row">
            <div className="grid gap-y-5">
              <div className="c-case-wrap-flex flex md:space-x-8 space-y-5 md:space-y-0 items-center md:flex-row flex-wrap md:flex-nowrap">
                <div className="c-case-wrap-col lg:basis-1/2 basis-full">
                  <h5 className="c-case-wrap-row-title w-full">
                    Defendant Lawyer
                  </h5>
                  <div className="form-field flex items-center justify-center !p-0 !border-none">
                    <Select
                      className="s-select flex-1"
                      placeholder="defendent lawyear firm"
                      isClearable
                      isMulti
                      options={defendentlist}
                      value={defendentValue}
                      isLoading={defendentlist?.length === 0}
                      onChange={(e, context) => {
                        defendentOnChange(e);
                        handledefendentchange(e, context);
                      }}
                      {...restdefendentField}
                    />
                  </div>
                  <p className="text-red-700 mb-0">
                    {errors?.defendant_lawyer?.message}
                  </p>
                </div>
                <div className="c-case-wrap-col lg:basis-1/2 basis-full">
                  <h5 className="c-case-wrap-row-title w-full">
                    Plaintiff Lawyer
                  </h5>
                  <div className="form-field flex items-center justify-center !p-0 !border-none">
                    <Select
                      className="s-select flex-1"
                      placeholder="plantiff lawyear firm"
                      isClearable
                      isMulti
                      options={plantifflist}
                      isLoading={plantifflist?.length === 0}
                      value={plantiffValue}
                      onChange={(e, context) => {
                        plantiffOnChange(e);
                        handleplantiffchange(e, context);
                      }}
                      {...restplantiffField}
                    />
                  </div>
                  <p className="text-red-700 mb-0">
                    {errors?.plaintiff_lawyer?.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="c-case-wrap-row">
            <div className="grid gap-y-5">
              <div className="c-case-wrap-flex flex md:space-x-8 space-y-5 md:space-y-0 items-center md:flex-row flex-wrap md:flex-nowrap">
                <div className="c-case-wrap-col lg:basis-1/2 basis-full">
                  <label className="label cursor-pointer justify-start items-center p-0">
                    <input
                      type="checkbox"
                      className="checkbox-sm checkbox-primary mr-[0.625rem] focus:outline-none"
                      {...register('defendant_box_tick')}
                    />
                    <span className="label-text text-[0.9375rem] text-[#8790AF]">
                      Please Tick If Requested for Deposition
                    </span>
                  </label>
                </div>
                <div className="c-case-wrap-col lg:basis-1/2 basis-full">
                  <label className="label cursor-pointer justify-start items-center p-0">
                    <input
                      type="checkbox"
                      className="checkbox-sm checkbox-primary mr-[0.625rem] focus:outline-none"
                      {...register('plaintiff_box_tick')}
                    />
                    <span className="label-text text-[0.9375rem] text-[#8790AF]">
                      Please Tick If Requested for Deposition
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="c-case-wrap-ybg p-7">
            <h1 className="text-xl mb-[0.875rem]">Availability</h1>
            <div className="flex gap-16">
              <label className="label cursor-pointer justify-start items-center p-0 mb-6">
                <input
                  type="radio"
                  value={'false'}
                  className="checkbox-sm checkbox-primary mr-[0.625rem] focus:outline-none"
                  onClick={() => chnageDateValue(false)}
                  {...register('general_availability')}
                />
                <span className="label-text text-[0.9375rem] text-[#8790AF]">
                  Use my availability
                </span>
              </label>
              <label className="label cursor-pointer justify-start items-center p-0 mb-6">
                <input
                  type="radio"
                  value={'true'}
                  className="checkbox-sm checkbox-primary mr-[0.625rem] focus:outline-none"
                  onClick={() => chnageDateValue(true)}
                  {...register('general_availability')}
                />
                <span className="label-text text-[0.9375rem] text-[#8790AF]">
                  Select date
                </span>
              </label>
            </div>
            {watch('general_availability') == 'true' &&
              <div className="flex gap-5">
                <div className="c-case-wrap-field-group">
                  <h5 className="c-case-wrap-row-title w-full">Start Date</h5>
                  <div className="gap-1 relative">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        disabled={watch('general_availability') == 'true'}
                        placeholder="Start Date"
                        className="form-control !bg-transparent !h-12"
                        value={
                          startcalendarvalue !== ''
                            ? getFormattedDate(startcalendarvalue)
                            : ''
                        }
                        readOnly
                      />

                      {watch('general_availability') == 'true' && (
                        <span>
                          <Image
                            src={calendericon}
                            alt=""
                            onClick={() => setstartcalendar(!startcalendar)}
                          />
                        </span>
                      )}

                      {startcalendar && (
                        <Calendar
                          className="absolute top-[3rem] right-0 w-full z-50"
                          name="start"
                          onChange={(e) => {
                            handleStartdate(e);
                          }}
                        />
                      )}
                    </div>
                    {startdateerror !== '' && (
                      <div className="cl-col basis-auto">
                        <span className=" text-red-700 text-xs">
                          {startdateerror}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="c-case-wrap-field-group">
                  <h5 className="c-case-wrap-row-title w-full">Start time</h5>
                  <div className="flex-1">
                    <TimePicker
                      showSecond={false}
                      placeholder="Add Start time"
                      value={starttime}
                      className="s-time-picker w-full"
                      disabled={startcalendarvalue === ''}
                      onChange={handleStartChange}
                      onClose={() => handleStartClose(starttime, endtime)}
                      inputReadOnly
                    />
                    {starterror !== '' && (
                      <div className="cl-col basis-auto">
                        <span className=" text-red-700 text-xs">
                          {starterror}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="c-case-wrap-field-group">
                  <h5 className="c-case-wrap-row-title w-50">End time</h5>
                  <div className="flex items-center gap-1 relative">
                    <div className="gap-1 flex-1">
                      <TimePicker
                        showSecond={false}
                        placeholder="Add end time"
                        value={endtime}
                        className="s-time-picker w-full"
                        disabled={startcalendarvalue === ''}
                        onChange={handleEndChange}
                        onClose={() => handleEndClose(starttime, endtime)}
                        inputReadOnly
                      />
                      {enderror !== '' && (
                        <div className="cl-col basis-auto">
                          <span className=" text-red-700 text-xs">
                            {enderror}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
          <div className="text-left mt-[1.875rem]">
            <button
              type="submit"
              disabled={!isDirty}
              className={`primary-btn ${!isDirty ? 'disable' : ''}`}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCaseReviewDeposition;
