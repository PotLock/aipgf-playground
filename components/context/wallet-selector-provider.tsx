"use client"

import type { AccountState, WalletSelector } from "@near-wallet-selector/core";
import { setupWalletSelector } from "@near-wallet-selector/core";
import type { WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupBitteWallet } from "@near-wallet-selector/bitte-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { providers, utils } from "near-api-js";

import type { ReactNode } from "react";
import React, {
    useCallback,
    useContext,
    useEffect,
    useState,
    useMemo,
} from "react";
import { distinctUntilChanged, map } from "rxjs";


declare global {
    interface Window {
        selector: WalletSelector;
        modal: WalletSelectorModal;
    }
}

interface WalletSelectorContextValue {
    selector: WalletSelector;
    modal: WalletSelectorModal;
    accounts: Array<AccountState>;
    accountId: string | null;
    viewMethod: (params: {
        contractId: string;
        method: string;
        args?: Record<string, unknown>;
    }) => Promise<any>;
    getBalance: (accountId: string) => Promise<number>;
    callMethod: (params: {
        contractId: string;
        method: string;
        args?: Record<string, unknown>;
        gas?: string;
        deposit?: string;
    }) => Promise<any>;
    sendToken: (receiverId: string, amount: string) => Promise<any>;
}

const WalletSelectorContext =
    React.createContext<WalletSelectorContextValue | null>(null);

export const Loading: React.FC = () => (
    <div className="lds-ellipsis">
        <div />
        <div />
        <div />
        <div />
    </div>
);

export const WalletSelectorContextProvider: React.FC<{
    children: ReactNode;
}> = ({ children }) => {
    const [selector, setSelector] = useState<WalletSelector | null>(null);
    const [modal, setModal] = useState<WalletSelectorModal | null>(null);
    const [accounts, setAccounts] = useState<Array<AccountState>>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const init = useCallback(async () => {
        const _selector = await setupWalletSelector({
            network: "mainnet",
            debug: true,
            modules: [
                setupNightly() as any,
                setupMyNearWallet(),
                setupHereWallet(),
                setupMeteorWallet(),
                setupBitteWallet({
                    walletUrl: "https://mainnet.wallet.bitte.ai",
                    callbackUrl: process.env.NEXTAUTH_URL,
                    deprecated: false,
                }),
            ],
        });
        const _modal = setupModal(_selector, {
            contractId: "social.near",
        });
        const state = _selector.store.getState();
        setAccounts(state.accounts);

        // this is added for debugging purpose only
        // for more information (https://github.com/near/wallet-selector/pull/764#issuecomment-1498073367)
        window.selector = _selector;
        window.modal = _modal;

        setSelector(_selector);
        setModal(_modal);
        setLoading(false);
    }, []);

    useEffect(() => {
        init().catch((err) => {
            console.error(err);
            alert("Failed to initialise wallet selector");
        });
    }, [init]);

    useEffect(() => {
        if (!selector) {
            return;
        }

        const subscription = selector.store.observable
            .pipe(
                map((state: any) => state.accounts),
                distinctUntilChanged()
            )
            .subscribe((nextAccounts: any) => {
                console.log("Accounts Update", nextAccounts);

                setAccounts(nextAccounts);
            });

        const onHideSubscription = modal!.on("onHide", ({ hideReason }: any) => {
            console.log(`The reason for hiding the modal ${hideReason}`);
        });

        return () => {
            subscription.unsubscribe();
            onHideSubscription.remove();
        };
    }, [selector, modal]);

    const viewMethod = useCallback(
        async ({
            contractId,
            method,
            args = {},
        }: {
            contractId: string;
            method: string;
            args?: Record<string, unknown>;
        }) => {
            if (!selector) return null;
            
            const { network } = selector.options;
            const url = `https://rpc.${network.networkId}.near.org`;
            const provider = new providers.JsonRpcProvider({ url });

            const res = await provider.query({
                request_type: "call_function",
                account_id: contractId,
                method_name: method,
                args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
                finality: "optimistic",
            });
            // @ts-ignore
            return JSON.parse(Buffer.from(res?.result).toString());
        },
        [selector]
    );

    const getBalance = useCallback(
        async (accountId: string) => {
            if (!selector) return 0;
            
            const { network } = selector.options;
            const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

            try {
                // Retrieve account state from the network
                const account: any = await provider.query({
                    request_type: 'view_account',
                    account_id: accountId,
                    finality: 'final',
                });

                // Format the amount and remove commas
                const amountString = utils.format.formatNearAmount(account?.amount);
                const amount = Number(amountString.replace(/,/g, "").trim());

                // Return amount in NEAR
                return account?.amount ? amount : 0;
            } catch (error) {
                console.error('Error getting balance:', error);
                return 0;
            }
        },
        [selector]
    );

    const callMethod = useCallback(
        async ({
            contractId,
            method,
            args = {},
            gas = '30000000000000',
            deposit = '0'
        }: {
            contractId: string;
            method: string;
            args?: Record<string, unknown>;
            gas?: string;
            deposit?: string;
        }) => {
            if (!selector) return null;

            try {
                // Get the wallet
                const wallet = await selector.wallet();
                
                // Check if we have an active account
                if (!accounts.length) {
                    await modal?.show();
                    return null;
                }

                const outcome = await wallet.signAndSendTransaction({
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

                return outcome;
            } catch (error) {
                console.error('Error calling method:', error);
                throw error;
            }
        },
        [selector, modal, accounts]
    );

    const sendToken = useCallback(
        async (receiverId: string, amount: string) => {
            if (!selector) return null;

            try {
                const wallet = await selector.wallet();
                
                if (!accounts.length) {
                    await modal?.show();
                    return null;
                }

                const outcome = await wallet.signAndSendTransaction({
                    actions: [
                        {
                            type: 'Transfer',
                            params: {
                                deposit: utils.format.parseNearAmount(amount) || '0',
                            },
                        },
                    ],
                    receiverId,
                });

                return outcome;
            } catch (error) {
                console.error('Error sending money:', error);
                throw error;
            }
        },
        [selector, modal, accounts]
    );

    const walletSelectorContextValue = useMemo<WalletSelectorContextValue>(
        () => ({
            selector: selector!,
            modal: modal!,
            accounts,
            accountId: accounts.find((account) => account.active)?.accountId || null,
            viewMethod,
            getBalance,
            callMethod,
            sendToken,
        }),
        [selector, modal, accounts, viewMethod, getBalance, callMethod, sendToken]
    );

    if (loading) {
        return <Loading />;
    }

    return (
        <WalletSelectorContext.Provider value={walletSelectorContextValue}>
            {children}
        </WalletSelectorContext.Provider>
    );
};

export function useWalletSelector() {
    const context = useContext(WalletSelectorContext);

    if (!context) {
        throw new Error(
            "useWalletSelector must be used within a WalletSelectorContextProvider"
        );
    }

    return context;
}