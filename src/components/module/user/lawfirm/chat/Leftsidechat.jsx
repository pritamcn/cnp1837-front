'use client';
import React from 'react';
const Leftsidechat = ({ roomusers }) => {

  let physicianuser = roomusers?.filter((item) => item.role === 'Physician');
  
  return (
    <div className="py-[1.875rem] px-6 border-r-[0.0625rem] border-solid border-r-base-300 flex-[0_0_18rem] max-w-[18rem]">
      <h1 className="text-lg font-medium">
        {physicianuser?.length > 0 && physicianuser[0]?.username}
      </h1>
      <ul className="-my-[0.625rem] mt-7">
        {roomusers?.length > 0 &&
          roomusers?.map((room, i) => (
            <li
              className="flex items-center justify-between py-[0.625rem] cursor-pointer"
              key={i}
            >
              <div className="avatar placeholder mr-[0.625rem]">
                <div
                  className={`text-neutral-content rounded-full w-9`}
                  style={{ backgroundColor: `${room?.bgcolor}` }}
                >
                  <span className="text-lg font-medium text-white">
                    {room?.username?.charAt(0)}
                  </span>
                </div>
              </div>

              <div>
                <div className="tooltip mb-1" data-tip={room?.username}>
                  <span className="text-[0.9375rem] font-normal flex items-center">
                    <span className="truncate inline-block max-w-[6.6875rem] mr-1">
                      {room?.username}
                    </span>
                    ({room?.role})
                  </span>
                </div>
                <div className="tooltip" data-tip={room?.email}>
                  <span className="text-[0.75rem] font-normal truncate inline-block max-w-[11.875rem]">
                    ({room?.email})
                  </span>
                </div>
              </div>
              {/* <details className="dropdown">
            <summary
              className="btn !bg-transparent !rounded-none !h-auto outline-none !min-h-0 !p-3 !pr-0 tooltip normal-case"
              data-tip="More"
            >
              <i className="w-[1.125rem] flex items-center justify-center">
                <Image
                  src={MoreVeticalIcon}
                  alt="More vetical icon"
                  className="w-full h-auto"
                />
              </i>
            </summary>
            <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
              <li className="!p-0">
                <div>Item 1</div>
              </li>
            </ul>
          </details> */}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Leftsidechat;
