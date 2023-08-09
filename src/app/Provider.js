"use client";
// import { SessionProvider } from "next-auth/react";
import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer} from 'react-toastify';
import { SessionProvider } from "next-auth/react";
import 'react-calendar/dist/Calendar.css';
import "rc-time-picker/assets/index.css";
function Provider({ children }) {
  return (
  <SessionProvider>
    {children}
    <ToastContainer/>
    </SessionProvider>
  )
}

export default Provider;