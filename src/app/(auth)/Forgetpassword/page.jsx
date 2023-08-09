import React from 'react';
import Link from 'next/link';
import Header from '@/components/module/common/client/Header';
import Footer from '@/components/module/common/client/Footer';
import ForgotPasswordForm from '@/components/module/auth/client/forgetpasswordform';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
const ForgotPassword = async () => {
  const data = await getServerSession(authOptions);
  if (data !== null) {
    redirect('/Success');
  } else
    return (
      <div className="App">
        <Header />
        <div className="auth-page auth-page-bg p-top-padding p-end-padding">
          <div className="container">
            <div className="auth-page-wrap">
              <h2 className="auth-page-title">Forgot your Password?</h2>
              <p className="auth-page-text">
                Enter Your Email Id to Receive a Verification Code
              </p>

              <ForgotPasswordForm />
              <p className="auth-page-link">
                Back to <Link href="/Signin">Login</Link>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
};

export default ForgotPassword;
