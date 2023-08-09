'use client';
import React, { useState, useEffect } from 'react';
import addicon from '../../../../../assets/images/icons/add-icon.svg';
import removeicon from '../../../../../assets/images/icons/remove-icon.svg';
import Image from 'next/image';
import Select, { components } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import { MenuListFooter, MenuList } from '@/helpers/selectpaginationhelper';
import useDebounce from '@/lib/hooks/useDebounce';
import { WithTokenPostApi } from '@/services/module/api/postapi';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SingleCallModal from '../Modal/SingleCallModal';

const Createdeposition = ({ caseid, axiosAuth }) => {
  const [createdepo, setcreatedepo] = useState(false);
  const [role, setrole] = useState([]);
  const { data: session } = useSession();
  const [user, setuser] = useState([]);
  const [calltype, setcalltype] = useState('');
  const [usertotal, setusertotal] = useState(0);
  const [search, setsearch] = useState('');
  const [depocon, setdepocon] = useState('');
  const [page, setpage] = useState(1);
  const [isclicked, setisclicked] = useState(false);
  const [in_person_address, setpersonaddress] = useState('');
  const [purchasetype, setpurchasetype] = useState('');
  const [type, settype] = useState('virtual');
  const [roledata, setroledata] = useState([
    {
      label: '',
      value: '',
    },
  ]);
  const [userdata, setuserdata] = useState([
    {
      label: '',
      value: '',
      first_name: '',
      last_name: '',
      role_id: '',
    },
  ]);
  const [errordepo, seterrordepo] = useState('');
  const [personerror, setpersonerror] = useState('');
  const debounceSearch = useDebounce(search, 500);
  const [formdata, setformdata] = useState([
    {
      first_name: '',
      last_name: '',
      email: '',
      role_name: '',
      role_id: '',
      user_id: '',
      isExistFlag: 0,
    },
  ]);
  const {
    data: getdata,
    error,
    isLoading: getdataLoading,
  } = useSWR(
    [
      `/getAllUsersRoles?page=${page}&size=10&search=${debounceSearch}`,
      axiosAuth,
    ],
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
  const [modalIsOpen, setIsOpen] = useState(false);
  const {
    trigger: posttrigger,
    data: postdata,
    error: posterror,
  } = useSWRMutation(`/case/createDeposition`, WithTokenPostApi);
  useEffect(() => {
    if (postdata?.status === 200) {
      toast.success(postdata?.data?.message);
      redirect(
        `${
          session?.user?.role_id === '6' ? '/AttorneyAssistant' : '/Attorney'
        }/depositionmanagement/createdeposition/${
          postdata?.data?.deposition_id
        }`
      );
    }
  }, [postdata]);
  useEffect(() => {
    if (debounceSearch !== '') {
      setpage(1);
      setuser([]);
      setisclicked(true);
    } else if (debounceSearch === '' && isclicked) {
      setpage(1);
      setuser([]);
      setisclicked(false);
    }
  }, [debounceSearch]);
  useEffect(() => {
    if (getdata?.status === 200) {
      if (user?.length === 0 && getdata?.data?.totalCount !== 0) {
        let users = getdata?.data?.data?.allUsersList?.map((item) => {
          return {
            label: item?.email,
            value: item?.id,
            first_name: item?.first_name,
            last_name: item?.last_name,
            role_id: item?.role_id,
          };
        });
        setuser(users);
        setusertotal(getdata?.data?.totalCount);
      } else if (user?.length > 9) {
        let users = getdata?.data?.data?.allUsersList?.map((item) => {
          return {
            label: item?.email,
            value: item?.id,
            first_name: item?.first_name,
            last_name: item?.last_name,
            role_id: item?.role_id,
          };
        });
        let tempuser = [...user, ...users];
        let uniqueObjects = tempuser.filter(
          (obj, index, self) =>
            index === self.findIndex((t) => t.value === obj.value)
        );
        setuser(uniqueObjects);
      }
      if (debounceSearch === '' && page === 1) {
        let role = getdata?.data?.data?.allRoleList?.map((item) => {
          return {
            label: item?.role,
            value: item?.id,
          };
        });
        setrole(role);
      }
    }
  }, [getdata]);
  useEffect(() => {
    if (getdepocondition?.status === 200) {
      setdepocon(getdepocondition?.data?.data);
    }
  }, [getdepocondition]);
  const handleclick = () => {
    let newformdata = {
      first_name: '',
      last_name: '',
      email: '',
      role_name: '',
      role_id: '',
      user_id: '',
      isExistFlag: 0,
    };
    let newuserdata = {
      value: '',
      label: '',
      first_name: '',
      last_name: '',
      role_id: '',
    };
    let newroledata = {
      value: '',
      label: '',
    };
    let temp = [...formdata, newformdata];
    let temp2 = [...userdata, newuserdata];
    let temp3 = [...roledata, newroledata];
    setformdata(temp);
    setroledata(temp3);
    setuserdata(temp2);
    seterrordepo('');
  };
  const adduserOption = async () => {
    await setpage((prev) => prev + 1);
    seterrordepo('');
  };
  const handleuserinputchange = (e) => {
    setsearch(e);
    seterrordepo('');
  };
  const handleuserchange = (e, i) => {
    let validation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (e.__isNew__ === true && e.label.match(validation) !== null) {
      let temp = [...formdata];
      let roleobject = { value: '', label: '' };
      let selectuser = userdata[i];
      let selectrole = roledata[i];
      temp[i].isExistFlag = 0;
      temp[i].user_id = 0;
      temp[i].email = e.label;
      temp[i].first_name = '';
      temp[i].last_name = '';
      temp[i].role_id = '';
      setformdata(temp);
      seterrordepo('');
      if (selectuser === undefined) {
        setuserdata([...userdata, e]);
      } else {
        let tempuser = [...userdata];
        tempuser.splice(i, 1);
        tempuser.splice(i, 0, e);
        setuserdata(tempuser);
      }
      if (selectrole === undefined) {
        setroledata([...roledata, roleobject]);
      } else {
        let temprole = [...roledata];
        temprole.splice(i, 1);
        temprole.splice(i, 0, roleobject);
        setroledata(temprole);
      }
    }
    if (e.__isNew__ === true && e.label.match(validation) === null) {
      seterrordepo('Please add email in proper format');
      let temp = [...formdata];
      let temp2 = [...userdata];
      let temp3 = [...roledata];
      let selectrole = roledata[i];
      let selectuser = userdata[i];
      temp[i].isExistFlag = 0;
      temp[i].user_id = 0;
      temp[i].isExistFlag = 0;
      temp[i].email = '';
      temp[i].first_name = '';
      temp[i].last_name = '';
      temp[i].role_id = '';
      temp[i].role_name = '';
      if (selectuser !== undefined) {
        temp2[i].value = '';
        temp2[i].label = '';
        temp2[i].first_name = '';
        temp2[i].last_name = '';
        temp2[i].role_id = '';
      }
      if (selectrole !== undefined) {
        temp3[i].value = '';
        temp3[i].label = '';
      }
      setuserdata(temp2);
      setformdata(temp);
      setroledata(temp3);
    }
    if (e.__isNew__ !== true) {
      let temp = [...formdata];
      let choosenrole = role?.find((item) => item?.value === e.role_id);
      let selectrole = roledata[i];
      let selectuser = userdata[i];
      temp[i].first_name = e.first_name;
      temp[i].last_name = e.last_name;
      temp[i].role_id = e.role_id;
      temp[i].isExistFlag = 1;
      temp[i].user_id = e.value;
      temp[i].role_name = choosenrole.label;
      temp[i].email = e.label;
      setformdata(temp);
      seterrordepo('');
      if (selectrole === undefined) {
        setroledata([...roledata, choosenrole]);
      } else {
        let temprole = [...roledata];
        temprole.splice(i, 1);
        temprole.splice(i, 0, choosenrole);
        setroledata(temprole);
      }
      if (selectuser === undefined) {
        setuserdata([...userdata, e]);
      } else {
        let tempuser = [...userdata];
        tempuser.splice(i, 1);
        tempuser.splice(i, 0, e);
        setuserdata(tempuser);
      }
    }
  };
  const handlerolechange = (e, i) => {
    let temp = [...formdata];
    temp[i].role_id = e.value;
    temp[i].role_name = e.label;
    setformdata(temp);
    seterrordepo('');
    let selectrole = roledata[i];
    if (selectrole === undefined) {
      setroledata([...roledata, e]);
    } else {
      let temprole = [...roledata];
      temprole.splice(i, 1);
      temprole.splice(i, 0, e);
      setroledata(temprole);
    }
  };
  const handleremoveclick = (i) => {
    let temp = [...formdata];
    let temp2 = [...roledata];
    let temp3 = [...userdata];
    temp.splice(i, 1);
    temp2.splice(i, 1);
    temp3.splice(i, 1);
    setformdata(temp);
    setroledata(temp2);
    setuserdata(temp3);
    seterrordepo('');
  };
  const handleinputchange = (e, i, type) => {
    let temp = [...formdata];
    temp[i][type] = e.target.value;
    setformdata(temp);
    seterrordepo('');
  };
  const onChangeHandler = (e) => {
    settype(e.target.value);
    setcalltype('');
    if (e.target.value === 'virtual') {
      setpersonaddress('');
      setpersonerror('');
    }
  };
  const onCallTypeChangeHandler = (e) => {
    if (
      e.target.value === 'audio' &&
      depocon?.single_audio_call_history_id === null &&
      depocon?.subscription
    ) {
      setcalltype(e.target.value);
    }
    if (
      e.target.value === 'audio' &&
      depocon?.single_audio_call_history_id !== null &&
      depocon?.audio
    ) {
      setcalltype(e.target.value);
    }
    if (
      e.target.value === 'audio' &&
      depocon?.single_audio_call_history_id === null &&
      !depocon?.audio &&
      !depocon?.subscription
    ) {
      openModal();
      setpurchasetype('Audio');
    }
    if (
      e.target.value === 'video' &&
      depocon?.single_video_call_history_id !== null
    ) {
      setcalltype(e.target.value);
    }
    if (
      e.target.value === 'video' &&
      depocon?.single_video_call_history_id === null
    ) {
      openModal();
      setpurchasetype('Video');
    }
  };
  const validate = () => {
    let isError = false;
    let validation = formdata?.every(
      (item) => item.first_name && item.email && item.last_name && item.role_id
    );
    if (!validation) {
      seterrordepo("Attendees can't be empty");
      isError = true;
    }
    if (type === 'in_person' && in_person_address === '') {
      setpersonerror("Address can't be empty");
      isError = true;
    }
    return isError;
  };
  const handletime = () => {
    let isError = validate();
    let payload = '';
    if (!isError) {
      if (type === 'virtual') {
        payload = {
          deposition_id: '',
          case_id: caseid,
          type: type,
          single_call_history_id:
            calltype === 'video'
              ? depocon?.single_video_call_history_id
              : depocon?.subscription
              ? null
              : depocon?.single_audio_call_history_id,
          audio: calltype === 'audio' ? true : false,
          invite_users: formdata,
        };
      }
      if (type === 'in_person') {
        payload = {
          deposition_id: '',
          case_id: caseid,
          type: type,
          in_person_address: in_person_address,
          invite_users: formdata,
        };
      }
      posttrigger({ payload, axios: axiosAuth });
    }
  };

  function openModal() {
    setIsOpen(true);
  }
  const handlemodal = () => {
    setcreatedepo(!createdepo);
  };
  function closeModal() {
    setIsOpen(false);
  }
  function handleapiresponse(data) {
    setcalltype(purchasetype === 'Audio' ? 'audio' : 'video');
    setdepocon(data);
    setIsOpen(false);
  }
  return (
    <>
      <div className="text-left flex items-center gap-3 mt-8">
        <div className="primary-btn" onClick={handlemodal}>
          Create Deposition
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
      </div>
      {createdepo && (
        <div className="bg-white rounded-xl p-6 mt-8">
          <h4 className="mb-6">Deposition Type</h4>
          <div className="flex flex-wrap justify-start form-check-wrap mb-8">
            <div className="px-3 mb-6 md:mb-0 form-check mr-4">
              <input
                className="form-check-input"
                name="type"
                type="radio"
                value="virtual"
                id="virtual"
                onChange={onChangeHandler}
                checked={type === 'virtual'}
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
                onChange={onChangeHandler}
                checked={type === 'in_person'}
              />
              <label className="form-check-label" for="inperson">
                In Person
              </label>
            </div>
          </div>
          {type === 'virtual' && (
            <>
              <h4 className="mb-6">Call Recording Type</h4>
              <div className="flex flex-wrap justify-start form-check-wrap mb-8">
                <div className="px-3 mb-6 md:mb-0 form-check mr-4">
                  <input
                    className="form-check-input"
                    name="calltype"
                    type="radio"
                    value="audio"
                    id="audio"
                    onChange={onCallTypeChangeHandler}
                    checked={calltype === 'audio'}
                  />
                  <label className="form-check-label" for="audio">
                    Audio
                  </label>
                </div>
                <div className="px-3 mb-6 md:mb-0 form-check">
                  <input
                    className="form-check-input"
                    name="calltype"
                    type="radio"
                    value="video"
                    id="video"
                    onChange={onCallTypeChangeHandler}
                    checked={calltype === 'video'}
                  />
                  <label className="form-check-label" for="video">
                    Video
                  </label>
                </div>
              </div>
            </>
          )}
          {(type === 'in_person' || calltype !== '') && (
            <div className="w-full">
              <h5 className="w-full flex mb-5 text-lg">Attendees</h5>
            </div>
          )}
          {(type === 'in_person' || calltype !== '') &&
            formdata?.map((item, i) => (
              <div
                className="flex md:space-x-4 space-y-5 md:space-y-0 items-start md:flex-row flex-wrap md:flex-nowrap"
                key={i}
              >
                <div className="c-case-wrap-col lg:basis-1/2 basis-full">
                  <h5 className="pb-4">Email ID</h5>
                  <div className="select-dropdown">
                    <CreatableSelect
                      className="s-select z-40"
                      options={user?.filter(
                        (obj) =>
                          !userdata?.some(
                            (remobj) => remobj.value === obj.value
                          )
                      )}
                      placeholder="Type something ..."
                      components={{
                        MenuList,
                        MenuListFooter: (
                          <MenuListFooter
                            showing={user?.length}
                            total={usertotal}
                            onClick={adduserOption}
                          />
                        ),
                      }}
                      value={userdata[i]?.label !== '' && userdata[i]}
                      onChange={(e) => {
                        handleuserchange(e, i);
                      }}
                      onInputChange={handleuserinputchange}
                    />
                  </div>
                </div>
                <div className="c-case-wrap-col lg:basis-1/2 basis-full">
                  <h5 className="pb-4"> First Name</h5>
                  <div className="form-field">
                    <input
                      type="text"
                      placeholder="Enter First Name"
                      className="form-control"
                      value={item?.first_name}
                      onChange={(e) => handleinputchange(e, i, 'first_name')}
                      disabled={item?.isExistFlag === 1}
                    />
                  </div>
                </div>
                <div className="c-case-wrap-col lg:basis-1/2 basis-full">
                  <h5 className="pb-4">Last Name</h5>
                  <div className="form-field">
                    <input
                      type="text"
                      placeholder="Enter Last Name"
                      className="form-control"
                      value={item?.last_name}
                      onChange={(e) => handleinputchange(e, i, 'last_name')}
                      disabled={item?.isExistFlag === 1}
                    />
                  </div>
                </div>
                <div className="c-case-wrap-col lg:basis-1/2 basis-full">
                  <h5 className="pb-4">Role</h5>
                  <div className="select-dropdown">
                    <Select
                      className="s-select z-40"
                      options={role}
                      value={roledata[i]?.label !== '' && roledata[i]}
                      onChange={(e) => handlerolechange(e, i)}
                      isDisabled={item?.isExistFlag === 1}
                      placeholder="Select a role"
                    />
                  </div>
                </div>
                <div className="c-case-wrap-col lg:basis-1/12 basis-full">
                  <div className="flex gap-2 h-28 items-center flex-wrap">
                    <div className="cl-col-btn add" onClick={handleclick}>
                      <Image src={addicon} alt="" />
                    </div>
                  </div>
                  {/* {formdata} */}
                </div>
                {formdata?.length > 1 && (
                  <div className="c-case-wrap-col lg:basis-1/12 basis-full">
                    <div className="flex gap-2 h-28 items-center flex-wrap">
                      <div
                        className="cl-col-btn add"
                        onClick={() => handleremoveclick(i)}
                      >
                        <Image src={removeicon} alt="" />
                      </div>
                    </div>
                    {/* {formdata} */}
                  </div>
                )}
              </div>
            ))}
          <p className="text-red-700 mb-0">{errordepo}</p>
          <div className="w-full">
            {type === 'in_person' && (
              <div className="c-case-wrap-col w-full pb-8">
                <h5 className="pb-4">Address</h5>
                <div className="form-field textarea">
                  <textarea
                    name=""
                    id=""
                    className="form-control"
                    value={in_person_address}
                    onChange={(e) => {
                      setpersonaddress(e.target.value);
                      setpersonerror('');
                    }}
                  ></textarea>
                </div>
                <p className="text-red-700 mb-0">{personerror}</p>
              </div>
            )}

            <div className="text-left mt-2">
              <button
                className="primary-btn btn-outline mr-3"
                onClick={() => setcreatedepo(false)}
              >
                Cancel
              </button>
              <button className="primary-btn" onClick={handletime}>
                Set Time
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Createdeposition;
