'use client';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Tabs = () => {
  const path = usePathname();

  return (
    <div className="tabs">
      <Link href="/CourtReporter/accountsettings" className={`tab tab-bordered  ${path === "/CourtReporter/accountsettings" ? "tab-active" : null}`}>General</Link>
      <Link href="/CourtReporter/accountsettings/payment" className={`tab tab-bordered  ${path === "/CourtReporter/accountsettings/payment" ? "tab-active" : null}`}>Payment</Link>
      <Link href="/CourtReporter/accountsettings/calendar" className={`tab tab-bordered  ${path === "/CourtReporter/accountsettings/calendar" ? "tab-active" : null}`}>Calendar</Link>
    </div>
  )
}

export default Tabs