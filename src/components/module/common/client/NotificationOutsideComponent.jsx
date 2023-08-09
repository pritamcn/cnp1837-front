import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import NotificationComponent from './NotificationComponent';
import notifyicon from '../../../../assets/images/icons/notification-icon.svg';
import { WithTokenWithoutTriggerGetApi } from '@/services/module/api/getapi';
import useSWRMutation from 'swr/mutation';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import supabase from '@/SupabaseClient';
const NotificationOutsideComponent = ({ data }) => {
  const [notificationdrop, setnotificationdrop] = useState(false);
  const [noticount, setnoticount] = useState('');
  const axiosAuth = useAxiosAuth();
  let sessionnotification=null;
 // let sessionnotification=sessionStorage?.getItem('Unreadnotification') || null;
  const { trigger: notificationtrigger, data: notificationdata } =
    useSWRMutation(
      `/notification/getReceivedNotificationsList?order=DESC&&purpose=1&startCount=1&endCount=5`,
      WithTokenWithoutTriggerGetApi
    );

  let handlenotification = (title) => {
    if (title === 'decrease' ) {
      setnoticount((prev) => prev - 1);
    }
    setnotificationdrop(false);
  };
  useEffect(() => {
    const channel = supabase
      .channel('realtime notification')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Notifications',
          filter: `to_user_id=eq.${data?.user?.id}`,
        },
        (payload) => {
          let increasenotidata =
            sessionStorage.getItem("Unreadnotification") === 0
              ? 1
              : parseInt(sessionStorage.getItem("Unreadnotification")) + 1;
          sessionStorage?.setItem('Unreadnotification', increasenotidata);
          setnoticount((prev) => prev + 1);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, noticount, setnoticount]);
  useEffect(() => {
    if (
      sessionnotification === null &&
      data?.user?.id !== undefined
    ) {
      notificationtrigger({ axios: axiosAuth });
    }
    if (sessionStorage.getItem("Unreadnotification")!==null) {
      setnoticount(sessionnotification);
    }
  }, [sessionnotification, data]);
  useEffect(() => {
    if (
      notificationdata?.status === 200 &&
      sessionnotification === null
    ) {
      sessionStorage?.setItem(
        'Unreadnotification',
        notificationdata?.data?.unreadCount
      );
      setnoticount(notificationdata?.data?.unreadCount);
    }
  }, [notificationdata]);
  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <button
        type="button"
        tabIndex={0}
        className="notification pending-notify indicator"
        onClick={() => setnotificationdrop(!notificationdrop)}
      >
        <Image src={notifyicon} alt="" className="notify-bell-img" />
        {noticount != 0 && noticount !=="" && noticount !==null && (
          <span className="indicator-item badge badge-secondary w-[0.625rem] h-[0.625rem] p-0 top-[3px] right-[6px] bg-red-500"></span>
        )}
      </button>
      {notificationdrop && (
        <NotificationComponent data={data} handledrop={handlenotification} />
      )}
    </div>
  );
};

export default NotificationOutsideComponent;
