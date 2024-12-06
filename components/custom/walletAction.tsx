'use client';


import { providers, utils, transactions } from 'near-api-js';
import React, { useEffect, useState } from 'react';

import { useWalletSelector } from "@/components/context/wallet-selector-provider"

export const SmartAction = ({ props: data, methods, receiverId }: { props: any, methods: string, receiverId: string }) => {

    const { accountId, selector, modal } = useWalletSelector();
    const [isAccountAddress, setIsAccountAddress] = useState(null);

    useEffect(() => {
        if (accountId) {
            console.log(accountId)
            setIsAccountAddress(accountId as any)
        }
    }, [accountId])

    const onTransfer = async () => {
        try {
            const wallet = await selector.wallet();
            await wallet.signAndSendTransaction({
                signerId: accountId!,
                receiverId,
                actions: [
                    {
                        type: "FunctionCall",
                        params: {
                            methodName: methods,
                            args: data,
                            gas: "30000000000000",
                            deposit: "10000000000000000000000",
                        },
                    },
                ],
            });
        } catch (err) {
            console.error('Error', err);
        }
    };

    return (
        <>
            <div className="flex flex-col gap-3 px-4 py-3 text-white">
                <span>Function : {data.function}</span>
                <p>
                    {JSON.stringify(
                        data,
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

export const ChainSignature = ({ props: data, methods, receiverId }: { props: any, methods: string, receiverId: string }) => {


    const { accountId, selector, modal } = useWalletSelector();


    const callMethod = async ({ contractId, method, args = {}, gas = '30000000000000', deposit = '0' }: { contractId: string, method: string, args?: Record<string, any>, gas?: string, deposit?: string }): Promise<any> => {
        const selectedWallet = await selector.wallet();
        const url = `https://rpc.mainnet.near.org`;
        const provider = new providers.JsonRpcProvider({ url });

        const outcome = await selectedWallet.signAndSendTransaction({
            receiverId: contractId,
            actions: [
                {
                    type: 'FunctionCall',
                    params: {
                        methodName: method,
                        args,
                        gas,
                        deposit,
                    },
                },
            ],
        });

        return providers.getTransactionLastResult(outcome as any);
    };
}
