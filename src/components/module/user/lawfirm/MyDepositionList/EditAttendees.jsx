import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import removeicon from '../../../../../assets/images/icons/minus-icon.svg';
import addicon from '../../../../../assets/images/icons/plus-icon.svg';
import binicon from '../../../../../assets/images/icons/delete.svg';
import Image from 'next/image';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import moment from 'moment';
import useSWRMutation from 'swr/mutation';
import { WithTokenGetApi } from '@/services/module/api/getapi';
import useDebounce from '@/lib/hooks/useDebounce';
import { MenuListFooter, MenuList } from '@/helpers/selectpaginationhelper';
import CreatableSelect from 'react-select/creatable';
import { WithoutTokenPostApi } from '@/services/module/api/postapi';
import Confirm from '../Modal/Confirm';
import DateConfirmationModal from '../Modal/DateConfirmationModal';
import { redirect } from 'next/navigation';
import CancelDepositionModal from '../Modal/CancelDepositionModal';
import { useSession } from 'next-auth/react';

const options = [
  { value: 4, label: 'Accepted' },
  { value: 0, label: 'Rejected' },
];
const EditAttendees = ({
  onNext,
  axiosAuth,
  attendeesList,
  depoId,
  startdate,
  enddate,
  onSave,
}) => {
  const [role, setrole] = useState([]);
  const [user, setuser] = useState([]);
  const [usertotal, setusertotal] = useState(0);
  const [search, setsearch] = useState('');
  const [page, setpage] = useState(1);
  const [isclicked, setisclicked] = useState(false);
  const {data}=useSession()
  const [errordepo, seterrordepo] = useState('');
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
  const [formdata, setformdata] = useState([]);

  const [deletedData, setDeletedData] = useState({
    isModalShow: false,
    deletedId: '',
  });

  const [cancelModalData, setCancelModalData] = useState('');

  const [confirmDateModal, setConfirmDateModal] = useState(false);

  useEffect(() => {
    setformdata([...attendeesList]);
    setuserdata(
      attendeesList.map((item) => ({
        label: item?.email,
        value: item?.user_id,
        first_name: item?.first_name,
        last_name: item?.last_name,
        role_id: item?.role_id,
      }))
    );
  }, [attendeesList]);
  const debounceSearch = useDebounce(search, 500);

  const {
    trigger: availibilitycheckertrigger,
    data: availibilitycheckerData,
    error: availibilitycheckerError,
  } = useSWRMutation(`/case/availibilityChecker`, WithoutTokenPostApi);

  const {
    trigger: deletetrigger,
    data: deletedata,
    error: deleteError,
  } = useSWRMutation(`/case/deleteInvitee`, WithoutTokenPostApi);

  const {
    trigger,
    data: updateData,
    error: updateError,
  } = useSWRMutation(
    `/case/inviteeRescheduleHandleAttorney`,
    WithoutTokenPostApi
  );

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
  useEffect(() => {
    if (availibilitycheckerData?.status === 200) {
      setConfirmDateModal(true);
    }
    if (availibilitycheckerData?.status === 203) {
      onNext(formdata);
      sessionStorage.setItem('formdata', JSON.stringify(formdata));
    }
    if (
      availibilitycheckerData === undefined &&
      availibilitycheckerError?.response
    ) {
      toast.error(availibilitycheckerError?.response?.data?.message);
    }
  }, [availibilitycheckerData, availibilitycheckerError]);

  // Put apis handlers
  useEffect(() => {
    if (updateData?.status == 200) {
      toast.success(updateData?.data?.message);
    }
    if (updateData?.status == 300) {
      toast.error(updateData?.data?.message);
    }
  }, [updateData, updateError]);

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

  const adduserOption = () => {
    setpage((prev) => prev + 1);
    seterrordepo('');
  };

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

  const handleuserchange = (e, i) => {
    let validation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (e.__isNew__ === true && e.label.match(validation) !== null) {
      let temp = [...formdata];
      let roleobject = { value: '', label: '' };
      let selectuser = userdata[i];
      let selectrole = roledata[i];
      temp[i].isExistFlag = 0;
      temp[i].user_id = null;
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
      temp[i].user_id = null;
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
      temp[i].isDisableRow = 1;
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

  const handleuserinputchange = (e) => {
    setsearch(e);
    seterrordepo('');
  };

  const addItem = () => {
    let createdRow = [
      ...formdata,
      {
        email: '',
        first_name: '',
        last_name: '',
        role_name: '',
        role_id: 0,
        user_id: null,
        isExistFlag: 0,
        isDisableRow: 0,
        status: 2,
        id: '',
        action: 3,
        start_time: '',
        end_time: '',
      },
    ];

    setformdata(createdRow);
  };

  const handleinputchange = (e, i, type) => {
    let temp = [...formdata];
    temp[i][type] = e.target.value;
    setformdata(temp);
    seterrordepo('');
  };

  const deleteItem = (i) => {
    let deletedData = formdata.find((item, index) => index === i);
    if (deletedData?.id) {
      let payload = {
        invitee_id: deletedData?.id,
      };
      deletetrigger(payload);
    } else {
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
      setDeletedData({
        isModalShow: false,
        deletedId: '',
      });
    }
  };

  useEffect(() => {
    if (deletedata?.status === 200) {
      toast.success(deletedata?.data?.message);
      let temp = [...formdata];
      let temp2 = [...roledata];
      let temp3 = [...userdata];
      temp.splice(deletedData?.deletedId, 1);
      temp2.splice(deletedData?.deletedId, 1);
      temp3.splice(deletedData?.deletedId, 1);
      setformdata(temp);
      setroledata(temp2);
      setuserdata(temp3);
      seterrordepo('');
      setDeletedData({
        isModalShow: false,
        deletedId: '',
      });
    }
    if (deletedata === undefined && deleteError?.response?.status === 400) {
      toast.error('Invalid invitee id');
      seterrordepo('');
      setDeletedData({
        isModalShow: false,
        deletedId: '',
      });
    }
  }, [deletedata, deleteError]);

  const confirmDelete = (i) => {
    setDeletedData({
      isModalShow: true,
      deletedId: i,
    });
  };

  const onConfirmClose = () => {
    setDeletedData({
      isModalShow: false,
      deletedId: '',
    });
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
    return isError;
  };

  const onSubmitHandler = (evt) => {
    evt.preventDefault();
    let isError = validate();
    if (!isError) {
      let inviteUsers = formdata.reduce((pre, curr) => {
        if (curr?.user_id) {
          pre.push(curr?.user_id + '');
          return pre;
        } else return pre;
      }, []);

      let data = {
        deposition_id: depoId,
        start_time: startdate,
        end_time: enddate,
        invite_users: inviteUsers,
      };

      availibilitycheckertrigger(data);
    }
  };

  const onConfirm = () => {
    setConfirmDateModal(false);
    onNext(formdata);
    sessionStorage.setItem('formdata', JSON.stringify(formdata));
  };

  const cancelHandler = (type) => {
    if (type) {
      redirect(`${data?.user?.role_id === "6" ? "/AttorneyAssistant" : "/Attorney"}/mydepositionlistmanagement`)
    }
    setCancelModalData('');
  };

  const setSelectedOption = (e, i, id) => {
    let actionvalue = parseInt(e.value);
    if (actionvalue === 0 || actionvalue === 4) {
      let data = { id: id, accept: actionvalue === 4 ? true : false };
      setformdata(
        formdata.map((item, index) => {
          if (index === i) {
            return {
              ...item,
              action: actionvalue === 4 ? 1 : 2,
              status: actionvalue,
            };
          } else {
            return item;
          }
        })
      );
      trigger(data);
    }
  };

  const handleSavemodal = () => {
    onSave(formdata);
    setConfirmDateModal(false);
  };
  return (
    <>
      <div className="mt-8">
        <h5 className="w-full flex mb-5 text-lg">Attendees</h5>
        <p className="text-red-700 mb-0">{errordepo}</p>
        <div className="c-table">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="!bg-white normal-case !px-1 !pl-0 !relative">
                  <h5>Email ID</h5>
                </th>
                <th className="!bg-white normal-case !px-1 max-w-[5rem]">
                  <h5>First Name</h5>
                </th>
                <th className="!bg-white normal-case !px-1 max-w-[5rem]">
                  <h5>Last Name</h5>
                </th>
                <th className="!bg-white normal-case !px-1">
                  <h5>Role</h5>
                </th>
                <th className="!bg-white normal-case !px-1">
                  <h5>Status</h5>
                </th>
                <th className="!bg-white normal-case !px-1">
                  <h5>Proposed Time</h5>
                </th>
                <th className="!bg-white normal-case !px-1">
                  <h5>Action</h5>
                </th>
                <th className="!bg-white normal-case !px-1 !pr-0">
                  <h5></h5>
                </th>
              </tr>
            </thead>
            <tbody>
              {formdata.length > 0 &&
                formdata?.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td className="!pt-0 !px-1 !pl-0 !border-b-0">
                        <CreatableSelect
                          className="s-select z-50"
                          isDisabled={item?.isDisableRow === 1}
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
                          value={
                            item?.email && {
                              label: item?.email,
                              value: item?.user_id,
                            }
                          }
                          onChange={(e) => {
                            handleuserchange(e, i);
                          }}
                          onInputChange={handleuserinputchange}
                        />
                      </td>
                      <td className="!pt-0 !px-1 !border-b-0 max-w-[5rem]">
                        <div className="form-field !mb-0">
                          <input
                            type="text"
                            placeholder="Enter First Name"
                            className="form-control"
                            value={item?.first_name}
                            onChange={(e) =>
                              handleinputchange(e, i, 'first_name')
                            }
                            disabled={item?.isDisableRow === 1}
                          />
                        </div>
                      </td>
                      <td className="!pt-0 !px-1 !border-b-0 max-w-[5rem]">
                        <div className="form-field !mb-0">
                          <input
                            type="text"
                            placeholder="Enter Last Name"
                            className="form-control"
                            value={item?.last_name}
                            onChange={(e) =>
                              handleinputchange(e, i, 'last_name')
                            }
                            disabled={item?.isDisableRow === 1}
                          />
                        </div>
                      </td>
                      <td className="!pt-0 !px-1 !border-b-0">
                        <Select
                          className="s-select"
                          options={role}
                          value={
                            item?.role_id && {
                              label: item?.role_name,
                              value: item?.role_id,
                            }
                          }
                          onChange={(e) => handlerolechange(e, i)}
                          isDisabled={item?.isDisableRow === 1}
                          placeholder="Select a role"
                        />
                      </td>
                      <td className="!pt-0 !px-1 !border-b-0">
                        <p className="mb-0">
                          {item?.status === 0
                            ? 'Rejected'
                            : item?.status === 1
                              ? 'Accepted'
                              : item?.status === 2
                                ? 'Pending'
                                : item?.status === 3
                                  ? 'Reschedule request'
                                  : 'Waiting for payment'}
                        </p>
                      </td>
                      <td className="!pt-0 !px-1 !border-b-0">
                        <div
                          className="tooltip"
                          data-tip={
                            item?.status === 3
                              ? item?.start_time &&
                              moment(item?.start_time).format(
                                'YYYY-MM-DD hh:mm'
                              ) +
                              '-' +
                              moment(item?.end_time).format(
                                'YYYY-MM-DD hh:mm'
                              )
                              : 'N/A'
                          }
                        >
                          <p className="mb-0 truncate max-w-[6.25rem]">
                            {item?.status === 3
                              ? item?.start_time &&
                              moment(item?.start_time).format(
                                'YYYY-MM-DD hh:mm'
                              ) +
                              '-' +
                              moment(item?.end_time).format(
                                'YYYY-MM-DD hh:mm'
                              )
                              : 'N/A'}
                          </p>
                        </div>
                      </td>
                      {[0, 1, 2].includes(item.action) ? (
                        <td className="!pt-0 !px-1 !border-b-0">
                          <Select
                            className="s-select"
                            isDisabled={[4, 0].includes(item.status)}
                            value={
                              item.action === 1
                                ? { value: 4, label: 'Accepted' }
                                : item.action === 2
                                  ? { value: 0, label: 'Rejected' }
                                  : { value: 2, label: 'Select' }
                            }
                            onChange={(e) => setSelectedOption(e, i, item?.id)}
                            options={options}
                          />
                        </td>
                      ) : (
                        <td className="!pt-0 !px-1 !border-b-0">
                          <Select
                            className="s-select"
                            isDisabled={true}
                            defaultValue={{ value: 2, label: 'Select' }}
                            onChange={setSelectedOption}
                            options={options}
                          />
                        </td>
                      )}
                      <td className="!pt-0 !px-1 !pr-0 !border-b-0">
                        <div className="flex gap-2 items-center justify-between">
                          <div className="tooltip" data-tip="Add row">
                            <button
                              type="button"
                              className="cl-col-btn add w-6 overflow-hidden flex items-center justify-center"
                              onClick={() => addItem()}
                            >
                              <Image
                                src={addicon}
                                alt="Add icon"
                                className="w-full h-auto text-white"
                              />
                            </button>
                          </div>
                          {formdata.length > 1 && (
                            <div className="tooltip" data-tip="Remove row">
                              <button
                                type="button"
                                className="cl-col-btn add w-6 overflow-hidden flex items-center justify-center"
                                onClick={() => confirmDelete(i)}
                              >
                                <label htmlFor="confirm-modal">
                                  <Image
                                    src={removeicon}
                                    alt="Remove icon"
                                    className="w-full h-auto"
                                  />
                                </label>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full flex items-center mt-7">
        <label
          onClick={() => setCancelModalData(depoId)}
          className="primary-btn btn-outline mr-3"
          htmlFor="add-cancel-modal"
        >
          Cancel Deposition
        </label>
        <button
          type="button"
          className="primary-btn"
          onClick={(e) => onSubmitHandler(e)}
        >
          Next
        </button>
      </div>

      {deletedData.isModalShow && (
        <>
          <input type="checkbox" id="confirm-modal" className="modal-toggle" />
          <Confirm
            modalTitle="Are you sure you want to delete?"
            modalImage={binicon}
            onConfirm={() => deleteItem(deletedData.deletedId)}
            handlemodal={onConfirmClose}
          />
        </>
      )}

      {confirmDateModal && (
        <>
          <DateConfirmationModal
            modalIsOpen={confirmDateModal}
            submitModal={() => onConfirm()}
            closeModal={() => setConfirmDateModal(false)}
            saveModal={handleSavemodal}
            title={'Are you sure you want to change the date?'}
          />
        </>
      )}

      {cancelModalData !== '' && (
        <>
          <input
            type="checkbox"
            id="add-cancel-modal"
            className="modal-toggle"
          />
          <CancelDepositionModal
            depo_id={cancelModalData}
            handlemodal={cancelHandler}
          />
        </>
      )}
    </>
  );
};

export default EditAttendees;
