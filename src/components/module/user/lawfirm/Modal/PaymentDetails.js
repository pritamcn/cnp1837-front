import React from 'react'
import updepositionicon from '../../../../../assets/images/case-icon/up-deposition-icon.svg';
import CloseIcon from '../../../../../assets/images/payment/close-icon.svg';
import Image from 'next/image';

const PaymentDetails = ({ paymentdetails, handlemodal }) => {

    return (
        <div className="modal">

            <div className="modal-box !max-w-[64rem] max-h-[96.89vh]">
                <div className="modal-action absolute right-6 top-0">
                    <div
                        onClick={handlemodal}
                        className="w-[2.375rem] flex items-center justify-center overflow-hidden cursor-pointer"
                    >
                        <Image
                            src={CloseIcon}
                            alt="Close icon"
                            className="w-full h-auto"
                        />
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 pb-5">
                    <Image src={updepositionicon} alt="" />
                    Payment Details
                </div>
                <div className="bg-sky-50 rounded-xl p-6  grid grid-cols-1 lg:grid-cols-4 gap-5">
                    <div className="location-item">
                        <span className="location-label">Transaction No.</span>
                        <strong className="location-value">
                            {paymentdetails?.transaction_no}
                        </strong>
                    </div>
                    <div className="location-item">
                        <span className="location-label">Payment Date</span>
                        <strong className="location-value">
                            {paymentdetails?.due_date
                            }
                        </strong>
                    </div>
                    <div className="location-item">
                        <span className="location-label">Amount</span>
                        <strong className="location-value">
                            {paymentdetails?.amount}
                        </strong>
                    </div>
                    <div className="location-item">
                        <span className="location-label">Refund policy</span>
                        <strong className="location-value tooltip" data-tip={paymentdetails?.refund_policy}>
                            {paymentdetails?.refund_policy ? paymentdetails?.refund_policy.length > 20 ? paymentdetails?.refund_policy.substring(0, 21) : paymentdetails?.refund_policy : 'N/A'}
                        </strong>
                    </div>
                </div>

                <div className="modal-action mt-[1.875rem]">
                    <div className="primary-btn cursor-pointer" onClick={handlemodal}>
                        Close
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PaymentDetails;