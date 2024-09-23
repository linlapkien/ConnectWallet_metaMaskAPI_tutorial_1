import type { NextPage } from 'next';
import { useEffect } from 'react';
import Wallet from '../components/Wallet';
import { useListen } from '../hooks/useListen';
import { useMetamask } from '../hooks/useMetamask';

const Home: NextPage = () => {
  const { dispatch } = useMetamask();
  const listen = useListen();

  useEffect(() => {
    if (typeof window !== undefined) {
      // start by checking if window.ethereum is present, indicating a wallet extension
      const ethereumProviderInjected = typeof window.ethereum !== 'undefined';
      // this could be other wallets so we can verify if we are dealing with metamask
      // using the boolean constructor to be explecit and not let this be used as a falsy value (optional)
      const isMetamaskInstalled =
        ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

      // Retrieve the saved MetaMask state from localStorage
      const local = window.localStorage.getItem('metamaskState');

      // If user was previously connected, start listening to MetaMask events
      if (local) {
        listen();
      }

      // If local storage exists, parse wallet and balance, otherwise set to null
      const { wallet, balance } = local
        ? JSON.parse(local)
        : // backup if local storage is empty
          { wallet: null, balance: null };

      // Dispatch an action indicating the page has loaded, MetaMask's installation status,
      // and any saved wallet/balance data from local storage
      dispatch({ type: 'pageLoaded', isMetamaskInstalled, wallet, balance });
    }
  }, []);

  return (
    <>
      <Wallet />
    </>
  );
};

export default Home;
