'use client';

import { useEffect, useState } from 'react'
import { providers } from 'near-api-js'
import StringToReactComponent from 'string-to-react-component'

import { Transaction } from './walletAction'

export const Widget = ({ code, args }: { code: string, args: any }) => {
    const near = new providers.JsonRpcProvider({
        url: `https://rpc.mainnet.near.org`,
    });

    const widget = ({ code }: any) => {
        return <p>{code}</p>;
    }


    return (<StringToReactComponent data={{ useEffect, useState, near, args, widget, Transaction }}>
        {`(props)=>{
                       const {useEffect, useState, near, args, widget, Transaction } = props;
                           
                          return (
                        <Transaction transaction={args.transaction}/>
                       )
                    }`}
    </StringToReactComponent>

    );

};