'use client';

import { providers } from 'near-api-js';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import StringToReactComponent from 'string-to-react-component';

export const ViewFrame = ({ code, args }: { code: string, args: any }) => {
    const nearProvider = new providers.JsonRpcProvider({
        url: `https://rpc.mainnet.near.org`,
    });

    return (
        <>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <StringToReactComponent data={{ useEffect, useState, nearProvider }}>
                    {`(props)=>{
                        ${code}
                    }`}
                </StringToReactComponent>
            </ErrorBoundary>
        </>
    );

};