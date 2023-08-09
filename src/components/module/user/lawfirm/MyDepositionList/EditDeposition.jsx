'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import topbluebg from '../../../../../assets/images/create-case-top-blue-bg.png';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import Select from 'react-select';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import {
  WithTokenGetApi,
  WithTokenWithoutTriggerGetApi,
} from '@/services/module/api/getapi';
import { redirect, useParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import { durationextractor } from '@/helpers/mischelper';
import EditAttendees from './EditAttendees';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import {
  WithTokenPostApi,
  WithoutTokenPostApi,
} from '@/services/module/api/postapi';
import Link from 'next/link';
import EditCalendar from './EditCalendar';
import Loader from '../Loader';
import { useSession } from 'next-auth/react';
import SingleCallModal from '../Modal/SingleCallModal';

const options = [
  { value: 'virtual', label: 'Virtual' },
  { value: 'in_person', label: 'In-Person' },
];

const EditDeposition = () => {
  const { id: depoid } = useParams();
  const axiosAuth = useAxiosAuth();
  const {data:session}=useSession();
   const [type, settype] = useState("");
   const [callrecording, setcallrecording] = useState("");
   const [modalIsOpen, setIsOpen] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [purchasetype, setpurchasetype] = useState('');
  const [depocon, setdepocon] = useState("");
  const [formdata, setFromData] = useState({
    start: '',
    end: '',
    invitee_list: [],
    type: '',
  });

  const [startDate, setStartDate] = useState(
    setHours(setMinutes(new Date(), 30), 16)
  );
  const [endDate, setEndDate] = useState(
    setHours(setMinutes(new Date(), 30), 16)
  );
  const {
    trigger: posteventtrigger,
    data: posteventdata,
    error: posteventerror,
  } = useSWRMutation('case/createDeposition', WithTokenPostApi);
  const {
    trigger: Inviteemailtrigger,
    isMutating,
    data: Inviteemaildata,
  } = useSWRMutation('case/sendMailAfterInviteeEdit', WithTokenPostApi);
  const {
    trigger,
    data: updatedepoData,
    error: updatedepoError,
  } = useSWRMutation(`/case/singleEditApiForDepo`, WithoutTokenPostApi);

  const { data: getdepodata, isLoading: getdepodataLoading } = useSWR(
    [`/case/getDepoDetailsById/${depoid}`, axiosAuth],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );
  const { data: getdepocondition } = useSWR(
    [
      `/case/checkSubscriptionCallAvailableByUserId/${session?.user?.id}`,
      axiosAuth,
    ],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );
  useEffect(() => {
    if (updatedepoData?.status === 200) {
      toast.success(updatedepoData?.data?.message);
      redirect(`${session?.user?.role_id === "6" ? "/AttorneyAssistant" : "/Attorney"}/mydepositionlistmanagement`)
    }

    if (
      updatedepoData === undefined &&
      updatedepoError?.response?.status === 300
    ) {
      toast.error(updatedepoError?.response?.data?.message);
    }
  }, [updatedepoData, updatedepoError]);

  useEffect(() => {
    if (getdepodata?.status === 200) {
      let inviteList = getdepodata?.data?.invitee_list.map((item) => {
        return {
          first_name: item?.first_name,
          last_name: item?.last_name,
          email: item?.email,
          role_name: item?.role_name,
          role_id: item?.role_id,
          user_id: item?.user_id,
          status: parseInt(item?.status),
          id: item?.id,
          action: item?.action ? parseInt(item?.action) : 3,
          start_time: item?.requested_start_time,
          end_time: item?.requested_end_time,
          isExistFlag: item.user_id != null && item.user_id != 0 ? 1 : 0,
          isDisableRow: 1,
        };
      });
      settype(getdepodata?.data?.type)
      setcallrecording(getdepodata?.data?.type ==="virtual"?getdepodata?.data?.audio?"audio":"video":"")
      setFromData({
        start: getdepodata?.data?.start,
        end: getdepodata?.data?.end,
        invitee_list: inviteList,
        type: getdepodata?.data?.type,
      });
      setStartDate(modifyDateFormat(getdepodata?.data?.start));
      setEndDate(modifyDateFormat(getdepodata?.data?.end));
    }
  }, [getdepodata]);
 
  const modifyDateFormat = (dateData) => {
    if (dateData) {
      let modify = dateData
        ?.substring(9, dateData?.length - 1)
        ?.split(',')
        .map((item) => Number(item?.trim()));
      return new Date(...modify);
    } else return dateData;
  };

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  function handleapiresponse(data) {
    setcallrecording(purchasetype === 'Audio' ? 'audio' : 'video');
     setdepocon(data);
    setIsOpen(false);
  }
  const nextHandler = (fromValue) => {
    setFromData((preData) => ({ ...preData, invitee_list: fromValue }));
    let sessionpayload={
      type,
      single_call_history_id: (depocon?.subscription)?null:
      callrecording==="audio"?getdepodata.data?.audio?getdepodata?.data?.single_call_history_id: getdepocondition?.data?.data?.single_audio_call_history_id !==null?
      getdepocondition?.data?.data?.single_audio_call_history_id:depocon?.single_audio_call_history_id:callrecording=="video" &&
      !getdepodata.data?.audio?getdepodata?.data?.single_call_history_id:
      getdepocondition?.data?.data?.single_video_call_history_id !==null?
      getdepocondition?.data?.data?.single_video_call_history_id:depocon?.single_video_call_history_id,
      audio: callrecording==="audio"?true:false,
    }
    sessionStorage.setItem('other', JSON.stringify(sessionpayload));
    setIsNext(!isNext);
  };
  
  useEffect(() => {
    if (posteventdata?.status === 200 || posteventdata?.status === 202) {
      Inviteemailtrigger({ payload: posteventdata?.data, axios: axiosAuth });
    }
  }, [posteventdata]);
  useEffect(() => {
    if (isMutating) {
      toast.success('Deposition Updated Successfully');
      redirect(`${session?.user?.role_id === "6" ? "/AttorneyAssistant" : "/Attorney"}/casemanagement/casedetails/${getdepodata?.data?.case_id}`)
    }
  }, [isMutating]);
  // Select deposition type handler
  const setSelectedOption = (e) => {
    setFromData({ ...formdata, type: e.value });
  };
  const SaveHandler = (formdata) => {
    let tempuser = [...formdata];
    let inviteeuser = tempuser?.map((item) => {
      return {
        first_name: item?.first_name,
        last_name: item?.last_name,
        email: item?.email,
        role_name: item?.role_name,
        role_id: item?.role_id,
        user_id: item?.user_id !== null ? item?.user_id : 0,
        isExistFlag: item?.isExistFlag,
      };
    });
    let virtualpayload={
      deposition_id: depoid,
      case_id: getdepodata?.data?.case_id,
      type,
      single_call_history_id: (depocon?.subscription)?null:
      callrecording==="audio"?getdepodata.data?.audio?getdepodata?.data?.single_call_history_id: getdepocondition?.data?.data?.single_audio_call_history_id !==null?
      getdepocondition?.data?.data?.single_audio_call_history_id:depocon?.single_audio_call_history_id:callrecording=="video" &&
      !getdepodata.data?.audio?getdepodata?.data?.single_call_history_id:
      getdepocondition?.data?.data?.single_video_call_history_id !==null?
      getdepocondition?.data?.data?.single_video_call_history_id:depocon?.single_video_call_history_id,
      audio: callrecording==="audio"?true:false,
      invite_users: inviteeuser,
    }
    let inpersonpayload = {
      deposition_id: depoid,
      case_id: getdepodata?.data?.case_id,
      type,
      invite_users: inviteeuser,
    };
   posteventtrigger({ payload: type==="virtual"? virtualpayload:inpersonpayload, axios: axiosAuth });
  };
  let handletype=(e)=>{
   settype(e.target.value)
  }
  useEffect(() => {
    if (getdepocondition?.status === 200) {
      setdepocon(getdepocondition?.data?.data);
    }
  }, [getdepocondition]);
  let handlerecordingtype=(e)=>{
    if(getdepodata?.data?.audio && e.target.value==="audio"){
      setcallrecording(e.target.value)
    }
    if(!getdepodata?.data?.audio && e.target.value==="video"){
      setcallrecording(e.target.value)
    }
    if(!getdepodata?.data?.audio && e.target.value==="audio" && (depocon?.single_audio_call_history_id!==null ||
      depocon?.subscription
      )){
        setcallrecording(e.target.value)
    }
    if(getdepodata?.data?.audio && e.target.value==="video" && depocon?.single_video_call_history_id!==null){
        setcallrecording(e.target.value)
    }
    if(!getdepodata?.data?.audio && e.target.value==="audio" && depocon?.single_audio_call_history_id===null &&
      !depocon?.subscription
      ){
        openModal()
        setpurchasetype('Audio');
    }
    if(getdepodata?.data?.audio && e.target.value==="video" && depocon?.single_video_call_history_id===null){
      openModal()
      setpurchasetype('Video');
  }
  }
  return (
    <>
      {!isNext ? (
        <div className="m-card">
          <div className="create-case-top-img">
            <Image src={topbluebg} className="w-full" alt="" />
          </div>
          {getdepodata !== undefined ? (
            <div className="c-case-wrap p-5 ">
              <form noValidate>
                <div>
                  <div className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-2 gap-4">
                    <div className="c-case-wrap-field-group">
                      <h5 className="c-case-wrap-row-title w-full">
                        Deposition No.
                      </h5>
                      <p className="mb-0 text-sm">
                        {getdepodata?.data?.deposition_number}
                      </p>
                    </div>
                    <div className="c-case-wrap-field-group">
                      <h5 className="c-case-wrap-row-title w-full">
                        Deponent Name
                      </h5>
                      <p className="mb-0 text-sm">{getdepodata?.data?.deponent_name ? getdepodata?.data?.deponent_name : '--'}</p>
                    </div>
                    <div className="c-case-wrap-field-group">
                      <h5 className="c-case-wrap-row-title w-full">
                        Start Date & Time
                      </h5>
                      <p className="mb-0 text-sm">
                        {getdepodata?.data?.start
                          ? moment(
                            modifyDateFormat(getdepodata?.data?.start)
                          ).format('MMMM DD, YYYY h:mm A')
                          : '--'}
                      </p>
                    </div>
                    <div className="c-case-wrap-field-group">
                      <h5 className="c-case-wrap-row-title w-full">
                        End Date & Time
                      </h5>
                      <p className="mb-0 text-sm">
                        {getdepodata?.data?.end
                          ? moment(
                            modifyDateFormat(getdepodata?.data?.end)
                          ).format('MMMM DD, YYYY h:mm A')
                          : '--'}
                      </p>
                    </div>
                    <div className="c-case-wrap-field-group">
                      <h5 className="c-case-wrap-row-title w-full">Duration</h5>
                      <p className="mb-0 text-sm">
                        {getdepodata?.data?.start
                          ? durationextractor(
                            modifyDateFormat(getdepodata?.data?.start),
                            modifyDateFormat(getdepodata?.data?.end)
                          )
                          : '--'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    <div className="c-case-wrap-field-group">
                      <h5 className="mb-6">Deposition Type</h5>
                      <div className="flex flex-wrap justify-start form-check-wrap mb-8">
                        <div className="px-3 mb-6 md:mb-0 form-check mr-4">
                          <input
                            className="form-check-input"
                            name="type"
                            type="radio"
                            value="virtual"
                            id="virtual"
                            checked={type==="virtual"}
                            onChange={handletype}
                          />
                          <label className="form-check-label" for="virtual">
                            Virtual
                          </label>
                        </div>
                        <div className="px-3 mb-6 md:mb-0 form-check">
                          <input
                            className="form-check-input"
                            name="type"
                            type="radio"
                            value="in_person"
                            id="inperson"
                            checked={type==="in_person"}
                            onChange={handletype}
                          />
                          <label className="form-check-label" for="inperson">
                            Inperson
                          </label>
                        </div>
                      </div>
                       {type ==="virtual" && <>
                       <h5 className="mb-6">Call Recording Type</h5>
                      <div className="flex flex-wrap justify-start form-check-wrap !mb-0">
                        <div className="px-3 md:mb-0 form-check mr-4">
                          <input
                            className="form-check-input"
                            name="calltype"
                            type="radio"
                            value="audio"
                            id="audio"
                            checked={callrecording==="audio"}
                            onChange={handlerecordingtype}
                          />
                          <label className="form-check-label" for="audio">
                            Audio
                          </label>
                        </div>
                        <div className="px-3 md:mb-0 form-check">
                          <input
                            className="form-check-input"
                            name="calltype"
                            type="radio"
                            value="video"
                            id="video"
                            checked={callrecording==="video"}
                            onChange={handlerecordingtype}
                          />
                          <label className="form-check-label" for="video">
                            Video
                          </label>
                        </div>
                      </div>
                       
                       </>}
                   
                    </div>
                  </div>
                  {!isNext && (
                    <EditAttendees
                      onNext={nextHandler}
                      onSave={SaveHandler}
                      axiosAuth={axiosAuth}
                      attendeesList={formdata.invitee_list}
                      depoId={depoid}
                      startdate={
                        getdepodata?.data?.start ? getdepodata?.data?.start : ''
                      }
                      enddate={
                        getdepodata?.data?.end ? getdepodata?.data?.end : ''
                      }
                    />
                  )}
                </div>

                {modalIsOpen && (
          <SingleCallModal
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            purchasetype={purchasetype}
            axiosAuth={axiosAuth}
            apiresponse={handleapiresponse}
          />
        )}
              </form>
            </div>
          ) : (
            <Loader />
          )}
        </div>
      ) : (
        <EditCalendar />
      )}
    </>
  );
};

export default EditDeposition;
