import React from 'react';
import Image from 'next/image';

const Confirm = ({ modalTitle, modalImage, onConfirm, handlemodal }) => {
    return (
        <div className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <label
                    htmlFor="add-bank-modal"
                    className="modal-close-btn"
                    onClick={handlemodal}
                >
                    ✕
                </label>
                <h3 className="modal-title">{modalTitle}</h3>
                {modalImage &&
                    <div className='modal-body'>
                        <div className='flex justify-center'>
                            <Image src={modalImage} className="mb-4" alt="" />
                        </div>
                    </div>
                }
                <div className="modal-action">
                    <div className="flex flex-wrap justify-center w-full">
                        <label
                            type="button"
                            className="primary-btn btn-outline"
                            onClick={handlemodal}
                        >
                            No
                        </label>
                        <label className="primary-btn ml-2.5" onClick={onConfirm}>
                            Yes
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Confirm;