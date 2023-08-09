import React from 'react';

const Confirm = ({ onConfirm, handlemodal }) => {
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
                <h3 className="modal-title">Confirmation</h3>
                <form
                    className="modal-body"
                    noValidate
                >
                    <div className="form-area flex -mx-2 flex-wrap">
                        <div className="w-full px-2">
                            <div className="mb-4">
                                Are you sure?
                            </div>
                        </div>
                    </div>
                    <div className="modal-action">
                        <div className="flex flex-wrap justify-center w-full">
                            <label
                                //htmlFor="add-bank-modal"
                                type="button"
                                className="primary-btn btn-outline"
                                onClick={handlemodal}
                            >
                                Cancel
                            </label>
                            <label className="primary-btn ml-2.5" onClick={onConfirm}>
                                Submit
                            </label>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Confirm;