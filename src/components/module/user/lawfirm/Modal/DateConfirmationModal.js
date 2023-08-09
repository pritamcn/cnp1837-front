import React from 'react';
import Modal from 'react-modal';
import defaulticon from '../../../../../assets/images/icons/default.svg';
import CloseIcon from '../../../../../assets/images/icons/close-icon.svg';
import Image from 'next/image';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '9999',
        width: '45.125rem',
        position: 'relative',
        padding: '0',
        maxHeight: '78vh',
        overflow: 'hidden',
    },
};

const DateConfirmationModal = ({ modalIsOpen, submitModal, closeModal, title,saveModal }) => {
    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel={`Confirmation`}
        >

            <div className="flex items-center justify-end fixed top-0 left-0 w-full bg-white z-50">
                <button
                    title="Close modal"
                    onClick={closeModal}
                    type="button"
                    className="w-[3.5rem] overflow-hidden flex items-center justify-center p-[1.0625rem] bg-none border-none"
                >
                    <Image
                        src={CloseIcon}
                        alt="Close Icon"
                        className="w-full h-auto"
                    />
                </button>
            </div>

            <div className="pt-14 pb-[5.375rem] px-8 h-[calc(100vh-3.125rem)] overflow-y-auto">
                <div className="c-services-top text-center mb-10">
                    <h2 className="c-services-top-title">{title}</h2>
                </div>
                <div className='flex justify-center'>
                    <Image src={defaulticon} className="mb-4" alt="" />
                </div>

                <div className='flex flex-wrap justify-center w-full mt-4'>
                    <label type="button" className="primary-btn btn-outline cursor-pointer"
                        onClick={saveModal}
                    >Save deposition on same time</label>
                    <button type="button" className="primary-btn ml-2.5"
                        onClick={submitModal}
                    >Yes</button>
                </div>

            </div>

        </Modal>
    )
}

export default DateConfirmationModal;