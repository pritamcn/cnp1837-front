import {
  WithTokenGetApi,
  WithTokenTriggerGetApi,
} from '@/services/module/api/getapi';
import Link from 'next/link';
import React from 'react';
import useSWR from 'swr';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { getFormattedDate, minuteextractor } from '@/helpers/mischelper';
import Loader from '../../user/lawfirm/Loader';
import useSWRMutation from 'swr/mutation';
const NotificationComponent = ({ data, handledrop }) => {
  const axiosAuth = useAxiosAuth();
  const { data: notificationData } = useSWR(
    [
      `/notification/getReceivedNotificationsList?order=DESC&purpose=1&startCount=1&endCount=5`,
      axiosAuth,
    ],
    ([url, axiosAuth]) => WithTokenGetApi(url, axiosAuth),
    {
      revalidateOnFocus: false,
    }
  );
  const { trigger: notificationtrigger } = useSWRMutation(
    `/notification/updateNotification`,
    WithTokenTriggerGetApi
  );
  let handleclick = (id, condition) => {
    if (!condition && sessionStorage?.getItem('Unreadnotification')>0) {
      let decreasenotidata =
        parseInt(sessionStorage?.getItem('Unreadnotification')) - 1;
      sessionStorage?.setItem('Unreadnotification', decreasenotidata);
      notificationtrigger({
        id,
        axios: axiosAuth,
      });
      handledrop('decrease');
    } else {
      handledrop();
    }
  };
  return (
    <div
      tabIndex={0}
      className="dropdown-content p-4 shadow !top-[44px] !rounded-[10px_0_0_10px] w-[400px] bg-[#f5f7fa]"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold ml-[10px]">Notifications</h1>
        {notificationData?.data?.totalCount > 5 && (
          <button
            type="button"
            className="btn btn-outline normal-case p-0 border-0 rounded-none hover:border-0 hover:text-primary hover:bg-transparent ml-0"
          >
            <Link
              className="text-primary hover:text-primary"
              href={`${
                data?.user?.role_id === '6'
                  ? '/AttorneyAssistant'
                  : data?.user?.role_id === '3'
                  ? '/Attorney'
                  : data?.user?.role_id === '4'
                  ? '/Physician'
                  : data?.user?.role_id === '5'
                  ? '/CourtReporter'
                  : 'Expert'
              }/notificationmanagement`}
            >
              <span onClick={handledrop}>View All</span>
            </Link>
          </button>
        )}
      </div>

      <ul className="mt-2">
        {notificationData === undefined ? (
          <li className="text-center">
            <Loader />
          </li>
        ) : notificationData?.data?.list?.length === 0 ? (
          <li className="flex items-start cursor-pointer !p-3 active:!bg-transparent gap-2">
            Sorry no data found
          </li>
        ) : (
          notificationData?.data?.list?.map((item, i) => (
            <li
              className={`${
                !item?.is_read ? 'bg-[#EBF4FD]' : ''
              } flex items-start cursor-pointer !p-3 gap-2`}
              onClick={() => handleclick(item?.id, item?.is_read)}
              //className="flex items-start cursor-pointer !p-3 active:!bg-transparent gap-2"
              key={i}
            >
              <Link
                className="flex-1"
                href={`${
                  data?.user?.role_id === '6'
                    ? '/AttorneyAssistant'
                    : data?.user?.role_id === '3'
                    ? '/Attorney'
                    : data?.user?.role_id === '4'
                    ? '/Physician'
                    : data?.user?.role_id === '5'
                    ? '/CourtReporter'
                    : 'Expert'
                }/${item?.link}`}
              >
                <time className="text-xs font-medium text-[#64697d]">
                  {getFormattedDate(item?.created_at)}&nbsp;
                  {minuteextractor(item?.created_at)}
                </time>
                <p className="flex items-center gap-1 text-sm text-[#0b0f1e] font-medium mt-3 mb-0">
                  {item?.title} {item?.purpose === 'Case Edit'
                                ? 'Click here to edit case '
                                : item?.purpose === 'Case Request'
                                ? 'Click here to check in case request list'
                                : item?.purpose === 'Deposition Edit'
                                ? 'Click here to edit deposition'
                                : item?.purpose === 'Deposition Request'
                                ? 'Click here to check in deposition request list'
                                : item?.purpose === 'Cancellation & Refund'
                                ? 'Click here to check in cancellation & refund list'
                                : item?.purpose === 'Payment History'
                                ? 'Click here to check in payment history list'
                                : item?.purpose === 'Transcript'
                                ? 'Click here to check details'
                                : item?.purpose === 'Deposition List'
                                ? 'Click here to check in deposition list'
                                : item?.purpose === 'Zoom Link' &&
                                  item?.purpose?.includes !== 'had a zoom call'
                                ? 'Click here to join'
                                : 'Click here to check details'}
                  {/* <span className="text-xs font-medium underline">

                  </span> */}
                </p>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NotificationComponent;
