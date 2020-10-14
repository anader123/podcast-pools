import React, { useEffect, useState } from "react";
import "./App.scss";
import logo from "./images/droplet-logo.svg";
import ethLogo from "./images/eth-diamond-rainbow.png";
import ethHubLogo from "./images/ethHubLogo.png";

import {
    initializeContracts,
    getERC20Balance,
    getPrizePeriodRemaining,
    getTotalTicketCount,
} from "./utils/contractFunctions";
import { addressShortener } from "./utils/helperFunctions";

function App() {
    const [address, setAddress] = useState("");
    const [shortAddress, setShortAddress] = useState("");
    const [daiBalance, setDaiBalance] = useState("0");
    const [ticketBalance, setTicketBalance] = useState("0");
    const [totalSupply, setTotalSupply] = useState("0");
    const [timeRemaining, setTimeRemaining] = useState("0");

    useEffect(() => {
        loadContractData();
    });

    const loadContractData = async () => {
        if (window.ethereum.networkVersion !== "4")
            return window.alert("Please change to Rinkeby");
        const addresses = await window.ethereum.enable();
        const userAddress = addresses[0];
        const shortAd = addressShortener(userAddress);
        await initializeContracts();
        const newTimeRemaining = await getPrizePeriodRemaining();
        loadErc20Data(userAddress);

        setTimeRemaining(newTimeRemaining);
        setShortAddress(shortAd);
        setAddress(userAddress);
    };

    const loadErc20Data = async (userAddress) => {
        const ticketResult = await getERC20Balance("EHM", userAddress);
        const daiResult = await getERC20Balance("DAI", userAddress);
        const newTotalSupply = await getTotalTicketCount();

        setTotalSupply(newTotalSupply);
        setTicketBalance(ticketResult);
        setDaiBalance(daiResult);
    };

    return (
        <div className="App">
            <div className="App__header">
                <div className="logo-container">
                    <img src={logo} alt="drop-logo" />
                    <h4>Podcast Pools</h4>
                </div>
                <h6 className="shortened-address">{shortAddress}</h6>
            </div>
            <div className="App__dashboard">
                <div className="top-info">
                    <div className="text--background-color">
                        <div className="text">
                            <h2>Into the Ether</h2>
                            <p className="description-sentence">
                                A podcast focusing on all things Ethereum and
                                DeFi.
                            </p>
                            <p className="description-paragraph">
                                This podcast features in-depth discussions with
                                prominent guests in the space hosted by Eric
                                Conner as well as weekly news recaps featuring
                                Anthony Sassano.
                            </p>
                            <img
                                className="eth-logo--mobile"
                                src={ethLogo}
                                alt="ethLogo"
                            />
                            <div className="btn-container">
                                <button className="blue-btn">Deposit</button>
                                <button className="gray-btn">Withdraw</button>
                            </div>
                        </div>
                        <div className="eth-logo__container">
                            <img
                                className="eth-logo--desktop"
                                src={ethLogo}
                                alt="ethLogo"
                            />
                        </div>
                    </div>
                </div>
                <div className="middle-info">
                    <div className="middle-block__text">
                        <h3>
                            Current Prize{" "}
                            <span role="img" aria-label="trophy">
                                🏆
                            </span>
                        </h3>
                        <div className="prizes">
                            <img
                                className="ethhub-logo"
                                src={ethHubLogo}
                                alt="ethHubLogo"
                            />
                            <div className="prizes__text">
                                <h5>EthHub Weekly #133</h5>
                                <p className="episode-info">
                                    Kucoin Hacked for $150mn, State of EIP-1559,
                                    eth2 Spardina launch, Optimism launches
                                    testnet, Blocknative's mempool explorer and
                                    exploring the Ethereum mempool.
                                </p>
                                <p className="attribute">
                                    Date: Tue, 08 Sep 2020
                                </p>
                                <p className="attribute">
                                    Episode Duration: 49:28
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom-info">
                    <div className="main-text-container">
                        <div className="sub-text-container">
                            <h6>
                                Total Tickets{" "}
                                <span role="img" aria-label="ticket">
                                    🎟
                                </span>
                            </h6>
                            <p>{totalSupply} EHM</p>
                        </div>
                        <div className="sub-text-container">
                            <h6>
                                Your Ticket Balance{" "}
                                <span role="img" aria-label="balance">
                                    ⚖️
                                </span>
                            </h6>
                            <p>{ticketBalance} EHM</p>
                        </div>
                    </div>
                    <div className="main-text-container ">
                        <div className="sub-text-container">
                            <h6>
                                Ending In{" "}
                                <span role="img" aria-label="clock">
                                    🕒
                                </span>
                            </h6>
                            <p>{timeRemaining}</p>
                        </div>
                        <div className="sub-text-container">
                            <h6>
                                Your Dai Balance{" "}
                                <span role="img" aria-label="money-wings">
                                    💸
                                </span>
                            </h6>
                            <p>{daiBalance} DAI</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="App__footer"></div>
        </div>
    );
}

export default App;
