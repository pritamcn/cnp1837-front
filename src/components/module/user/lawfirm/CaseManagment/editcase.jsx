'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import removeicon from '../../../../../assets/images/icons/remove-icon.svg';
import addicon from '../../../../../assets/images/icons/add-icon.svg';
import topbluebg from '../../../../../assets/images/create-case-top-blue-bg.png';
import fileuploadicon from '../../../../../assets/images/icons/file-upload-icon.svg';
import CloseIcon from '../../../../../assets/images/case-management/create-case/close-icon.svg';
import { useForm, useFieldArray, useController } from 'react-hook-form';
import Select, { components } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import {
  WithTokenGetApi,
  WithTokenTriggerPaginationGetApi,
} from '@/services/module/api/getapi';
import Uploadfilesmodal from '@/components/module/common/modal/uploadfilesmodal';
import { MenuListFooter, MenuList } from '@/helpers/selectpaginationhelper';
import { WithTokenMultipleFormdataPostApi } from '@/services/module/api/postapi';
import useDebounce from '@/lib/hooks/useDebounce';
import { redirect, useParams } from 'next/navigation';
import { UpdateWithTokenapi } from '@/services/module/api/putapi';
import { useSession } from 'next-auth/react';
import Loader from '../Loader';
import AddExternalLawyer from '../Modal/AddExternalLawyer';
import InactiveCasemodal from '../Modal/InactiveCaseModal';

const EditCase = () => {
  const [uploadfile, setuploadfile] = useState(false);
  const { id: caseid } = useParams();
  const { data } = useSession();
  const [plantifflist, setplantifflist] = useState([]);
  const [citydata, setcitydata] = useState([]);
  const [countydata, setcountydata] = useState([]);
  const [file, setfile] = useState([]);
  const [newfile, setnewfile] = useState([]);
  const [defendentlist, setdefendentlist] = useState([]);
  const [statedata, setstatedata] = useState([]);
  const [searchstate, setsearchstate] = useState('');
  const [searchcity, setsearchcity] = useState('');
  const [searchcounty, setsearchcounty] = useState('');
  const [statepage, setstatepage] = useState(1);
  const [citypage, setcitypage] = useState(1);
  const [countypage, setcountypage] = useState(1);
  const [statetotal, setstatetotal] = useState(0);
  const [citytotal, setcitytotal] = useState(0);
  const [countytotal, setcountytotal] = useState(0);
  const [selectstate, setselectstate] = useState('');
  const [issearchclicked, setissearchclicked] = useState(false);
  const [iscityclicked, setiscityclicked] = useState(false);
  const [iscountyclicked, setiscountyclicked] = useState(false);
  const axiosAuth = useAxiosAuth();
  const debouncedSearchstate = useDebounce(searchstate, 500);
  const debouncedSearchcity = useDebounce(searchcity, 500);
  const debouncedSearchcounty = useDebounce(searchcounty, 500);
  const [check, setcheck] = useState(false);
  const [payload, setpayload] = useState(null);
  const [modalStatus, setModalStatus] = useState({
    isShow: false,
    type: '',
    contaxt: '',
    event: '',
  });

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
  const { data: getStatedata } = useSWR(
    [
      `/getStateList?search=${debouncedSearchstate}&size=10&page=${statepage}`,
      axiosAuth,
    ],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );
  const { data: getcasedata, isLoading: getcasedataLoading } = useSWR(
    [`/case/getCaseDetails/${caseid}`, axiosAuth],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );

  const { trigger: citytrigger, data: getcitydata } = useSWRMutation(
    `/getCityList`,
    WithTokenTriggerPaginationGetApi
  );
  const { trigger: countytrigger, data: getcountydata } = useSWRMutation(
    `/getCountyList`,
    WithTokenTriggerPaginationGetApi
  );
  const {
    trigger: fileuploadtrigger,
    isMutating,
    data: filedata,
    error: fileuploaderror,
  } = useSWRMutation(
    '/fileUpload/case_upload',
    WithTokenMultipleFormdataPostApi
  );
  const {
    trigger: puttrigger,
    data: putdata,
    error: puterror,
  } = useSWRMutation(`/case/updateCaseDetails/${caseid}`, UpdateWithTokenapi);
  useEffect(() => {
    if (filedata?.status === 200) {
      delete payload['files'];
      let oldfile = [];
      if (file?.length > 0) {
        oldfile = file?.map((item) => {
          return {
            file_name: item?.file_name,
          };
        });
      }
      let files = [...oldfile, ...filedata?.data?.fileData];
      let temppayload = { ...payload, files };
      puttrigger({ data: temppayload, axios: axiosAuth });
    }
  }, [filedata]);
  useEffect(() => {
    if (puterror !== undefined) {
      setError('case_number', {
        type: 'custom',
        message: puterror?.response?.data?.message,
      });
    }
    if (putdata?.status === 200) {
      reset();
      toast.success(putdata?.data?.message);
      redirect(
        `${
          data?.user?.role_id === '6' ? '/AttorneyAssistant' : '/Attorney'
        }/casemanagement`
      );
    }
  }, [putdata, puterror]);
  useEffect(() => {
    if (debouncedSearchstate !== '') {
      setstatepage(1);
      setstatedata([]);
      setissearchclicked(true);
    } else if (debouncedSearchstate === '' && issearchclicked) {
      setstatepage(1);
      setstatedata([]);
      setissearchclicked(false);
    }
  }, [debouncedSearchstate]);
  useEffect(() => {
    if (debouncedSearchcity !== '') {
      setcitypage(1);
      setcitydata([]);
      setiscityclicked(true);
      citytrigger({
        id: selectstate,
        axios: axiosAuth,
        page: 1,
        search: debouncedSearchcity,
        size: 10,
      });
    } else if (debouncedSearchcity === '' && iscityclicked) {
      setcitypage(1);
      setcitydata([]);
      setiscityclicked(false);
      citytrigger({
        id: selectstate,
        axios: axiosAuth,
        page: 1,
        search: debouncedSearchcity,
        size: 10,
      });
    }
  }, [debouncedSearchcity]);
  useEffect(() => {
    if (debouncedSearchcounty !== '') {
      setcountypage(1);
      setcountydata([]);
      setiscountyclicked(true);
      countytrigger({
        id: selectstate,
        axios: axiosAuth,
        page: 1,
        search: debouncedSearchcounty,
        size: 10,
      });
    } else if (debouncedSearchcounty === '' && iscountyclicked) {
      setcountypage(1);
      setcountydata([]);
      setiscountyclicked(false);
      countytrigger({
        id: selectstate,
        axios: axiosAuth,
        page: 1,
        search: debouncedSearchcounty,
        size: 10,
      });
    }
  }, [debouncedSearchcounty]);
  useEffect(() => {
    if (getStatedata?.status === 200) {
      if (statedata?.length === 0 && getStatedata?.data?.data?.count !== 0) {
        let finaldata = getStatedata.data.data?.map((item) => {
          return {
            value: item.state_id,
            label: item.state_name,
          };
        });
        setstatedata(finaldata);
        setstatetotal(getStatedata?.data?.totalCount);
      } else if (statedata?.length > 9) {
        let finaldata = getStatedata.data.data?.map((item) => {
          return {
            value: item.state_id,
            label: item.state_name,
          };
        });
        setstatedata([...statedata, ...finaldata]);
      }
    }
  }, [getStatedata]);
  useEffect(() => {
    if (getcitydata?.status === 200) {
      if (citydata?.length === 0 && getcitydata?.data?.data?.count !== 0) {
        let finaldata = getcitydata.data.data.map((item) => {
          return {
            id: item?.id,
            value: item.city,
            label: item.city,
          };
        });
        setcitydata(finaldata);
        setcitytotal(getcitydata?.data?.totalCount);
      } else if (citydata?.length > 9) {
        let finaldata = getcitydata.data.data.map((item) => {
          return {
            value: item.city,
            label: item.city,
          };
        });
        setcitydata([...citydata, ...finaldata]);
      }
    }
  }, [getcitydata]);
  useEffect(() => {
    if (getcountydata?.status === 200) {
      if (
        countydata?.length === 0 &&
        getcountydata?.data?.data?.count?.length !== 0
      ) {
        let finaldata = getcountydata.data.data.map((item) => {
          return {
            value: item.label,
            label: item.label,
          };
        });
        // setcitydata(finaldata)
        setcountydata(finaldata);
        setcountytotal(getcountydata?.data?.totalCount);
      } else if (countydata?.length > 9) {
        let finaldata = getcountydata.data.data.map((item) => {
          return {
            value: item.label,
            label: item.label,
          };
        });
        setcountydata([...countydata, ...finaldata]);
      }
    }
  }, [getcountydata]);
  useEffect(() => {
    if (getdata?.data?.data?.length > 0) {
      setplantifflist(getdata?.data?.data);
      setdefendentlist(getdata?.data?.data);
    }
  }, [getdata]);
  useEffect(() => {
    if (getcasedata?.status === 200) {
      setValue('details', getcasedata?.data?.data?.details);
      setValue('case_number', getcasedata?.data?.data?.case_number);
      setValue('claim_number', getcasedata?.data?.data?.claim_number);
      setValue('court_number', getcasedata?.data?.data?.court_number);
      setValue('file_number', getcasedata?.data?.data?.file_number);
      setValue('defendant_lawyer', getcasedata?.data?.data?.defendant_lawyer);
      setValue('plaintiff_lawyer', getcasedata?.data?.data?.plaintiff_lawyer);
      setValue('defendant', getcasedata?.data?.data?.defendant);
      setValue('plaintiff', getcasedata?.data?.data?.plaintiff);
      setValue('state', getcasedata?.data?.data?.state);
      setValue('city', getcasedata?.data?.data?.city);
      setValue('county', getcasedata?.data?.data?.county);
      setfile(getcasedata?.data?.data?.files);

      citytrigger({
        id: getcasedata?.data?.data?.state?.label,
        axios: axiosAuth,
        page: 1,
        search: '',
        size: 10,
      });

      countytrigger({
        id: getcasedata?.data?.data?.state?.label,
        axios: axiosAuth,
        page: 1,
        search: '',
        size: 10,
      });
    }
  }, [getcasedata]);
  const defendentlawyerSchema = z.object({
    label: z.string().min(1, { message: "Defendent lawyer can't be empty" }),
    value: z.any().optional(),
  });
  const plantifflawyerSchema = z.object({
    label: z.string().min(1, { message: "Plaintiff lawyer can't be empty" }),
    value: z.any().optional(),
  });
  const defendant = z.object({
    name: z.string().min(1, { message: "Defendant name can't be empty" }),
    email: z
      .string()
      .min(1, { message: "Defendent email can't be empty" })
      .email({ message: 'must be a valid email' }),
  });
  const plaintiff = z.object({
    name: z.string().min(1, { message: "Plaintiff name can't be empty" }),
    email: z
      .string()
      .min(1, { message: " Plaintiff email can't be empty" })
      .email({ message: 'must be a valid email' }),
  });
  const schema = z.object({
    defendant_lawyer: z
      .array(defendentlawyerSchema)
      .min(1, { message: "Defendent lawyer can't be empty" }),
    plaintiff_lawyer: z
      .array(plantifflawyerSchema)
      .min(1, { message: "Plaintiff lawyer can't be empty" }),
    defendant: z.array(defendant),
    plaintiff: z.array(plaintiff),
    case_number: z.string().min(1, { message: "Case number can't be empty" }),
    court_number: z.string().min(1, { message: "Court number can't be empty" }),
    claim_number: z.string().min(1, { message: "Claim number can't be empty" }),
    file_number: z.string().min(1, { message: "File number can't be empty" }),
    details: z.string().optional(),
    state: z.union([
      z.object({
        label: z.string().min(1, { message: "State can't be empty" }),
        value: z.string().optional(),
      }),
      z.string().min(1, { message: "State can't be empty" }),
    ]),
    city: z.union([
      z.object({
        label: z.string().min(1, { message: "City can't be empty" }),
        value: z.string().optional(),
      }),
      z.string().min(1, { message: "City can't be empty" }),
    ]),
    county: z.union([
      z.object({
        label: z.string().min(1, { message: "County can't be empty" }),
        value: z.string().optional(),
      }),
      z.string().min(1, { message: "County can't be empty" }),
    ]),
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
      //   defendant_lawyer: [],
      //   plaintiff_lawyer: [],
      //   defendant: [
      //     {
      //       name: '',
      //       email: '',
      //     },
      //   ],
      //   plaintiff: [
      //     {
      //       name: '',
      //       email: '',
      //     },
      //   ],
      //   case_number: '',
      //   court_number: '',
      //   claim_number: '',
      //   file_number: '',
      //   details: '',
      //   state: '',
      //   city: '',
      //   county: '',
    },
  });
  const {
    field: {
      value: plantiffValue,
      onChange: plantiffOnChange,
      ...restplantiffField
    },
  } = useController({ name: 'plaintiff_lawyer', control });
  const {
    fields: defendentfields,
    append: defendentappend,
    remove: defendentremove,
  } = useFieldArray({
    name: 'defendant',
    control,
  });
  const {
    fields: plantifffields,
    append: plantiffappend,
    remove: plantiffremove,
  } = useFieldArray({
    name: 'plaintiff',
    control,
  });
  const {
    field: {
      value: defendentValue,
      onChange: defendentOnChange,
      ...restdefendentField
    },
  } = useController({ name: 'defendant_lawyer', control });
  const {
    field: { value: stateValue, onChange: stateOnChange, ...reststateField },
  } = useController({ name: 'state', control });
  const {
    field: { value: cityValue, onChange: cityOnChange, ...restcityField },
  } = useController({ name: 'city', control });
  const {
    field: { value: countyValue, onChange: countyOnChange, ...restcountyField },
  } = useController({ name: 'county', control });
  const handleplantiffchange = (e, context, type) => {
    if (context.action === 'remove-value') {
      let defendent = [...defendentlist];
      let finaldefendent = [...defendent, context.removedValue];
      plantiffOnChange(e);
      setdefendentlist(finaldefendent);
    }
    if (context.action === 'clear') {
      let defendent = [...defendentlist];
      let finaldefendent = [...defendent, ...context.removedValues];
      plantiffOnChange(e);
      setdefendentlist(finaldefendent);
      //  setplantifflist(context.removedValues)
    }
    if (context.action === 'select-option') {
      let defendent = [...defendentlist];
      let finaldefendent = defendent.filter(
        (item1) => !e.some((item2) => item2?.value === item1?.value)
      );
      plantiffOnChange(e);
      setdefendentlist(finaldefendent);
    }
    if (context.action === 'create-option') {
      setModalStatus({
        isShow: true,
        type: type,
        contaxt: context,
        event: e,
      });
    }
  };
  const handledefendentchange = (e, context, type) => {
    if (context.action === 'remove-value') {
      let plantiff = [...plantifflist];
      let finalplantiff = [...plantiff, context.removedValue];
      defendentOnChange(e);
      setplantifflist(finalplantiff);
    }
    if (context.action === 'clear') {
      let plantiff = [...plantifflist];
      let finalplantiff = [...plantiff, ...context.removedValues];
      defendentOnChange(e);
      setplantifflist(finalplantiff);
      // setdefendentlist(context.removedValues)
    }
    if (context.action === 'select-option') {
      let plantiff = [...plantifflist];
      let finalplantiff = plantiff.filter(
        (item1) => !e.some((item2) => item2?.value === item1?.value)
      );
      defendentOnChange(e);
      setplantifflist(finalplantiff);
    }
    if (context.action === 'create-option') {
      setModalStatus({
        isShow: true,
        type: type,
        contaxt: context,
        event: e,
      });
    }
  };
  const { errors, isDirty } = formState;
  const onSubmit = (data) => {
    let defendant_lawyer = data.defendant_lawyer.map((item) => {
      if (isNaN(item?.value)) {
        return {
          user_id: null,
          role_id: null,
          name: item.label.replace(/\([^)]*\)/g, ''),
          email: item.label.match(/\((.*?)\)/)[1],
        };
      } else {
        return {
          user_id: item.value,
          role_id: 3,
          name: item.label.replace(/\([^)]*\)/g, ''),
          email: item.label.match(/\((.*?)\)/)[1],
        };
      }
    });
    let plaintiff_lawyer = data.plaintiff_lawyer.map((item) => {
      if (isNaN(item?.value)) {
        return {
          user_id: null,
          role_id: null,
          name: item.label.replace(/\([^)]*\)/g, ''),
          email: item.label.match(/\((.*?)\)/)[1],
        };
      } else {
        return {
          user_id: item.value,
          role_id: 3,
          name: item.label.replace(/\([^)]*\)/g, ''),
          email: item.label.match(/\((.*?)\)/)[1],
        };
      }
    });
    let state = data.state.label;
    let city = data.city.label;
    let county = data.county.label;
    let files = file?.map((item) => {
      return {
        file_name: item?.file_name,
      };
    });
    delete data['defendant_lawyer'];
    delete data['plaintiff_lawyer'];
    delete data['state'];
    delete data['city'];
    delete data['county'];
    let finalpayload = {
      ...data,
      defendant_lawyer,
      plaintiff_lawyer,
      state,
      city,
      county,
      files,
    };
    if (newfile?.length > 0) {
      fileuploadtrigger({
        payload: newfile,
        axios: axiosAuth,
        name: 'upload_files',
      });
      setpayload(finalpayload);
    } else {
      puttrigger({ data: finalpayload, axios: axiosAuth });
    }
  };
  const handleuploadfilemodal = (type) => {
    setuploadfile(false);
    if (type !== 'false') {
      let tempfile = [...type];
      let allfile = [...newfile, ...tempfile];
      setnewfile(allfile);
    }
  };
  const handlestatechange = (e) => {
    setselectstate(e.label);
    setcitydata([]);
    setcountydata([]);
    let temppage = 1;
    setcitypage(1);
    setcountypage(1);
    setValue('city', '');
    setValue('county', '');
    citytrigger({
      id: e.label,
      axios: axiosAuth,
      page: temppage,
      search: debouncedSearchcity,
      size: 10,
    });
    countytrigger({
      id: e.label,
      axios: axiosAuth,
      page: temppage,
      search: debouncedSearchcounty,
      size: 10,
    });
  };

  const addstateOption = async () => {
    await setstatepage((prev) => prev + 1);
  };
  const addcityOption = async () => {
    let temppage = citypage + 1;
    await setcitypage(temppage);
    citytrigger({
      id: selectstate,
      axios: axiosAuth,
      page: temppage,
      search: debouncedSearchcity,
      size: 10,
    });
  };
  const addcountyOption = async () => {
    let temppage = countypage + 1;
    await setcountypage(temppage);
    countytrigger({
      id: selectstate,
      axios: axiosAuth,
      page: temppage,
      search: debouncedSearchcounty,
      size: 10,
    });
  };
  const handlestateinputchange = (e) => {
    setsearchstate(e);
  };
  const handleinputcitychange = (e) => {
    setsearchcity(e);
  };
  const handleinputcountychange = (e) => {
    setsearchcounty(e);
  };
  const handlefilemanagement = (i) => {
    let tempfile = [...file];
    tempfile.splice(i, 1);
    setfile(tempfile);
  };
  const handlenewfilemanagement = (i) => {
    let tempfile = [...newfile];
    tempfile.splice(i, 1);
    setnewfile(tempfile);
  };

  // Close Modal
  const closeModalHandler = () => {
    setModalStatus({
      isShow: false,
      contaxt: '',
      event: '',
      type: '',
    });
  };

  // Submit Modal
  const addExternalLawyerHandler = (e, type) => {
    if (type === 1) {
      defendentOnChange(e);
    } else {
      plantiffOnChange(e);
    }
    setModalStatus({
      isShow: false,
      contaxt: '',
      event: '',
      type: '',
    });
  };
  const closeModal = () => {
    setcheck(false);
  };
  let handlecheck=()=>{
    setcheck(true)
  }
  return (
    <div className="m-card">
      <div className="create-case-top-img">
        <Image src={topbluebg} className="w-full" alt="" />
      </div>
      {getcasedata !== undefined ? (
        <div className="c-case-wrap px-10 pt-6 pb-1 ">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="c-case-wrap-row">
              <div className="grid gap-y-5">
                <div className="c-case-wrap-flex flex md:space-x-8 space-y-5 md:space-y-0 items-center md:flex-row flex-wrap md:flex-nowrap">
                  <div className="c-case-wrap-col lg:basis-1/2 basis-full">
                    <h5 className="w-full pb-4">Defendant Lawyer/Law Firm</h5>
                    <div className="form-field flex items-center justify-center !p-0 !border-none">
                      <CreatableSelect
                        className="flex-1"
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            maxHeight: '3rem',
                            overflow: 'auto',
                          }),
                        }}
                        placeholder="defendent lawyear firm"
                        isClearable
                        isMulti
                        options={defendentlist}
                        value={defendentValue}
                        isLoading={defendentlist?.length === 0}
                        onChange={(e, context) => {
                          // defendentOnChange(e);
                          handledefendentchange(e, context, 1);
                        }}
                        {...restdefendentField}
                      />
                    </div>
                    <p className="text-red-700 mb-0">
                      {errors?.defendant_lawyer?.message}
                    </p>
                  </div>
                  <div className="c-case-wrap-col lg:basis-1/2 basis-full">
                    <h5 className="pb-4 w-full">Plaintiff Lawyer/Law Firm</h5>
                    <div className="form-field flex items-center justify-center !p-0 !border-none">
                      <CreatableSelect
                        className="flex-1"
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            maxHeight: '3rem',
                            overflow: 'auto',
                          }),
                        }}
                        placeholder="plantiff lawyear firm"
                        isClearable
                        isMulti
                        options={plantifflist}
                        isLoading={plantifflist?.length === 0}
                        value={plantiffValue}
                        onChange={(e, context) => {
                          // plantiffOnChange(e);
                          handleplantiffchange(e, context, 2);
                        }}
                        {...restplantiffField}
                      />
                      {/* <input type="text" placeholder="Enter Defendant Lawyer/Law Firm Name" className="form-control" /> */}
                    </div>
                    <p className="text-red-700 mb-0">
                      {errors?.plaintiff_lawyer?.message}
                    </p>
                  </div>
                  <div className="c-case-wrap-col basis-1/12"></div>
                </div>
              </div>
            </div>

            <div className="c-case-wrap-row">
              <h5 className="c-case-wrap-row-title w-full">Defendant</h5>
              <div className="grid gap-y-5">
                {defendentfields?.map((field, index) => (
                  <div
                    className="c-case-wrap-flex 
               flex md:space-x-8 space-y-5 md:space-y-0 items-center md:flex-row flex-wrap md:flex-nowrap"
                    key={index}
                  >
                    <div className="c-case-wrap-col lg:basis-1/2 basis-full">
                      <div className="form-field">
                        <input
                          type="text"
                          placeholder="Enter Defendant Name"
                          className="form-control"
                          {...register(`defendant.${index}.name`)}
                        />
                      </div>
                      {errors?.defendant?.length > 0 && (
                        <p className="text-red-700 mb-0">
                          {errors?.defendant[index]?.name?.message}
                        </p>
                      )}
                    </div>
                    <div className="c-case-wrap-col lg:basis-1/2 basis-full">
                      <div className="form-field">
                        <input
                          type="email"
                          placeholder="Enter Defendant Email ID"
                          className="form-control"
                          {...register(`defendant.${index}.email`)}
                        />
                      </div>
                      {errors?.defendant?.length > 0 && (
                        <p className="text-red-700 mb-0">
                          {errors?.defendant[index]?.email?.message}
                        </p>
                      )}
                    </div>
                    <div className="c-case-wrap-col lg:basis-1/12 basis-full">
                      <div className="flex gap-2 flex-wrap">
                        {index !== 0 && (
                          <button
                            className="cl-col-btn remove"
                            onClick={() => defendentremove(index)}
                          >
                            <Image src={removeicon} alt="" />
                          </button>
                        )}

                        {defendentfields?.length === index + 1 && (
                          <button
                            className="cl-col-btn add"
                            onClick={() =>
                              defendentappend({ name: '', email: '' })
                            }
                          >
                            <Image src={addicon} alt="" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="c-case-wrap-row">
              <h5 className="c-case-wrap-row-title w-full">Plaintiff</h5>
              <div className="grid gap-y-5">
                {plantifffields?.map((field, index) => (
                  <div
                    className="c-case-wrap-flex flex md:space-x-8 space-y-5 md:space-y-0 items-center md:flex-row flex-wrap md:flex-nowrap"
                    key={index}
                  >
                    <div className="c-case-wrap-col lg:basis-1/2 basis-full">
                      <div className="form-field">
                        <input
                          type="text"
                          placeholder="Enter Plaintiff Name"
                          className="form-control"
                          {...register(`plaintiff.${index}.name`)}
                        />
                      </div>
                      {errors?.plaintiff?.length > 0 && (
                        <p className="text-red-700 mb-0">
                          {errors?.plaintiff[index]?.name?.message}
                        </p>
                      )}
                    </div>
                    <div className="c-case-wrap-col lg:basis-1/2 basis-full">
                      <div className="form-field">
                        <input
                          type="email"
                          placeholder="Enter Plaintiff Email ID"
                          className="form-control"
                          {...register(`plaintiff.${index}.email`)}
                        />
                      </div>
                      {errors?.plaintiff?.length > 0 && (
                        <p className="text-red-700 mb-0">
                          {errors?.plaintiff[index]?.email?.message}
                        </p>
                      )}
                    </div>
                    <div className="c-case-wrap-col lg:basis-1/12 basis-full">
                      <div className="flex gap-2 flex-wrap">
                        {index !== 0 && (
                          <button
                            className="cl-col-btn remove"
                            onClick={() => plantiffremove(index)}
                          >
                            <Image src={removeicon} alt="" />
                          </button>
                        )}

                        {plantifffields?.length === index + 1 && (
                          <button
                            className="cl-col-btn add"
                            onClick={() =>
                              plantiffappend({ name: '', email: '' })
                            }
                          >
                            <Image src={addicon} alt="" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="c-case-wrap-ybg p-7">
              <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4">
                <div className="c-case-wrap-field-group">
                  <h5 className="c-case-wrap-row-title w-full">Case No.</h5>
                  <div className="form-field">
                    <input
                      type="text"
                      placeholder="case no"
                      className="form-control"
                      {...register('case_number')}
                    />
                  </div>
                  <p className="text-red-700 mb-0">
                    {errors?.case_number?.message}
                  </p>
                </div>
                <div className="c-case-wrap-field-group">
                  <h5 className="c-case-wrap-row-title w-full">Courts No.</h5>
                  <div className="form-field">
                    <input
                      type="text"
                      placeholder="court no"
                      className="form-control"
                      {...register('court_number')}
                    />
                  </div>
                  <p className="text-red-700 mb-0">
                    {errors?.court_number?.message}
                  </p>
                </div>
                <div className="c-case-wrap-field-group">
                  <h5 className="c-case-wrap-row-title w-full">Claim No.</h5>
                  <div className="form-field">
                    <input
                      type="text"
                      placeholder="claim no"
                      className="form-control"
                      {...register('claim_number')}
                    />
                  </div>
                  <p className="text-red-700 mb-0">
                    {errors?.claim_number?.message}
                  </p>
                </div>
                <div className="c-case-wrap-field-group">
                  <h5 className="c-case-wrap-row-title w-full">File No.</h5>
                  <div className="form-field">
                    <input
                      type="text"
                      placeholder="Enter File No."
                      className="form-control"
                      {...register('file_number')}
                    />
                  </div>
                  <p className="text-red-700 mb-0">
                    {errors?.file_number?.message}
                  </p>
                </div>
                <div className="c-case-wrap-field-group">
                  <h5 className="c-case-wrap-row-title w-full">State</h5>
                  {/* <div className="select-dropdown"> */}
                  <Select
                    className="s-select"
                    components={{
                      MenuList,
                      MenuListFooter: (
                        <MenuListFooter
                          showing={statedata?.length}
                          total={statetotal}
                          onClick={addstateOption}
                        />
                      ),
                    }}
                    onChange={(e) => {
                      handlestatechange(e);
                      stateOnChange(e);
                    }}
                    onInputChange={handlestateinputchange}
                    value={stateValue}
                    //onKeyDown={handlekeydown}
                    placeholder="Type something and press enter..."
                    options={statedata}
                    {...reststateField}
                  />
                  <p className="text-red-700 mb-0">{errors?.state?.message}</p>
                </div>
                <div className="c-case-wrap-field-group">
                  <h5 className="c-case-wrap-row-title w-full">City</h5>

                  <Select
                    className="s-select"
                    components={{
                      MenuList,
                      MenuListFooter: (
                        <MenuListFooter
                          showing={citydata?.length}
                          total={citytotal}
                          onClick={addcityOption}
                        />
                      ),
                    }}
                    //onChange={(e)=>{handlecitychange(e);cityOnChange(e)}}
                    onChange={cityOnChange}
                    onInputChange={handleinputcitychange}
                    value={cityValue}
                    //isDisabled={selectstate === ''}
                    //onKeyDown={handlekeydown}
                    placeholder="Type something and press enter..."
                    options={citydata}
                    {...restcityField}
                  />
                  <p className="text-red-700 mb-0">{errors?.city?.message}</p>
                </div>
                <div className="c-case-wrap-field-group">
                  <h5 className="c-case-wrap-row-title w-full">County</h5>
                  <Select
                    className="s-select"
                    components={{
                      MenuList,
                      MenuListFooter: (
                        <MenuListFooter
                          showing={countydata?.length}
                          total={countytotal}
                          onClick={addcountyOption}
                        />
                      ),
                    }}
                    //onChange={(e)=>{handlecitychange(e);cityOnChange(e)}}
                    onChange={countyOnChange}
                    onInputChange={handleinputcountychange}
                    value={countyValue}
                    //   isDisabled={selectstate === ''}
                    //onKeyDown={handlekeydown}
                    placeholder="Type something and press enter..."
                    options={countydata}
                    {...restcountyField}
                  />
                  <p className="text-red-700 mb-0">{errors?.county?.message}</p>
                </div>
              </div>
            </div>

            <div className="c-case-wrap-row pt-8">
              <div className="upload-field">
                <label
                  htmlFor="create-case-file"
                  className="upload-field-label"
                  onClick={() => setuploadfile(true)}
                >
                  {' '}
                  <Image src={fileuploadicon} alt="" /> Upload Files
                </label>
              </div>
              <div className="grid grid-cols-7 gap-3 mt-4">
                {file?.length > 0 &&
                  file?.map((item, i) => (
                    <div
                      className="bg-[#e0eefb] border border-solid border-[#8790af] p-3 rounded-3xl text-[#125ecb] h-12 text-sm font-medium flex items-center justify-between leading-normal gap-3 mt-4"
                      title={item?.file_name}
                    >
                      <span className="truncate">{item?.file_name}</span>
                      <div
                        onClick={() => handlefilemanagement(i)}
                        className="w-4 flex-[0_0_1rem] overflow-hidden p-[0.125rem]"
                      >
                        <Image
                          src={CloseIcon}
                          alt="Close icon"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  ))}
                {newfile?.length > 0 &&
                  newfile?.map((item, i) => (
                    <div
                      className="bg-[#e0eefb] border border-solid border-[#8790af] p-3 rounded-3xl text-[#125ecb] h-12 text-sm font-medium flex items-center justify-between leading-normal gap-3 mt-4"
                      title={item?.name}
                    >
                      <span className="truncate">{item?.name}</span>
                      <div
                        onClick={() => handlenewfilemanagement(i)}
                        className="w-4 flex-[0_0_1rem] overflow-hidden p-[0.125rem]"
                      >
                        <Image
                          src={CloseIcon}
                          alt="Close icon"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="c-case-wrap-row">
              <div className="grid gap-y-5">
                <div className="c-case-wrap-flex flex md:space-x-8 space-y-5 md:space-y-0 items-center md:flex-row flex-wrap md:flex-nowrap">
                  <div className="c-case-wrap-col basis-full">
                    <h5 className="c-case-wrap-row-title w-full">Details</h5>
                    <div className="form-field textarea">
                      <textarea
                        placeholder="Describe about your case..."
                        className="form-control"
                        maxLength="400"
                        {...register('details')}
                      ></textarea>
                    </div>
                    {watch('details')?.length === 400 ? (
                      <p className=" text-red-700">
                        More than 400 words not allowed
                      </p>
                    ) : (
                      <span className="field-meta">Max 400 Words *</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="c-case-wrap-row">
              <div className="grid gap-y-5">
                <div className="c-case-wrap-flex flex md:space-x-8 space-y-5 md:space-y-0 items-center md:flex-row flex-wrap md:flex-nowrap">
                <label className="label cursor-pointer justify-start items-center p-0">
                    <input
                      type="checkbox"
                      className="checkbox-sm checkbox-primary mr-[0.625rem] focus:outline-none"
                      checked={check}
                    // //  value={check}
                      onChange={handlecheck}
                    />
                    <span className="label-text text-[0.9375rem] text-[#8790AF]">
                      Inactive case
                    </span>
                  </label>
                 
                </div>
              </div>
            </div>
            <div className="c-case-wrap-row">
              <div className="text-left mt-2">
                <button
                  type="submit"
                  //disabled={!isDirty}
                  //className={`primary-btn ${!isDirty ? 'disable' : ''}`}
                  className="primary-btn"
                >
                  Update
                </button>
                {/* <div className="primary-btn" 
                onClick={fileupload}
                >
                  fileupload 
                </div> */}
              </div>
            </div>

            {uploadfile && (
              <Uploadfilesmodal handleuploadfilemodal={handleuploadfilemodal} />
            )}

            <DevTool control={control} />
          </form>
        </div>
      ) : (
        <Loader />
      )}

      {modalStatus.isShow && (
        <AddExternalLawyer
          modalIsOpen={modalStatus.isShow}
          closeModal={closeModalHandler}
          submitModal={addExternalLawyerHandler}
          context={modalStatus.contaxt}
          event={modalStatus?.event}
          type={modalStatus?.type}
        />
      )}
      {
        check &&
        <InactiveCasemodal
          modalIsOpen={check}
          closeModal={closeModal}
          caseid={caseid}
          axiosAuth={axiosAuth}
          roleid={data?.user?.role_id}
        />
      }
    </div>
  );
};

export default EditCase;
