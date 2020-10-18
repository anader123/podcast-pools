import ethers from "ethers";
import axios from "axios";

// ABIs
import PodPrizeStratAbi from "./abis/PodPoolStratV2.json";
import PodPrizePoolAbi from "./abis/PrizePool.json";
import IntoEthTokenAbi from "./abis/IntoTheEther.json";
import ERC20Abi from "./abis/ERC20.json";

// Helper Function
import { txHashShortener } from "./helperFunctions";

// Contracts
let strategyContract;
let poolContract;
let IntoEthToken;
let DaiToken;
let TicketToken;

// Contract Addresses (Rinkey);
const PRIZE_STRAT_ADDRESS = "0xDf577189ad9659070D903d1a7A22d0Fb9E07f2f8";
const PRIZE_POOL_ADDRESS = "0x65D16e7C4A7CB9D8Fa2D8Bbe55916FfB6Efe87fD";
const INTO_ETH_TOKEN_ADDRESS = "0x6325764783626E233F5ff4f2D8D1F2bcCD9d6105";
const DAI_TOKEN_ADDRESS = "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea";
const TICKET_TOKEN_ADDRESS = "0x8bEa329655C9809355922Ac70fd4B0E51ce3FBd8";

const REFERRER_ADDRESS = "0xec8b449D4cedcc1BF688EAA40B7dFafd6d2D00DC";

export const initializeContracts = async (providerz) => {
    try {
        const provider = new ethers.providers.Web3Provider(providerz);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        strategyContract = new ethers.Contract(
            PRIZE_STRAT_ADDRESS,
            PodPrizeStratAbi.abi,
            signer
        );
        poolContract = new ethers.Contract(
            PRIZE_POOL_ADDRESS,
            PodPrizePoolAbi.abi,
            signer
        );
        IntoEthToken = new ethers.Contract(
            INTO_ETH_TOKEN_ADDRESS,
            IntoEthTokenAbi.abi,
            signer
        );
        DaiToken = new ethers.Contract(DAI_TOKEN_ADDRESS, ERC20Abi.abi, signer);
        TicketToken = new ethers.Contract(
            TICKET_TOKEN_ADDRESS,
            ERC20Abi.abi,
            signer
        );
        return userAddress;
    } catch (error) {
        throw new Error(`No injected ethereum provider: ${error}`);
    }
};

export const getTotalTicketCount = async () => {
    try {
        const result = await TicketToken.totalSupply();
        return ethers.utils.formatUnits(result, 18);
    } catch (error) {
        console.log(error);
        return "Total Ticket Error";
    }
};

export const getPrizePeriodRemaining = async () => {
    try {
        const totalTimeSeconds = await strategyContract.prizePeriodRemainingSeconds();
        const days = Math.floor(totalTimeSeconds / (3600 * 24));
        const hours = Math.floor(totalTimeSeconds / 3600 - days * 24);
        const minutes = Math.floor(
            totalTimeSeconds / 60 - (days * 24 * 60 + hours * 60)
        );
        return `${days}d ${hours}h ${minutes}m`;
    } catch (error) {
        console.log(error);
        return "Time Remaining Error";
    }
};

export const getCurrentNftPrizes = async () => {
    try {
        const idArray = await strategyContract.getAwardErc721TokenIds(
            INTO_ETH_TOKEN_ADDRESS
        );
        if (idArray.length === 0)
            return {
                name: "New Prize Comming Soon",
                description: "",
                attributes: [
                    { trait_type: "Date", value: "" },
                    { trait_type: "Duration", value: "" },
                ],
            };
        let ipfsHash = await IntoEthToken.tokenURI(idArray[0]);
        ipfsHash = ipfsHash.slice(12); // remove the url from the hash
        const result = await axios.get(
            `https://ipfs.infura.io/ipfs/${ipfsHash}`
        );
        return result.data;
    } catch (error) {
        console.log(error);
    }
};

export const getERC20Balance = async (type, userAddress) => {
    let tokenContract;
    if (type === undefined || userAddress === undefined) {
        console.log("Invalid type or address provided");
    }
    type === "DAI" ? (tokenContract = DaiToken) : (tokenContract = TicketToken);
    try {
        const weiBalance = await tokenContract.balanceOf(userAddress);
        const formattedBal = ethers.utils.formatUnits(weiBalance, 18);
        const roundedBal = parseFloat(formattedBal).toFixed(2);
        return roundedBal;
    } catch (error) {
        console.log(error);
        return `Balance Error for ${type}`;
    }
};

export const getERC20Allowance = async (type, userAddress) => {
    let tokenContract;
    if (type === undefined || userAddress === undefined) {
        console.log("Invalid type or address provided");
    }
    if (type === "DAI") tokenContract = DaiToken;
    else if (type === "EHM") tokenContract = TicketToken;
    else return window.alert("Error Invalid Token Type");

    try {
        const weiBalance = await tokenContract.allowance(
            userAddress,
            PRIZE_POOL_ADDRESS
        );
        const formattedBal = ethers.utils.formatUnits(weiBalance, 18);
        const roundedBal = parseFloat(formattedBal).toFixed(2);
        return roundedBal;
    } catch (error) {
        console.log(error);
        return `Balance Error for ${type}`;
    }
};

export const approveToken = async (type, setScene) => {
    let tokenContract;
    if (type === undefined) {
        console.log("Invalid type");
    }

    if (type === "DAI") tokenContract = DaiToken;
    else if (type === "EHM") tokenContract = TicketToken;
    else return window.alert("Error Invalid Token Type");

    try {
        console.log(DaiToken);
        const weiValue = ethers.utils.parseUnits("1000000", 18);
        const approveTx = await tokenContract.approve(
            PRIZE_POOL_ADDRESS,
            weiValue
        );
        setScene(1);
        await approveTx.wait();
    } catch (error) {
        console.log(error);
        window.alert("Erorr granting allowance");
    }
};

export const depositDaiToPool = async (
    userAddress,
    value,
    setScene,
    setTxHash,
    setShortTxHash,
    loadErc20Data
) => {
    try {
        const weiValue = ethers.utils.parseUnits(value, 18);
        const depositTx = await poolContract.depositTo(
            userAddress,
            weiValue,
            TICKET_TOKEN_ADDRESS,
            REFERRER_ADDRESS
        );
        setTxHash(depositTx.hash);
        const shortTxHash = txHashShortener(depositTx.hash);
        setShortTxHash(shortTxHash);
        setScene(2);
        await depositTx.wait();
        setScene(3);
        setTimeout(loadErc20Data(userAddress), 5000); // give time to wait for tx to settle
    } catch (error) {
        console.log(error);
        window.alert("There was an error depositing the Dai");
    }
};

export const withdrawDaiFromPool = async (
    userAddress,
    value,
    setScene,
    setTxHash,
    setShortTxHash,
    loadErc20Data
) => {
    try {
        const weiValue = ethers.utils.parseUnits(value, 18);

        //Max fee that the user is willing to pay if withdraw early
        const maxFee = (+value * 0.1).toString();
        const weiMaxFee = ethers.utils.parseUnits(maxFee, 18);
        const withdrawTx = await poolContract.withdrawInstantlyFrom(
            userAddress,
            weiValue,
            TICKET_TOKEN_ADDRESS,
            weiMaxFee
        );
        setTxHash(withdrawTx.hash);
        const shortTxHash = txHashShortener(withdrawTx.hash);
        setShortTxHash(shortTxHash);
        setScene(2);
        await withdrawTx.wait();
        setScene(3);
        setTimeout(loadErc20Data(userAddress), 5000); // give time to wait for tx to settle
    } catch (error) {
        console.log(error);
        window.alert("There was an error withdrawing the Dai");
    }
};
