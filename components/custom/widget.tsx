'use client';

import { providers } from 'near-api-js'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary';
import StringToReactComponent from 'string-to-react-component'

import { Transaction } from './walletAction'

export const Widget = ({ code, args }: { code: string, args: any }) => {
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
    return (

        <ErrorBoundary FallbackComponent={Fallback}>

            <StringToReactComponent data={{ useEffect, useState, near, args, Transaction }}>
                {`(props)=>{
                    const {useEffect, useState, near, args, Transaction } = props;
                    ${generateDestructuring(args)}
                        return (
                           ${code}
                        )
                }`}
            </StringToReactComponent>
        </ErrorBoundary>
    );

};