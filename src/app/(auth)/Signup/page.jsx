import Header from '@/components/module/common/client/Header';
import Footer from '@/components/module/common/client/Footer';
import SignupPasswordForm from '@/components/module/auth/client/signuppasswordform';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
const Signup = async () => {
  const data = await getServerSession(authOptions);
  if (data !== null) {
    redirect('/Success');
  } else
    return (
      <div className="App">
        <Header />
        <SignupPasswordForm />

        <Footer />
      </div>
    );
};

export default Signup;
