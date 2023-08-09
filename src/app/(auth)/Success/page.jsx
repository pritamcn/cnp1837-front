import Footer from '@/components/module/common/client/Footer';
import Header from '@/components/module/common/client/Header';
import React from 'react'
import SuccessClient from '@/components/module/auth/client/successclient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
const success = async () => {
  const data = await getServerSession(authOptions);
  if (data !== null && data?.user?.role_id === "3" && data?.user?.subscription === "false") {
    redirect(`/Subscription`)
  }
  if (data !== null && data?.user?.role_id === "3" && data?.user?.subscription !== "false") {
    redirect("/Attorney/dashboard")
  }
  // if (data !== null && data?.user?.role_id === "6" && data?.user?.subscription === "false") {
  //    redirect(`/AssistantSubscription`)
  // }
  if (data !== null && data?.user?.role_id === "6") {
    redirect("/AttorneyAssistant/dashboard")
  }
  if (data !== null && data?.user?.role_id === "4" && data?.user?.subscription === "false") {
    redirect(`/PhysicianSubscription`)
  }
  if (data !== null && data?.user?.role_id === "8" && data?.user?.subscription === "false") {
    redirect(`/ExpertSubscription`)
  }
  if (data !== null && data?.user?.role_id === "8" && data?.user?.subscription !== "false") {
    redirect(`/Expert/dashboard`)
  }
  if (data !== null && data?.user?.role_id === "4" && data?.user?.subscription !== "false") {
    redirect("/Physician/dashboard")
  }
  if (data !== null && data?.user?.role_id === "5" && data?.user?.subscription === "false") {
    redirect(`/CourtReporterSubscription`)
  }
  if (data !== null && data?.user?.role_id === "5" && data?.user?.subscription !== "false") {
    redirect("/CourtReporter/dashboard")
  }
  else
    return (
      <div className="App">
        <Header />
        <SuccessClient />
        <Footer />
      </div>
    )
}

export default success