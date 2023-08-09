'use client';
import Image from 'next/image'
import React,{useState} from 'react'
import binicon from '../../../../assets/images/icons/delete.svg';
const Deletemodal = ({handledeletemodal}) => {
  const [condition, setcondition] = useState(null);
  const handledeletestatus=(type)=>{
    handledeletemodal(type)
  }
  return (
    <>
    <input type="checkbox" id="remove-card" className="modal-toggle" />
    <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <label htmlFor="remove-card" className="modal-close-btn"
          onClick={()=>handledeletestatus("No")}
          >✕</label>
          <h3 className="modal-title">Are you sure you want to delete </h3>
          <div className='modal-body'>
              <div className='flex justify-center'>
                <Image src={binicon} className="mb-4" alt="" />
              </div>
          </div>
          <div className="modal-action">
            <div className='flex flex-wrap justify-center w-full'>
              <label  type="button" className="primary-btn btn-outline cursor-pointer"
              onClick={()=>handledeletestatus("No")}
              >No</label>
              <button type="button" className="primary-btn ml-2.5"
              onClick={()=>handledeletestatus("Yes")}
              >Yes</button>
            </div>
          </div>
        </div>
      </div>
      </>
  )
}

export default Deletemodal