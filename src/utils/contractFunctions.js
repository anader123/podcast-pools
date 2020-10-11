import Web3 from 'web3';
import axios from 'axios';

// ABIs
import PodPrizeStratAbi from './abis/PodPoolStratV2.json';
import PodPrizePoolAbi from './abis/PrizePool.json';
import IntoEthTokenAbi from './abis/IntoTheEther.json';
import ERC20Abi from './abis/ERC20.json';

let web3; 

// Contracts
let strategyContract;
let poolContract;
let IntoEthToken;
let DaiToken;
let TicketToken;

// Contract Addresses (Rinkey);
const PRIZE_STRAT_ADDRESS = '0xDf577189ad9659070D903d1a7A22d0Fb9E07f2f8';
const PRIZE_POOL_ADDRESS = '0x65D16e7C4A7CB9D8Fa2D8Bbe55916FfB6Efe87fD';
const INTO_ETH_TOKEN_ADDRESS = '0x6325764783626E233F5ff4f2D8D1F2bcCD9d6105';
const DAI_TOKEN_ADDRESS = '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea';
const TICKET_TOKEN_ADDRESS = '0x8bEa329655C9809355922Ac70fd4B0E51ce3FBd8';


export const initializeWeb3 = () => {
    try {
        const provider =  window.web3.currentProvider;
        web3 = new Web3(provider);
        strategyContract = new web3.eth.Contract(PodPrizeStratAbi.abi, PRIZE_STRAT_ADDRESS);
        poolContract = new web3.eth.Contract(PodPrizePoolAbi.abi, PRIZE_POOL_ADDRESS);
        IntoEthToken = new web3.eth.Contract(IntoEthTokenAbi.abi, INTO_ETH_TOKEN_ADDRESS);
        DaiToken = new web3.eth.Contract(ERC20Abi.abi, DAI_TOKEN_ADDRESS);
        TicketToken = new web3.eth.Contract(ERC20Abi.abi, TICKET_TOKEN_ADDRESS);
    } catch (error) {
        throw new Error(`No inject web3: ${err}`);
    }
}

export const checkERC721Prize = async() => {
    const result = await strategyContract.methods.getAwardErc721TokenIds(INTO_ETHER_TOKEN_ADDRESS).call();
    return result;
}

export const getTotalTicketCount = async () => {
    const result = TicketToken.methods.totalSupply().call();
    return web3.eth.fromWei(result);
}

export const getPrizePeriodRemaining = async () => {
    const totalTimeSeconds = await strategyContract.methods.prizePeriodRemainingSeconds().call();
    const days = Math.floor(totalTimeSeconds / (3600*24));
    const hours = Math.floor((totalTimeSeconds/3600)-(days*24));
    const minutes = Math.floor((totalTimeSeconds/60) - (days*24*60 + hours*60));
    return`${days}D ${hours}H ${minutes}M`;
}

export const getERC20Balance = async (type, userAddress) => {
    if(type === undefined || userAddress === undefined) return console.log('Invalid type or address provided');
    try {
        if(type === "DAI") return web3.utils.fromWei(await DaiToken.methods.balanceOf(userAddress).call());
        return web3.utils.fromWei(await TicketToken.methods.balanceOf(userAddress).call());
    } catch (error) {
        console.log(error);
    }
}

export const getCurrentNftPrizes = async () => {
    const ipfsHashArray = [];
    const idArray = await strategyContract.methods.getAwardErc721TokenIds(INTO_ETHER_TOKEN_ADDRESS).call();
    idArray.forEach(NftId => {
        let ipfsHash = await IntoEthToken.methods.tokenURI(NftId);
        ipfsHashArray = ipfsHash.slice(12);
        ipfsHashArray.push(ipfsHash);
    })
    return ipfsHashArray
}

export const depositDaiToPool = async () => {

}

export const withdrawDaiFromPool = async () => {

}

