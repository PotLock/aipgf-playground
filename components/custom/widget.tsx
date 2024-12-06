'use client';

import { providers } from 'near-api-js';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import StringToReactComponent from 'string-to-react-component';

export const ViewFrame = ({ code, args }: { code: string, args: any }) => {
    const near = new providers.JsonRpcProvider({
        url: `https://rpc.mainnet.near.org`,
    });

    function widget({ code }: any) {
        return <p>{code}</p>;
    }

    const destructuringString = `const { ${Object.keys(args).join(', ')} } = args;`;
    return (
        <>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <StringToReactComponent data={{ useEffect, useState, near, args, widget }}>
                    {`(props)=>{
                       const { useEffect , useState , near } = props;
                       ${destructuringString}
                       ${code}
                    }`}
                </StringToReactComponent>
            </ErrorBoundary>
        </>
    );

};