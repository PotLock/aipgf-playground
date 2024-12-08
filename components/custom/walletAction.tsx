'use client';

import React, { useEffect, useState } from 'react';

import { useWalletSelector } from "@/components/context/wallet-selector-provider"

import TransactionReview from './transaction-review';
import { Button } from '../ui/button';

export const Transaction = ({ transaction }: any) => {

    const { accountId, selector, modal } = useWalletSelector();
    const [isAccountAddress, setIsAccountAddress] = useState(null);

    useEffect(() => {
        if (accountId) {
            setIsAccountAddress(accountId as any)
        }
    }, [accountId])
    const originalObject = JSON.parse(transaction);
    const additionalData = { signerId: accountId! };
    const mergedObject = { ...additionalData, ...originalObject }
    const args = mergedObject;
    const onTransfer = async () => {
        console.log(mergedObject)
        try {
            const wallet = await selector.wallet();
            await wallet.signAndSendTransaction(mergedObject);
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
            to={accountId!}
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


