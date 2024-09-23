import { useMetamask } from './useMetamask';

export const useListen = () => {
  const { dispatch } = useMetamask();

  return () => {
    // newAccounts: This array contains the new accounts. If the user is still connected, this array will have one or more addresses; if the user disconnects, the array will be empty.
    window.ethereum.on('accountsChanged', async (newAccounts: string[]) => {
      if (newAccounts.length > 0) {
        // uppon receiving a new wallet, we'll request again the balance to synchronize the UI.
        // Wallet is connected, fetch balance
        const newBalance = await window.ethereum!.request({
          method: 'eth_getBalance',
          params: [newAccounts[0], 'latest'],
        });

        dispatch({
          type: 'connect',
          wallet: newAccounts[0],
          balance: newBalance,
        });
      } else {
        // if the length is 0, then the user has disconnected from the wallet UI
        dispatch({ type: 'disconnect' });
      }
    });
  };
};
