'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Tabs = () => {
  const path=usePathname();
  const {data}=useSession()
  return (
    <div className="tabs">
    <Link 
     href={`${data?.user?.role_id ==="6"?"/AttorneyAssistant":"/Attorney"}/accountsettings`}
     className={`tab tab-bordered  ${(path.includes('accountsettings') && !path.includes('/accountsettings/'))?"tab-active":null}`}>General</Link> 
     {data?.user?.role_id !=="6" &&
     <>
         <Link href="/Attorney/accountsettings/payment" className={`tab tab-bordered  ${path==="/Attorney/accountsettings/payment"?"tab-active":null}`}>Payment</Link> 
         <Link href="/Attorney/accountsettings/calendar"  className={`tab tab-bordered  ${path==="/Attorney/accountsettings/calendar"?"tab-active":null}`}>Calendar</Link>
         </>
     }

  </div>
  )
}

export default Tabs