import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './images/droplet-logo.svg';

import { initializeContracts, getERC20Balance } from './utils/contractFunctions';
import { addressShortener } from './utils/helperFunctions';

function App() {
  const [ address, setAddress] = useState('');
  const [ shortAddress, setShortAddress] = useState('');
  const [ daiBalance, setDaiBalance ] = useState('');
  const [ ticketBalance, setTicketBalance ] = useState('');
  useEffect(() => {
    loadContractData();
  });

  const loadContractData = async () => { 
    const addresses = await window.ethereum.enable(); 
    const address = addresses[0];
    setAddress(address);
    const shortAd = addressShortener(address);
    setShortAddress(shortAd);
    initializeContracts();
    loadErc20Data(address);
  }

  const loadErc20Data = async (userAddress) => {
    const ticketResult = await getERC20Balance('EHM', userAddress);
    setTicketBalance(ticketResult);
    const daiResult = await getERC20Balance('DAI', userAddress);
    setDaiBalance(daiResult);
  }

  return (
    <div className="App">
      My App:
      {shortAddress}
      <br></br>
      <p>Tickets:</p>{ticketBalance}
      <br></br>
      <p>Dai:</p>{daiBalance}
    </div>
  );
}

export default App;
