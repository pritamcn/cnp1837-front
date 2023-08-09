'use client';
import React,{useState} from 'react'
import UploadImageModal from '../Modal/UploadImageModal';
import userimgplaceholder from '../../../../../assets/images/user-img-placeholder.png';
import editpencilicon from './../../../../../assets/images/icons/edit-pencil.svg';
import Image from 'next/image';
import { imagePath } from '@/config';
import { useSession } from 'next-auth/react';
const Profilepicture = () => {
    const [upload, setupload] = useState(false);
    const { data: session} = useSession();
    const handleupload=()=>{
        setupload(true)
    }
    const handleclosemodal=()=>{
      setupload(false)
    }
  return (
           <div className="c-profile-img-wrap">
              <div
                className="c-profile-img flex-1"
               // style={{ backgroundImage: `url(${userimgplaceholder})` }}
              >
                 <label htmlFor='upload-profile-img' 
               onClick={handleupload}
              > <Image src={session?.user?.profile_image==='null' ?userimgplaceholder:imagePath+session?.user?.profile_image} alt=""  width={500} height={500}/></label>
               
              </div>
              <label htmlFor='upload-profile-img' className='edit-img'
               onClick={handleupload}
              ><Image src={editpencilicon} alt="" /></label>
              {upload && 
              <UploadImageModal 
              handleclose={handleclosemodal}
              />}
              
              </div>

    
  )
}

export default Profilepicture