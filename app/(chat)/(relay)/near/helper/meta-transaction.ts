import { KeyPair, PublicKey, KeyPairString } from '@near-js/crypto';
import type { KeyStore } from '@near-js/keystores';
import { InMemoryKeyStore } from '@near-js/keystores';
import { JsonRpcProvider } from '@near-js/providers';
import { InMemorySigner } from '@near-js/signers';
import type { SignedDelegate } from '@near-js/transactions';
import { actionCreators } from '@near-js/transactions';
const BN = require("bn.js")
const { Account, Near, keyStores } = require('near-api-js');

export const { signedDelegate } = actionCreators;
const keyStore = new InMemoryKeyStore();

export const instatiateAccount = async (network: string, accountName: string, pk: string) => {
  const relayerKeyStore = await authenticatedKeyStore(network, accountName, pk as any);

  return await connects(accountName, relayerKeyStore, network);
};

export const authenticatedKeyStore = async (network: string, account: string, pk: KeyPairString): Promise<KeyStore> => {
  await keyStore.setKey(network, account, KeyPair.fromString(pk) as any);

  return keyStore;
};

export const randomKeyStore = async (network: string, account: string): Promise<KeyStore> => {
  const kp = KeyPair.fromRandom('ed25519');
  await keyStore.setKey(network, account, kp as any);

  return keyStore;
};

export const connects = async (accountId: string, keyStore: KeyStore, network = 'mainnet'): Promise<typeof Account> => {
  const provider = new JsonRpcProvider({
    url: network == 'mainnet' ? 'https://rpc.mainnet.near.org' : 'https://rpc.testnet.near.org',
  });

  const signer = new InMemorySigner(keyStore);

  return new Account(
    {
      networkId: network,
      provider,
      signer,
      jsvmAccountId: '',
    },
    accountId,
  );
};

export const createAccount = async (implicitAccount: string, publicKey: string, network: string) => {
  const isMainnet = network === 'mainnet';
  const RELAYER_ACCOUNT: string | undefined = isMainnet
    ? process.env.NEXT_PUBLIC_RELAYER_ACCOUNT_ID_NEAR_MAINNET
    : process.env.NEXT_PUBLIC_RELAYER_ACCOUNT_ID_NEAR_TESTNET;

  if (!RELAYER_ACCOUNT) {
    throw new Error('Signer details not found in firebase');
  }

  const relayerPrivateKey = isMainnet
    ? (process.env.RELAYER_PRIVATE_KEY_NEAR_MAINNET as string)
    : (process.env.RELAYER_PRIVATE_KEY_NEAR_TESTNET as string);
  const relayerAccount = await instatiateAccount(network, RELAYER_ACCOUNT, relayerPrivateKey);
  await relayerAccount.createAccount(implicitAccount, PublicKey.fromString(publicKey), new BN('0'));

};

export const  submitTransaction = async ({
  network = process.env.NEXT_PUBLIC_NETWORK_ID as string,
  delegate,
}: {
  network: string;
  delegate: SignedDelegate;
}) => {
  const isMainnet = network === 'mainnet';
  const RELAYER_ACCOUNT: string | undefined = isMainnet
    ? process.env.NEXT_PUBLIC_RELAYER_ACCOUNT_ID_NEAR_MAINNET
    : process.env.NEXT_PUBLIC_RELAYER_ACCOUNT_ID_NEAR_TESTNET;

  try {
    const relayerPrivateKey = isMainnet
      ? (process.env.RELAYER_PRIVATE_KEY_NEAR_MAINNET as string)
      : (process.env.RELAYER_PRIVATE_KEY_NEAR_TESTNET as string);

    if (!RELAYER_ACCOUNT || !relayerPrivateKey) {
      throw new Error('Signer details not found in firebase');
    }
    //Instatiate mintbus account that runs transactions
    const relayerAccount = await instatiateAccount(network, RELAYER_ACCOUNT, relayerPrivateKey);

    const result = await relayerAccount.signAndSendTransaction({
      actions: [signedDelegate(delegate)],
      receiverId: delegate.delegateAction.senderId,

    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const getNearAccount = async (
  network: any,
  keyStore: any,
  accountId: string
) => {
  if (!keyStore) {
    console.error('No correct key found for the given account ID.');
    return null;
  }
  const networkConfig = {
    networkId: network,
    nodeUrl: `https://rpc.${network}.near.org`,
    walletUrl: `https://wallet.${network}.near.org`,
    helperUrl: `https://helper.${network}.near.org`,
  };

  const near = new Near({
    ...networkConfig,
    deps: { keyStore },
  });

  return new Account(near.connection, accountId);
};

export const fundAccount = async (accountId: string, network: string) => {
  const isMainnet = network === 'mainnet';
  const RELAYER_ACCOUNT: string | undefined = isMainnet
    ? process.env.NEXT_PUBLIC_RELAYER_ACCOUNT_ID_NEAR_MAINNET
    : process.env.NEXT_PUBLIC_RELAYER_ACCOUNT_ID_NEAR_TESTNET;

  if (!RELAYER_ACCOUNT) {
    throw new Error('Signer details not found in firebase');
  }

  const relayerPrivateKey = isMainnet
    ? (process.env.RELAYER_PRIVATE_KEY_NEAR_MAINNET as string)
    : (process.env.RELAYER_PRIVATE_KEY_NEAR_TESTNET as string);
  if (!RELAYER_ACCOUNT || !relayerPrivateKey) {
    throw new Error('Signer details not found in firebase');
  }

  try {
    const relayerAccount = await instatiateAccount(network, RELAYER_ACCOUNT, relayerPrivateKey);
    const result = await relayerAccount.sendMoney(accountId, new BN('300000000000000000000'));
    return result;
  } catch (error) {
    throw error;
  }


};