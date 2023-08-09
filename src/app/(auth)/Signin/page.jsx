import React from 'react';
import Link from 'next/link';
import Header from '@/components/module/common/client/Header';
import Footer from '@/components/module/common/client/Footer';
import SigninForm from '@/components/module/auth/client/signinform';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
const Signin = async () => {
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
              <h2 className="auth-page-title">Login</h2>
              <p className="auth-page-text">
                Enter the Information You Entered While Registering
              </p>
              <SigninForm />
              <p className="auth-page-link">
                Don't have an account? <Link href="/Signup">Register</Link>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
};

export default Signin;
