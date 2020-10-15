import React, { useState } from "react";
import "./Modal.scss";
import X from "../../images/x.svg";

export default function Modal(props) {
    const { daiBalance, setModalState, modalState } = props;
    const [scene, setScene] = useState(3);

    const closeModal = () => {
        setScene(0);
        setModalState(false);
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
                                Approve Tickets{" "}
                                <span role="img" aria-label="check-mark">
                                    ✅
                                </span>
                            </p>
                            <div className="white-line"></div>
                        </div>
                        <div className="footer">
                            <button onClick={() => setScene(1)}>Confirm</button>
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
                                Deposit Tickets{" "}
                                <span role="img" aria-label="fire">
                                    🔥
                                </span>
                            </p>
                            <div className="white-line"></div>
                        </div>
                        <div className="body">
                            <input placeholder="Amount"></input>
                            <p>Balance: {daiBalance} EHM</p>
                        </div>
                        <div className="footer">
                            <button onClick={() => setScene(2)}>Confirm</button>
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
                        <div className="footer">
                            <button onClick={() => setScene(3)}>Confirm</button>
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
                        <div className="footer"></div>
                    </div>
                </div>
            );
            break;

        default:
            break;
    }
}
