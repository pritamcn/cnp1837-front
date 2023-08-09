'use client';
import Image from 'next/image'
import React,{useState} from 'react'
import defaulticon from '../../../../assets/images/icons/default.svg';
const Defaultmodal = ({handledefaultmodal}) => {
  const [condition, setcondition] = useState(null);
  const handledefaultstatus=(type)=>{
    handledefaultmodal(type)
  }
  return (
    <>
    <input type="checkbox" id="default-card" className="modal-toggle" />
    <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <label htmlFor="default-card" className="modal-close-btn"
          onClick={()=>handledefaultstatus("No")}
          >✕</label>
          <h3 className="modal-title">Are you sure you want to make it default</h3>
          <div className='modal-body'>
              <div className='flex justify-center'>
                <Image src={defaulticon} className="mb-4" alt="" />
              </div>
          </div>
          <div className="modal-action">
            <div className='flex flex-wrap justify-center w-full'>
              <label  type="button" className="primary-btn btn-outline cursor-pointer"
              onClick={()=>handledefaultstatus("No")}
              >No</label>
              <button type="button" className="primary-btn ml-2.5"
              onClick={()=>handledefaultstatus("Yes")}
              >Yes</button>
            </div>
          </div>
        </div>
      </div>
      </>
  )
}

export default Defaultmodal