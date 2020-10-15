import React, { useState } from "react";
import "./Modal.scss";

// Images
import X from "../../images/x.svg";
import approveImage from "../../images/approve-contract.svg";
import clock from "../../images/clock.svg";
import check from "../../images/check-mark.svg";

import { approveToken, depositDaiToPool } from "../../utils/contractFunctions";

export default function Modal(props) {
    const {
        daiBalance,
        modalState,
        closeModal,
        scene,
        setScene,
        userAddress,
        loadErc20Data,
    } = props;
    const [txHash, setTxHash] = useState("0xcccc222cf1faaa1111111111122222");
    const [shortTxHash, setShortTxHash] = useState("0x43a...32B");
    const [depositAmount, setDepositAmount] = useState("0");

    const confirmApproveDai = () => {
        approveToken("DAI", setScene);
    };

    const handleChange = (e) => {
        let value = e.target.value;
        value.toString();
        setDepositAmount(value);
    };

    const confirmDepositDai = async () => {
        await depositDaiToPool(
            userAddress,
            depositAmount,
            setScene,
            setTxHash,
            setShortTxHash
        );
        loadErc20Data(userAddress);
    };

    if (!modalState) return null;

    switch (scene) {
        case 0:
            return (
                <div className="modal-wrapper">
                    <div className="modal">
                        <button className="exit-btn" onClick={closeModal}>
                            <img src={X} alt="x" />
                        </button>
                        <div className="header">
                            <p>
                                Approve Dai{" "}
                                <span role="img" aria-label="check-mark">
                                    ✅
                                </span>
                            </p>
                            <div className="white-line"></div>
                        </div>
                        <div className="body">
                            <img src={approveImage} alt="unlock" />
                        </div>
                        <div className="footer">
                            <button onClick={confirmApproveDai}>Confirm</button>
                        </div>
                    </div>
                </div>
            );

        case 1:
            return (
                <div className="modal-wrapper">
                    <div className="modal">
                        <button className="exit-btn" onClick={closeModal}>
                            <img src={X} alt="x" />
                        </button>
                        <div className="header">
                            <p>
                                Deposit Dai{" "}
                                <span role="img" aria-label="fire">
                                    🔥
                                </span>
                            </p>
                            <div className="white-line"></div>
                        </div>
                        <div className="body">
                            <input
                                placeholder="Amount"
                                type="number"
                                onChange={handleChange}
                            ></input>
                            <p>Balance: {daiBalance} DAI</p>
                        </div>
                        <div className="footer">
                            <button onClick={confirmDepositDai}>Confirm</button>
                        </div>
                    </div>
                </div>
            );

        case 2:
            return (
                <div className="modal-wrapper">
                    <div className="modal">
                        <button className="exit-btn" onClick={closeModal}>
                            <img src={X} alt="x" />
                        </button>
                        <div className="header">
                            <p>
                                Tx Submitted{" "}
                                <span role="img" aria-label="hour-glass">
                                    ⏳
                                </span>
                            </p>
                            <div className="white-line"></div>
                        </div>
                        <div className="body">
                            <p>Waiting for Confirmations</p>
                            <img src={clock} alt="unlock" />
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={`https://rinkeby.etherscan.io/tx/${txHash}`}
                            >
                                Tx Hash:{shortTxHash}{" "}
                                <span role="img" aria-label="link">
                                    🔗
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            );

        case 3:
            return (
                <div className="modal-wrapper">
                    <div className="modal">
                        <button className="exit-btn" onClick={closeModal}>
                            <img src={X} alt="x" />
                        </button>
                        <div className="header">
                            <p>
                                Deposit Successful{" "}
                                <span role="img" aria-label="confetti">
                                    🎊
                                </span>
                            </p>
                            <div className="white-line"></div>
                        </div>
                        <div className="body">
                            <img src={check} alt="unlock" />
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={`https://rinkeby.etherscan.io/tx/${txHash}`}
                            >
                                Tx Hash: {shortTxHash}{" "}
                                <span role="img" aria-label="link">
                                    🔗
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            );

        default:
            break;
    }
}
