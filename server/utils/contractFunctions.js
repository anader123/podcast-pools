const IntoTheEther = require('../abis/IntoTheEther.json');
const PodPoolStrat = require('../abis/PodPoolStratV2.json');
const PrizePool = require('../abis/PrizePool.json');
const ethers = require('ethers');

// .env Variables
const {
    WEB3_PROVIDER,
    MINT_PRIV_KEY
} = process.env;

// Contract Addresses (Rinkey);
const PRIZE_STRAT_ADDRESS = '0xDf577189ad9659070D903d1a7A22d0Fb9E07f2f8';
const PRIZE_POOL_ADDRESS = '0x65D16e7C4A7CB9D8Fa2D8Bbe55916FfB6Efe87fD';
const INTO_ETH_TOKEN_ADDRESS = '0x6325764783626E233F5ff4f2D8D1F2bcCD9d6105';

// Ethers Setup
const provider = new ethers.providers.JsonRpcProvider(WEB3_PROVIDER);
const wallet = new ethers.Wallet(MINT_PRIV_KEY, provider);

// Contract Instances 
const intoEtherTokenContract = new ethers.Contract(INTO_ETH_TOKEN_ADDRESS, IntoTheEther.abi, wallet);
const strategyContract = new ethers.Contract(PRIZE_STRAT_ADDRESS, PodPoolStrat.abi, wallet);
const prizePoolContract = new ethers.Contract(PRIZE_POOL_ADDRESS, PrizePool.abi, wallet);

const mintToken = async (ipfsHash) => {
    try{
        const resultTx = await intoEtherTokenContract.mintEpisode(PRIZE_POOL_ADDRESS, ipfsHash);
        await resultTx.wait();
        return resultTx.hash;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getRecentTokenHash = async() => {
    try {
        const tokenCount = await intoEtherTokenContract.totalSupply();
        const result = await intoEtherTokenContract.tokenURI(tokenCount);
        const ipfsHash = result.slice(12); //return value is formatted as ipfs://ipfs/[hash]
        console.log(ipfsHash);
        return ipfsHash;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const addERC721ToPrizePool = async () => {
    try {
        const tokenId = await intoEtherTokenContract.totalSupply(); //
        const tokenIdAr = [+tokenId];
        const addTx = await strategyContract.addExternalErc721Award(INTO_ETH_TOKEN_ADDRESS, tokenIdAr);
        await addTx.wait();
        return addTx.hash;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const startAndAwardPrize = async () => {
    try {
        const canStart = await strategyContract.canStartAward();
        console.log('CanStart:', canStart);
        if(!canStart) return;
        const startTx = await strategyContract.startAward();
        await startTx.wait();
        console.log(`Starting award process. TxHash: ${startTx.hash}`);
        const completeTx = await strategyContract.completeAward();
        await completeTx.wait();
        console.log(`Completing award process. TxHash: ${completeTx.hash}`);
    } catch (error) {
        console.log('Error ocurred when trying to award the prize', error);
    }
}

module.exports = {
    getRecentTokenHash, 
    mintToken, 
    addERC721ToPrizePool, 
    startAndAwardPrize
};