import Image from 'next/image';
import React, { useState } from 'react';
import browseicon from '../../../../assets/images/case-icon/browse-file-popup-icon.svg';
const Uploadfilesmodal = ({ handleuploadfilemodal }) => {
  const [file, setfile] = useState([]);
  const handleuploadmodal = (type) => {
    handleuploadfilemodal(type);
  };
  const handleFieldChange = (e) => {
    let tempfile = Object.values(e.target.files);
    let allfile = [...file, ...tempfile];
    setfile(allfile);
  };
  return (
    <>
      <input type="checkbox" id="create-case-file" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box !max-w-[38rem]">
          <label
            className="modal-close-btn"
            onClick={() => handleuploadmodal('false')}
          >
            ✕
          </label>
          <h3 className="pb-3">Upload Files</h3>
          <h5 className="pb-2 font-light">
            Supported Formats are .DOC, .PDF, .XLSX, .PPT, .MP3, .MP4
          </h5>
          <h6 className="font-light pb-3">Max file size 20MB</h6>
          <div className="modal-body">
            <input
              type="file"
              className="file-input w-full max-w-xs hidden"
              accept=".doc, .docx,.ppt, .pptx,.txt,.pdf"
              id="file-upload"
              multiple={true}
              onChange={handleFieldChange}
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center bg-white hover:bg-slate-50 justify-center cursor-pointer h-28 border-dashed border border-slate-400 rounded"
            >
              <Image src={browseicon} alt="" className="w-9" />
              <span>Browse File</span>
            </label>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {file?.length > 0 &&
              file?.map((item, i) => (
                <button
                  title={item?.name}
                  className="bg-[#e0eefb] border border-solid border-[#8790af] p-3 rounded-3xl text-[#125ecb] h-12 text-sm font-medium flex items-center justify-between leading-normal 
            gap-3"
                  key={i}
                >
                  <span className="truncate block">{item?.name}</span>
                </button>
              ))}
          </div>
          <div className="modal-action">
            <div className="flex flex-wrap justify-center w-full">
              <button
                className="primary-btn ml-2.5 px-12"
                onClick={() => handleuploadmodal('false')}
              >
                Cancel
              </button>
            </div>
            <div className="flex flex-wrap justify-center w-full">
              <button
                type="button"
                className={`primary-btn ml-2.5 px-12 ${
                  file === '' ? 'disable' : null
                }`}
                disabled={file?.length === 0}
                //className="primary-btn ml-2.5 px-12 disable"
                onClick={() => handleuploadmodal(file)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Uploadfilesmodal;
