import React from 'react';
import VisaLogo from '../../../../../assets/images/payment/visa-logo.svg';
import MasterCardLogo from '../../../../../assets/images/payment/mastercard-logo.svg';
import CloseIcon from '../../../../../assets/images/payment/close-icon.svg';
import Image from 'next/image';

const Card = ({ cardItem }) => {
    return (
        <label key={cardItem.id} className="label cursor-pointer justify-start p-4 items-start border-[0.0625rem] border-solid border-[#E3E3E3] rounded-lg relative max-w-full">
            <input
                type="radio"
                name="radio-10"
                value={cardItem.id}
                checked={cardItem.is_default}
                className="radio-sm checked:bg-primary mr-[0.8125rem]"
            />
            <div className="flex-1">
                <h1 className="label-text text-[#001725] font-semibold text-[0.9375rem]">
                    xxxx xxxx xxxx {cardItem.last4}
                </h1>
                <h2 className="text-[#686E80] text-[0.6875rem] font-normal py-[0.5625rem]">
                    Expiry {cardItem.exp_month + '/' + cardItem.exp_year}
                </h2>
                <div className="flex items-center justify-between mt-[0.625rem]">
                    <h3 className="text-[#001725] text-[0.8125rem] font-normal">
                        {cardItem.card_holder_name}
                    </h3>
                    <div className="w-[2.6875rem] flex items-center justify-end overflow-hidden">
                        <Image
                            src={cardItem.card_brand === 'visa' ? VisaLogo : MasterCardLogo}
                            alt="Visa logo"
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            </div>
            {!cardItem.is_default &&
                <div className="w-8 flex items-center justify-center overflow-hidden absolute top-0 right-0 z-10 p-[0.625rem]">
                    <Image
                        src={CloseIcon}
                        alt="Close icon"
                        className="w-full h-auto"
                    />
                </div>
            }
        </label>
    )
}

const Bank = ({ bankItem }) => {
    return (
        <label className="label cursor-pointer justify-start p-4 items-start border-[0.0625rem] border-solid border-[#E3E3E3] rounded-lg relative max-w-full">
            <input
                type="radio"
                name="radio-10"
                value={bankItem.id}
                checked={bankItem.is_default}
                className="radio-sm checked:bg-primary mr-[0.8125rem]"
            />
            <div className="flex-1">
                <h1 className="label-text text-[#001725] font-semibold text-[0.9375rem]">
                    xxxx xxxx xxxx {bankItem.account_number}
                </h1>
                <h2 className="text-[#686E80] text-[0.6875rem] font-normal py-[0.5625rem]">
                    Routing no {bankItem.routing_number}
                </h2>
                <div className="flex items-center justify-between mt-[0.625rem]">
                    <h3 className="text-[#001725] text-[0.8125rem] font-normal">
                        {bankItem.account_holder_name}
                    </h3>
                    <div className="w-[2.6875rem] flex items-center justify-end overflow-hidden">
                        {bankItem.bank_name}
                    </div>
                </div>
            </div>
            {!bankItem.is_default &&
                <div className="w-8 flex items-center justify-center overflow-hidden absolute top-0 right-0 z-10 p-[0.625rem]">
                    <Image
                        src={CloseIcon}
                        alt="Close icon"
                        className="w-full h-auto"
                    />
                </div>
            }
        </label>
    )
}

export { Card, Bank };