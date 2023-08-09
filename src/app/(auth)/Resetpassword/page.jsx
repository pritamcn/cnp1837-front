import React from 'react';
import Header from '@/components/module/common/client/Header';
import Footer from '@/components/module/common/client/Footer';
import ResetPasswordForm from '@/components/module/auth/client/resetpasswordform';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
const ResetPassword = async () => {
  const data=await getServerSession(authOptions);
  if(data !==null){
   redirect("/Success")
  } else
  return (
    <div className="App">
      <Header/>
      <div className='auth-page auth-page-bg p-top-padding p-end-padding'>
      <div className="container">
            <div className="auth-page-wrap">
                <h2 className="auth-page-title">Reset Password</h2>
                <p className='auth-page-text'>Enter strong new password</p>

               <ResetPasswordForm/>
            </div>
          </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ResetPassword;
