'use client';
import React,{useState,useEffect} from 'react'
import userimgplaceholder from '../../../../../assets/images/user-img-placeholder.png';
import browseicon from '../../../../../assets/images/case-icon/browse-file-popup-icon.svg';
import Image from 'next/image';
import { WithTokenSingleFormdataPostApi } from '@/services/module/api/postapi';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { imagePath } from '@/config';
import { useSession } from 'next-auth/react';

const UploadImageModal = ({handleclose}) => {
  const [error, seterror] = useState("");
  const [profilepic, setprofilepic] = useState("");
  const { data: session, update } = useSession();
  const axiosAuth = useAxiosAuth();
  const handlecancel=()=>{
    handleclose()
  }
  async function updateSession(value) {
    await update({
      ...session,
      user: {
        ...session?.user,
        profile_image:value
      },
    });
  }
  const {
    trigger: imageuploadtrigger,
    isMutating,
    data: imagedata
  } = useSWRMutation(
    `/profile/updateProfileImage/${session?.user?.id}`,
    WithTokenSingleFormdataPostApi
  );
  useEffect(() => {
    if(imagedata?.status ===200){
      toast.success(imagedata?.data?.message);
      updateSession(imagedata?.data?.image);
      handleclose()
    }
  }, [imagedata]);
  const handleFieldChange = (e) => {
    if (e.target.type === "file") {
      if(e.target.files[0].size>2000000){
        seterror("Photo size can't be more than 2 mb")
      }
      if(e.target.files[0].name.slice(-5) ===".webp"){
        seterror("You can only add photo with jpg, png and jpeg extension")
      }
      if(e.target.files[0].size<2000000 && e.target.files[0].name.slice(-5) !==".webp"){
        seterror("")
        setprofilepic(e.target.files[0])
      }
     
   
    }
  };
  const handleSave=()=>{
     if(profilepic !==""){
      imageuploadtrigger({
        payload: profilepic,
        axios: axiosAuth,
        name: 'image',
      });
     }
     
  }
  return (
    <>
    <input type="checkbox" id="upload-profile-img" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <label  className="modal-close-btn"  onClick={handlecancel}>✕</label>
          <h3 className="modal-title">Upload Profile Image</h3>
          <div className='modal-body'>
              <div className='flex justify-center'>
                <div className="c-profile-img flex-1" >
                  <Image 
                  src={
                    profilepic !== ""
                      ? URL?.createObjectURL(profilepic)
                      : session?.user?.profile_image ==='null' ?userimgplaceholder:imagePath + session?.user?.profile_image
                  }
                  width={500}
                  height={500}
                  alt="" />
                </div>
              </div>
              {error !== '' && (
                      <div className="cl-col basis-auto">
                        <span className=" text-red-700 text-xs">
                          {error}
                        </span>
                      </div>
                    )}
              <div className='mt-5 max-w-sm mx-auto'>
                <input type="file" 
                className="file-input w-full max-w-xs hidden" 
                id='file-upload' 
                hidden
                accept="image/jpeg, image/png, image/jpg"
                multiple={false}
                onChange={handleFieldChange}
                />
                <label htmlFor="file-upload" className='flex flex-col items-center bg-white hover:bg-slate-50 justify-center cursor-pointer h-20 border-dashed border border-slate-400 rounded'>
                  <Image src={browseicon} alt="" className="w-9" />
                  <span>Browse File</span>
                </label>
              </div>
          </div>
          <div className="modal-action">
            <div className='flex flex-wrap justify-center w-full'>
              <label  type="button" className="primary-btn btn-outline cursor-pointer" 
              onClick={handlecancel}
              >Cancel</label>
              {(profilepic !=="" || isMutating) &&
                <div type="button" className="primary-btn ml-2.5"
                onClick={handleSave}
                >Save</div>
              
              }
            
            </div>
          </div>
        </div>
      </div>
      </>
  )
}

export default UploadImageModal