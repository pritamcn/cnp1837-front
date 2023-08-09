'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Modal from 'react-modal';
import CloseIcon from '../../../../../assets/images/icons/close-icon.svg';
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '9999',
        width: '39rem',
        position: 'relative',
        padding: '0',
        maxHeight: 'calc(100vh - 10rem)',
        overflow: 'hidden',
    },
};

const AddExternalLawyer = ({ modalIsOpen, closeModal, submitModal, context, event, type }) => {

    const [formdata, setFormdata] = useState({
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState({
        firstname: '',
        lastname: ''
    });

    const validate = () => {
        let isError = false;
        let error = {
            firstname: '',
            lastname: ''
        }
        let { first_name, last_name } = formdata;
        if (first_name === '') {
            error.firstname = "First name can't empty";
            isError = true;
        }
        if (!isError && last_name === '') {
            error.lastname = "Last name can't empty";
            isError = true;
        }
        setError(error);
        return isError;
    }

    const submitModalHandler = () => {
        let errorStatus = validate();
        if (!errorStatus) {
            let events = event.map((item, index) => {
                if (index === (event.length - 1)) {
                    let label = `${formdata.first_name} ${formdata.last_name}(${context?.option?.value})`
                    return { ...item, value: label, label: label }
                } else
                    return item;
            });
            submitModal(events, type);
        }
    }

    return (
        <Modal
            isOpen={modalIsOpen}
            ariaHideApp={false}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <>
                <div className="flex items-center justify-between fixed top-0 left-0 w-full shadow bg-white">
                    <h2 className="ml-[1.0625rem]">Add External Lawyer</h2>
                    <button
                        title="Close modal"
                        onClick={closeModal}
                        type="button"
                        className="w-[3.375rem] overflow-hidden flex items-center justify-center p-[1.0625rem] bg-none border-none"
                    >
                        <Image src={CloseIcon} alt="Close Icon" className="w-full h-auto" />
                    </button>
                </div>

                <ul className="px-8 -my-[0.625rem] py-[5.25rem] h-[calc(100vh-8.75rem)] overflow-y-auto">
                    <li className="flex items-start py-[0.625rem]">
                        <div className="flex-1">

                            <div className="p-7">
                                <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-1">
                                    <div className="c-case-wrap-field-group">
                                        <h5 className="c-case-wrap-row-title w-full">Email</h5>
                                        <div className="form-field">
                                            <input
                                                type="text"
                                                placeholder="Email"
                                                className="form-control"
                                                disabled={true}
                                                value={context?.option?.value}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-2 mt-3">
                                    <div className="c-case-wrap-field-group">
                                        <h5 className="c-case-wrap-row-title w-full">First Name</h5>
                                        <div className="form-field">
                                            <input
                                                type="text"
                                                placeholder="First Name"
                                                className="form-control"
                                                value={formdata?.first_name}
                                                onChange={(e) => setFormdata({ ...formdata, first_name: e.target.value })}
                                            />
                                        </div>
                                        <p className="text-red-700 mb-0">
                                            {error?.firstname}
                                        </p>
                                    </div>
                                    <div className="c-case-wrap-field-group">
                                        <h5 className="c-case-wrap-row-title w-full">Last Name</h5>
                                        <div className="form-field">
                                            <input
                                                type="text"
                                                placeholder="Last Name"
                                                className="form-control"
                                                value={formdata?.last_name}
                                                onChange={(e) => setFormdata({ ...formdata, last_name: e.target.value })}
                                            />
                                        </div>
                                        <p className="text-red-700 mb-0">
                                            {error?.lastname}
                                        </p>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </li>
                </ul>



                <div className="flex items-center justify-end fixed bottom-0 left-0 w-full shadow-[0_-1px_3px__rgba(0,0,0,0.2)] p-3 bg-white">
                    <button
                        type="button"
                        className="primary-btn btn-outline mr-3"
                        onClick={submitModalHandler}
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        className="primary-btn btn-outline mr-3"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                </div>
            </>
        </Modal>
    )
}

export default AddExternalLawyer;