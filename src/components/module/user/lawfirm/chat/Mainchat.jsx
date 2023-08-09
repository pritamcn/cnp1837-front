'use client';
import React, { useState, useEffect } from 'react';
import Leftsidechat from './Leftsidechat';
import Rightsidechat from './Rightsidechat';
import { Url } from '@/config';
import io from 'socket.io-client';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

const Mainchat = () => {
  const socket = io.connect(Url);
  //  let socket=''
  const { data: session } = useSession();
  //  const [joinroom, setjoinroom] = useState(false);
  const [RoomUsers, setRoomUsers] = useState([]);
  const { id: deposition_id } = useParams();
  useEffect(() => {
    if (deposition_id !== '') {
      socket.emit('join_room', { deposition_id,user_id:session?.user?.id });
    }
  }, [deposition_id]);
  function generateColor(number) {
    const colors = [
      'Blue',
      'Green',
      'Red',
      'Purple',
      'Orange',
      'Yellow',
      'Brown',
      'Gray',
      'Olive',
      'Crimson',
      'Indigo',
      'GoldenRod',
      'Teal',
      'Silver',
      'Pink',
      'Cyan',
      'Magenta',
    ];
    const r = (number - 1) % colors.length;
    return colors[r];
  }
  useEffect(() => {
    socket.on('chatroom_users', (data) => {
      let users = data?.map((item) => {
        return {
          ...item,
          bgcolor: generateColor(item?.user_id),
        };
      });
      setRoomUsers(users);
    });
  }, [socket]);
  return (
    <div className="m-card flex">
      <Leftsidechat roomusers={RoomUsers} />
      <Rightsidechat
        roomusers={RoomUsers}
        deposition_id={deposition_id}
        session={session}
        socket={socket}
      />
    </div>
  );
};

export default Mainchat;
