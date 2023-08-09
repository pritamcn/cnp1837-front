
import Image from 'next/image';
import successicon from './../../../../assets/images/icons/successful-icon.svg';

const SuccessClient = () => {
  return (
    <div className='auth-page auth-page-bg p-top-padding p-end-padding'>
    <div className="container">
          <div className="auth-page-wrap">
              <div className="flex justify-center mb-6">
                  <Image src={successicon} alt="" />
              </div>
              <h2 className="auth-page-title">Login Successful</h2>
          </div>
        </div>
    </div>
  )
}

export default SuccessClient