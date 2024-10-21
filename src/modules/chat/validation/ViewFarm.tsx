'use client';
import { useState, useEffect } from 'react';
import StringToReactComponent from 'string-to-react-component';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { ErrorBoundary } from 'react-error-boundary';

export const ViewFrame = ({ code }: { code: string }) => {
  const config = new AptosConfig({ network: Network.MAINNET });
  const aptos = new Aptos(config);

  const truncateAddress = (address: string, startLength: number = 6, endLength: number = 4) => {
    if (address.length <= startLength + endLength) return address;
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
  };

  const truncateAddressesInCode = (code: string) => {
    // Regular expression to match Aptos-style addresses (0x followed by 64 hexadecimal characters)
    const addressRegex = /0x[a-fA-F0-9]{64}/g;
    return code.replace(addressRegex, match => truncateAddress(match));
  };

  const processData = (data: any) => {
    if (Array.isArray(data)) {
      return data.map(item => <p>{item}</p>);
    } else {
      const getLastChildValue = (obj: any): any => {
        const keys = Object.keys(obj);
        const lastKey = keys[keys.length - 1];
        const value = obj[lastKey];

        if (typeof value === 'object') {
          return getLastChildValue(value);
        } else {
          return value;
        }
      };
      return getLastChildValue(data);
    }
  };

  const truncatedCode = truncateAddressesInCode(code);

  return (
    <>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <StringToReactComponent data={{ useEffect, useState, aptos, processData }}>
          {truncatedCode}
        </StringToReactComponent>
      </ErrorBoundary>
    </>
  );
};
export const ViewFrameDashboard = ({ code, id }: { code: string, id: string }) => {
  const config = new AptosConfig({ network: Network.MAINNET });
  const aptos = new Aptos(config);

  const truncateAddress = (address: string, startLength: number = 6, endLength: number = 4) => {
    if (address.length <= startLength + endLength) return address;
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
  };

  const truncateAddressesInCode = (code: string) => {
    // Regular expression to match Aptos-style addresses (0x followed by 64 hexadecimal characters)
    const addressRegex = /0x[a-fA-F0-9]{64}/g;
    return code.replace(addressRegex, match => truncateAddress(match));
  };

  const processData = (data: any) => {
    if (Array.isArray(data)) {
      return data.map(item => <p>{item}</p>);
    } else {
      const getLastChildValue = (obj: any): any => {
        const keys = Object.keys(obj);
        const lastKey = keys[keys.length - 1];
        const value = obj[lastKey];

        if (typeof value === 'object') {
          return getLastChildValue(value);
        } else {
          return value;
        }
      };
      return getLastChildValue(data);
    }
  };

  const truncatedCode = truncateAddressesInCode(code);

  return (
    <>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <StringToReactComponent data={{ useEffect, useState, aptos, processData, widgetId: id }}>
          {truncatedCode}
        </StringToReactComponent>
      </ErrorBoundary>
    </>
  );
};