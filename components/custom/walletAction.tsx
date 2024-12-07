'use client';


import { providers, utils, transactions } from 'near-api-js';
import React, { useEffect, useState } from 'react';

import { useWalletSelector } from "@/components/context/wallet-selector-provider"

export const Transaction = ({ transaction }: any) => {

    const { accountId, selector, modal } = useWalletSelector();
    const [isAccountAddress, setIsAccountAddress] = useState(null);

    useEffect(() => {
        if (accountId) {
            setIsAccountAddress(accountId as any)
        }
    }, [accountId])

    const onTransfer = async () => {
        try {
            const wallet = await selector.wallet();
            await wallet.signAndSendTransaction({
                signerId: accountId!,
                ...JSON.parse(transaction),
            });
        } catch (err) {
            console.error('Error', err);
        }
    };

    return (
        <>
            <div className="flex flex-col gap-3 px-4 py-3 text-white">
                <p>
                    {JSON.stringify(
                        transaction,
                        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
                    )}
                </p>
                {isAccountAddress ? (<div
                    className="flex w-full cursor-pointer items-center justify-center gap-1 px-11 py-1 uppercase [border-image-slice:13_fill] [border-image-width:15px] md:w-auto "
                    onClick={onTransfer}
                >
                    <i className="ico-send-right-icon" /> Excute
                </div>) : (
                    <div
                        className="flex w-full cursor-pointer items-center justify-center gap-1 px-11 py-1 uppercase [border-image-slice:13_fill] [border-image-width:15px] md:w-auto "
                        onClick={modal.show}
                    >
                        <i className="ico-send-right-icon" /> Login to excute
                    </div>
                )}

            </div>
        </>
    );
};
