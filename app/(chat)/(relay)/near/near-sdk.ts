import { KeyPair, KeyPairString } from '@near-js/crypto';
import { connects, getNearAccount, submitTransaction } from './helper/meta-transaction';
import { InMemoryKeyStore } from '@near-js/keystores';
import { actionCreators, encodeSignedDelegate } from '@near-js/transactions';
import { generateSeedPhrase } from 'near-seed-phrase';
import * as nearAPI from 'near-api-js';

const getNetworkId = () => process.env.NEAR_NETWORK_ID === "mainnet" ? "mainnet" : "testnet";
const getRelayerAccountId = () => process.env.NEAR_NETWORK_ID === "mainnet" ? process.env.NEAR_RELAYER_ACCOUNT_ID_NEAR_MAINNET : process.env.NEAR_RELAYER_ACCOUNT_ID_NEAR_TESTNET;
const getRelayerPrivateKey = () => process.env.NEAR_NETWORK_ID === "mainnet" ? process.env.RELAYER_PRIVATE_KEY_NEAR_MAINNET : process.env.RELAYER_PRIVATE_KEY_NEAR_TESTNET;
const getRpc = () => process.env.NEAR_NETWORK_ID == "mainnet" ? process.env.RPC_MAINNET : process.env.RPC_TESTNET;

const initializeKeyStore = async () => {
    const keyStore = new InMemoryKeyStore();
    await keyStore.setKey(getNetworkId(), getRelayerAccountId() as string, KeyPair.fromString(getRelayerPrivateKey() as KeyPairString));
    return keyStore;
};


export const signerAccount = async () => {
    const keyStore = await initializeKeyStore();
    const signerAccount = await connects(getRelayerAccountId() as string, keyStore, getNetworkId());
    return signerAccount;
};

export const CreateAccount = async (accountId: string) => {
    console.log("accountId: ", accountId);
    const keyStore = await initializeKeyStore();
    const signerAccount = await connects(getRelayerAccountId() as string, keyStore, getNetworkId());

    if (!signerAccount) {
        throw new Error("Account not defined");
    }

    const { seedPhrase, publicKey, secretKey } = generateSeedPhrase();
    const gas = BigInt("200000000000000");
    const deposit = BigInt("0");
    const args = {
        new_account_id: accountId,
        new_public_key: publicKey,
    };

    const action = actionCreators.functionCall(
        "create_account_advanced",
        args,
        gas,
        deposit
    );
    const near = await getNearAccount(getNetworkId(), keyStore, getRelayerAccountId() as string);
    const signedDelegates = await near.signedDelegate({
        actions: [action],
        blockHeightTtl: 60,
        receiverId: "near",
    });
    const res = await submitTransaction(signedDelegates);

    return { res, privateKey: secretKey, seed: seedPhrase };
}
export const stateAccounts = async (accountId: string) => {
    try {
        const provider = new nearAPI.providers.JsonRpcProvider({ url: getRpc() || '' });
        let res = await provider.query({
            request_type: "view_account",
            finality: "final",
            account_id: accountId,
        });
        return res;
    } catch (error) {
        return error
    }
}
export const createImplicitAccount = async () => {
    const { seedPhrase, publicKey, secretKey } = generateSeedPhrase();
    const keyPair = KeyPair.fromString(secretKey as KeyPairString);

    const keyStore = await initializeKeyStore();
    await keyStore.setKey(getNetworkId(), publicKey, keyPair);

    const signerAccount = await connects(getRelayerAccountId() as string, keyStore, getNetworkId());
    if (!signerAccount) {
        throw new Error("Account not defined");
    }

    return { seedPhrase, publicKey, secretKey };
};
export const getAccount = async (pub: string) => {
    try {
        const account = (await fetch(`https://api.nearblocks.io/v1/kitwallet/publickey/${pub}/accounts`)).json();
        return account;
    } catch (error) {
        return error;
    }
}

export async function getState(accountId: string) {
    const response = await stateAccounts(accountId);
    return { response };
}

export async function connectAccount(accountId: string, privateKey: KeyPairString) {
    const keyStore = new InMemoryKeyStore();
    await keyStore.setKey(getNetworkId(), accountId, KeyPair.fromString(privateKey));
    const signerAccount = await connects(accountId, keyStore, getNetworkId());
    return signerAccount;
}

