'use client';

import React, { useEffect, useState } from 'react';


import TransactionReview from './transaction-review';
import { Button } from '../ui/button';

export const NearTransaction = ({ transaction }: any) => {

    const [isAccountAddress, setIsAccountAddress] = useState(null);

   

    const onTransfer = async () => {
        // const originalObject = JSON.parse(transaction);
        // const signer = { signerId: accountId! };
        // const args = { ...signer, ...originalObject }

        // try {
        //     const wallet = await selector.wallet();
        //     await wallet.signAndSendTransaction({
        //         signerId: accountId!,
        //         receiverId: args.receiverId,
        //         actions: [
        //             {
        //                 type: "FunctionCall",
        //                 params: {
        //                     methodName: args.actions[0].params.methodName,
        //                     args: args.actions[0].params.args,
        //                     gas: "30000000000000",
        //                     deposit: "10000000000000000000000",
        //                 },
        //             },
        //         ],
        //     });
        // } catch (err) {
        //     console.error('Error', err);
        // }
    };

    return (
        <>
            <div className="flex flex-col gap-3 px-4 py-3 text-white">
                {isAccountAddress ? (<div
                    className="flex w-full cursor-pointer items-center justify-center gap-1 px-11 py-1 uppercase [border-image-slice:13_fill] [border-image-width:15px] md:w-auto "
                    onClick={onTransfer}
                >
                    <i className="ico-send-right-icon" />
                    Excute
                </div>
                ) : (
                    <Button
                        className="flex w-full cursor-pointer items-center justify-center gap-1 px-11 py-1 uppercase [border-image-slice:13_fill] [border-image-width:15px] md:w-auto "
                    >
                        <i className="ico-send-right-icon" /> Login to excute
                    </Button>
                )}

            </div>
        </>
    );
};

export const TransactionFrame = ({ transaction }: any) => {


    const originalObject = JSON.parse(transaction);
    const signer = { signerId: "accountId!" };
    const args = { ...signer, ...originalObject }
    const onTransfer = async () => {
        try {

        } catch (err) {
            console.error('Error', err);
        }
    };
    const yoctoNEAR = BigInt("10000000000000000000000");
    return (
        <TransactionReview
            dapp={{
                name: "testnet.aipgf-playground.ai",
                url: "https://testnet.aipgf-playground.ai"
            }}
            type={args.actions[0].params.methodName}
            amount={(yoctoNEAR / BigInt(args.actions[0].params.deposit)).toString()}
            from={args.receiverId}
            to={'accountId!'}
            fees={{
                estimated: "0.00000",
                limit: "0",
                deposit: "0"
            }}
            contact={{
                id: args.receiverId,
                call: args.actions[0].params.methodName,
                details: args.actions[0].params.args
            }}
            onApprove={onTransfer}
            onDecline={() => console.log("Transaction declined")}

        />
    );
};


