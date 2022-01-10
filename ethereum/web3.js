import Web3 from 'web3';

let web3;
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
//we are in browser and Metamask is running
  web3 = new Web3(window.ethereum);
}
else {
//we are on the server OR user not running Metamask
  const provider = new Web3.providers.WebsocketProvider(
  'wss://speedy-nodes-nyc.moralis.io/93813387eb21013f8a586a4a/bsc/testnet/ws'
  );
  web3 = new Web3(provider);
}
const isConnected = async () => {
  if (window.ethereum) {
    await window.ethereum.send('eth_requestAccounts');
    web3 = new Web3(window.ethereum);
    return true;
  }
  return false;
}

export {isConnected, web3};
