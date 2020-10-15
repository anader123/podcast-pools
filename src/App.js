import React, { useState } from "react";
import "./App.scss";
import logo from "./images/droplet-logo.svg";
import ethLogo from "./images/eth-diamond-rainbow.png";
import ethHubLogo from "./images/ethHubLogo.png";

import Modal from "./components/Modal/DepositModal";

import {
    initializeContracts,
    getERC20Balance,
    getPrizePeriodRemaining,
    getTotalTicketCount,
    getCurrentNftPrizes,
    getERC20Allowance,
} from "./utils/contractFunctions";
import { addressShortener } from "./utils/helperFunctions";

function App() {
    const [address, setAddress] = useState("");
    const [shortAddress, setShortAddress] = useState("");
    const [walletConnected, setWalletConnected] = useState(false);

    const [daiBalance, setDaiBalance] = useState("0");
    const [ticketBalance, setTicketBalance] = useState("0");
    const [daiAllowance, setDaiAllowance] = useState("0");
    const [ticketAllowance, setTicketAllowance] = useState("0");

    const [totalSupply, setTotalSupply] = useState("0");
    const [timeRemaining, setTimeRemaining] = useState("0");
    const [episodeData, setEpidsodeData] = useState({
        name: "Loading...",
        description: "",
        attributes: [
            { trait_type: "Date", value: "" },
            { trait_type: "Duration", value: "" },
        ],
    });
    const [modalState, setModalState] = useState(false);
    const [scene, setScene] = useState(3);

    const loadContractData = async () => {
        if (window.ethereum.networkVersion !== "4")
            return window.alert("Please change to Rinkeby");
        const addresses = await window.ethereum.enable();
        const userAddress = addresses[0];
        const shortAd = addressShortener(userAddress);
        await initializeContracts();
        const newTimeRemaining = await getPrizePeriodRemaining();
        loadErc20Data(userAddress);
        await loadNftData();

        setTimeRemaining(newTimeRemaining);
        setShortAddress(shortAd);
        setAddress(userAddress);
        setWalletConnected(true);
    };

    const loadErc20Data = async (userAddress) => {
        const ticketBalanceResult = await getERC20Balance("EHM", userAddress);
        const daiBalanceResult = await getERC20Balance("DAI", userAddress);
        const ticketAllowanceResult = await getERC20Allowance(
            "EHM",
            userAddress
        );
        const daiAllowanceResult = await getERC20Allowance("DAI", userAddress);
        const newTotalSupply = await getTotalTicketCount();

        setTotalSupply(newTotalSupply);
        setTicketBalance(ticketBalanceResult);
        setTicketAllowance(ticketAllowanceResult);
        setDaiAllowance(daiAllowanceResult);
        setDaiBalance(daiBalanceResult);
    };

    const loadNftData = async () => {
        const newEpisodeData = await getCurrentNftPrizes();
        setEpidsodeData(newEpisodeData);
    };

    const openDepositModal = () => {
        if (+daiAllowance > 0) {
            setScene(1);
        }
        setModalState(true);
    };

    const closeModal = () => {
        setScene(0);
        setModalState(false);
    };

    return (
        <div className="App">
            <Modal
                modalState={modalState}
                daiBalance={daiBalance}
                closeModal={closeModal}
                scene={scene}
                setScene={setScene}
                userAddress={address}
                loadErc20Data={loadErc20Data}
            />
            <div className="App__header">
                <div className="logo-container">
                    <img src={logo} alt="drop-logo" />
                    <h4>Podcast Pools</h4>
                </div>
                <a
                    className="shortened-address"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://rinkeby.etherscan.io/address/${address}`}
                >
                    {shortAddress}
                </a>
            </div>
            <div className="App__dashboard">
                <div
                    className={
                        walletConnected
                            ? "top-info"
                            : "top-info top-info--lengthen"
                    }
                >
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
                            {walletConnected ? (
                                <div className="btn-container">
                                    <button
                                        className="blue-btn"
                                        onClick={openDepositModal}
                                    >
                                        Deposit
                                    </button>
                                    <button className="gray-btn">
                                        Withdraw
                                    </button>
                                </div>
                            ) : (
                                <div className="connect-wallet-container">
                                    <p>
                                        Deposit DAI for a chance to win{" "}
                                        <span role="img" aria-label="surprise">
                                            🎉
                                        </span>
                                    </p>
                                    <button
                                        className="blue-btn"
                                        onClick={loadContractData}
                                    >
                                        Connect Wallet
                                    </button>
                                </div>
                            )}
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
                {walletConnected ? (
                    <div>
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
                                        <h5>{episodeData.name}</h5>
                                        <p className="episode-info">
                                            {episodeData.description}
                                        </p>
                                        <p className="attribute">
                                            {`Release Date: ${episodeData.attributes[0].value}`}
                                        </p>
                                        <p className="attribute">
                                            {`Duration: ${episodeData.attributes[1].value}`}
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
                                        <span
                                            role="img"
                                            aria-label="money-wings"
                                        >
                                            💸
                                        </span>
                                    </h6>
                                    <p>{daiBalance} DAI</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
            <div
                className={
                    walletConnected ? "App__footer" : "App__footer--white"
                }
            ></div>
        </div>
    );
}

export default App;
