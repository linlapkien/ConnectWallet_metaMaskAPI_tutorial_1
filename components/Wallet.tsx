import Link from 'next/link';
import { useListen } from '../hooks/useListen';
import { useMetamask } from '../hooks/useMetamask';
import { Loading } from './Loading';

export default function Wallet() {
  // The useMetamask hook returns the current state and dispatch function from the MetaMask context.
  const {
    dispatch,
    state: { status, isMetamaskInstalled, wallet, balance },
  } = useMetamask();
  const listen = useListen();

  // This checks whether MetaMask is not installed, but the page is loaded. If true, it will show a button to install MetaMask.
  const showInstallMetamask =
    status !== 'pageNotLoaded' && !isMetamaskInstalled;
  // Checks if MetaMask is installed but no wallet is connected, allowing the "Connect Wallet" button to be shown.
  const showConnectButton =
    status !== 'pageNotLoaded' && isMetamaskInstalled && !wallet;

  const isConnected = status !== 'pageNotLoaded' && typeof wallet === 'string';

  // This function is called when the user clicks the "Connect Wallet" button.
  const handleConnect = async () => {
    // First, it dispatches a "loading" action to indicate the app is in a loading state.
    dispatch({ type: 'loading' });
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (accounts.length > 0) {
      const balance = await window.ethereum!.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      });
      dispatch({ type: 'connect', wallet: accounts[0], balance });

      // we can register an event listener for detect changes in the wallet (e.g., switching accounts).
      listen();
    }
  };

  // function dispatches a "disconnect" action
  const handleDisconnect = () => {
    dispatch({ type: 'disconnect' });
  };

  // This function allows the user to add the USDC token to their MetaMask wallet.
  const handleAddUsdc = async () => {
    dispatch({ type: 'loading' });

    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: '0xaefe58f94663f70a1554028dced54d3355a4beda',
          symbol: 'USDC',
          decimals: 18,
          image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=023',
        },
      },
    });
    // After the token is added, it dispatches an "idle" action to update the state back to idle.
    dispatch({ type: 'idle' });
  };

  return (
    <div className="bg-truffle">
      <div className="mx-auto max-w-2xl py-16 px-4 text-center sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          <span className="block">Metamask API intro</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-white">
          Follow along with the{' '}
          <Link
            href="https://github.com/GuiBibeau/web3-unleashed-demo"
            target="_blank"
          >
            <span className="underline cursor-pointer">Repo</span>
          </Link>{' '}
          in order to learn how to use the Metamask API.
        </p>

        {/* If the wallet and balance are available, it shows the connected wallet's address and balance in ETH. */}
        {wallet && balance && (
          <div className=" px-4 py-5 sm:px-6">
            <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-4">
                <div className="flex items-center">
                  <div className="ml-4">
                    <h3 className="text-lg font-medium leading-6 text-white">
                      Address: <span>{wallet}</span>
                    </h3>
                    <p className="text-sm text-white">
                      Balance:{' '}
                      <span>
                        {(parseInt(balance) / 1000000000000000000).toFixed(4)}{' '}
                        ETH
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* If MetaMask is installed but the wallet is not connected, it shows a "Connect Wallet" button. */}
        {showConnectButton && (
          <button
            onClick={handleConnect}
            className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache text-white px-5 py-3 text-base font-medium  sm:w-auto"
          >
            {status === 'loading' ? <Loading /> : 'Connect Wallet'}
          </button>
        )}

        {/* If MetaMask is not installed, it shows an "Install Metamask" button. */}
        {showInstallMetamask && (
          <Link
            href="https://metamask.io/"
            target="_blank"
            className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache text-white px-5 py-3 text-base font-medium  sm:w-auto"
          >
            Install Metamask
          </Link>
        )}

        {/* If a wallet is connected, it shows two buttons: one to add the USDC token to MetaMask and one to disconnect the wallet. */}
        {isConnected && (
          <div className="flex  w-full justify-center space-x-2">
            <button
              onClick={handleAddUsdc}
              className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache text-white px-5 py-3 text-base font-medium  sm:w-auto"
            >
              {status === 'loading' ? <Loading /> : 'Add Token'}
            </button>
            <button
              onClick={handleDisconnect}
              className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache text-white px-5 py-3 text-base font-medium  sm:w-auto"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
