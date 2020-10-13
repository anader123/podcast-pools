import React, { useEffect, useState } from "react";
import "./App.scss";
import logo from "./images/droplet-logo.svg";
import ethLogo from "./images/eth-diamond-rainbow.png";
import ethHubLogo from "./images/ethHubLogo.png";

import {
    initializeContracts,
    getERC20Balance,
} from "./utils/contractFunctions";
import { addressShortener } from "./utils/helperFunctions";

function App() {
    const [address, setAddress] = useState("");
    const [shortAddress, setShortAddress] = useState("");
    const [daiBalance, setDaiBalance] = useState("");
    const [ticketBalance, setTicketBalance] = useState("");
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
    };

    const loadErc20Data = async (userAddress) => {
        const ticketResult = await getERC20Balance("EHM", userAddress);
        setTicketBalance(ticketResult);
        const daiResult = await getERC20Balance("DAI", userAddress);
        setDaiBalance(daiResult);
    };

    return (
        <div className="App">
            <div className="App__header">
                <div className="logo-container">
                    <img src={logo} alt="drop-logo" />
                    <h4>Podcast Pools</h4>
                </div>
                <h6 className="shortened-address">0xA34...34ca3</h6>
            </div>
            <div className="App__dashboard">
                <div className="top-info">
                    <div className="text">
                        <h2>Into the Ether</h2>
                        <p className="description-sentence">
                            A podcast focusing on all things Ethereum and DeFi.
                        </p>
                        <p className="description-paragraph">
                            This podcast features in-depth discussions with
                            prominent guests in the space hosted by Eric Conner
                            as well as weekly news recaps featuring Anthony
                            Sassano.
                        </p>
                        <img src={ethLogo} alt="ethLogo" />
                        <div className="btn-container">
                            <button className="blue-btn">Deposit</button>
                            <button className="gray-btn">Withdraw</button>
                        </div>
                    </div>
                    {/* <div>
                        <img src={ethLogo} alt="ethLogo" />
                    </div> */}
                </div>
                <div className="middle-info">
                    <div className="middle-block__text">
                        <h3>
                            Current Prize{" "}
                            <span role="img" aria-label="trophy">
                                🏆
                            </span>
                        </h3>
                        <div>
                            <img
                                className="ethhub-logo"
                                src={ethHubLogo}
                                alt="ethHubLogo"
                            />
                            <h5>EthHub Weekly #133</h5>
                            <p className="episode-info">
                                Kucoin Hacked for $150mn, State of EIP-1559,
                                eth2 Spardina launch, Optimism launches testnet,
                                Blocknative's mempool explorer and exploring the
                                Ethereum mempool.
                            </p>
                            <p>Date: Tue, 08 Sep 2020</p>
                            <p>Episode Duration: 49:28</p>
                        </div>
                    </div>
                </div>
                <div className="bottom-info"></div>
            </div>
            <div className="App__footer"></div>
        </div>
    );
}

export default App;
