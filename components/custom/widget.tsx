'use client';

import { providers } from 'near-api-js'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary';
import StringToReactComponent from 'string-to-react-component'

import { TransactionFrame, NearTransaction } from './walletAction'

export const Widget = ({ code, args, append }: { code: string, args: any, append: any }) => {
    const near = new providers.JsonRpcProvider({
        url: `https://rpc.mainnet.near.org`,
    });
    const generateDestructuring = (args: any) => { const keys = Object.keys(args); return keys.length ? `const { ${keys.join(', ')} } = args;` : ''; };
    const Fallback = ({ error, resetErrorBoundary }: any) => {
        // Call resetErrorBoundary() to reset the error boundary and retry the render.
        return (
            <div role="alert">
                <p>Something went wrong:</p>
                <pre style={{ color: "red" }}>{error.message}</pre>
            </div>
        );
    }
    const appendMessage = (message: any) => {
        append({ role: 'user', content: message });
    }
    return (
        <ErrorBoundary FallbackComponent={Fallback}>
            {
            /*
                1. Create custom widget Agent like : <widget prompt="blue span with balance of wallet 0x1231 from tool" > </widget>
                2. Can handle multiple multi-chain wallets and funding
            */}
            <StringToReactComponent data={{ useEffect, useState, near, args, TransactionFrame, NearTransaction, appendMessage }}>
                {`(props)=>{
                    const {useEffect, useState, near, args, TransactionFrame ,appendMessage } = props;
                    ${generateDestructuring(args)}
                        ${code}
                }`}
            </StringToReactComponent>
        </ErrorBoundary>
    );

};