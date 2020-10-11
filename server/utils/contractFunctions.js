const IntoTheEther = require('../abis/IntoTheEther.json');
const PodPoolStrat = require('../abis/PodPoolStratV2.json');
const PrizePool = require('../abis/PrizePool.json');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');

// .env Variables
const {
    WEB3_PROVIDER,
    MINT_ADDRESS,
    INTO_ETHER_TOKEN_ADDRESS,
    MNEMONIC_PHRASE,
    PODCAST_STRAT_ADDRESS,
    POOL_ADDRESS
} = process.env;

// @truffle/hdwallet-provider Setup
let provider = new HDWalletProvider({
    mnemonic: {
      phrase: MNEMONIC_PHRASE
    },
    providerOrUrl: WEB3_PROVIDER
  });

// Web3 Setup
const web3 = new Web3(provider);
const intoEtherTokenContract = new web3.eth.Contract(IntoTheEther.abi, INTO_ETHER_TOKEN_ADDRESS);
const strategyContract = new web3.eth.Contract(PodPoolStrat.abi, PODCAST_STRAT_ADDRESS);
const prizePoolContract = new web3.eth.Contract(PrizePool.abi, POOL_ADDRESS);

const mintToken = async (ipfsHash) => {
    try{
        const result = await intoEtherTokenContract.methods.mintEpisode(POOL_ADDRESS, ipfsHash).send({from: MINT_ADDRESS});
        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getRecentTokenHash = async() => {
    try {
        const tokenCount = await intoEtherTokenContract.methods.totalSupply().call();
        const result = await intoEtherTokenContract.methods.tokenURI(tokenCount).call();
        const ipfsHash = result.slice(12); //return value is formatted as ipfs://ipfs/[hash]
        return ipfsHash;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getPrizePeriodRemaining = async () => {
    const totalTimeSeconds = await strategyContract.methods.prizePeriodRemainingSeconds().call();
    const days = Math.floor(totalTimeSeconds / (3600*24));
    const hours = Math.floor((totalTimeSeconds/3600)-(days*24));
    const minutes = Math.floor((totalTimeSeconds/60) - (days*24*60 + hours*60));
    console.log(`${days}D ${hours}H ${minutes}M`);
}

const addERC721ToPrizePool = async () => {
    try {
        const tokenId = await intoEtherTokenContract.methods.totalSupply().call(); //
        const tokenIdAr = [+tokenId];
        const result = await strategyContract.methods.addExternalErc721Award(INTO_ETHER_TOKEN_ADDRESS, tokenIdAr).send({from: MINT_ADDRESS});
        return result
    } catch (error) {
        console.log(error);
        return false;
    }
}

const startAndAwardPrize = async () => {
    try {
        const canStart = await strategyContract.methods.canStartAward().call();
        console.log('CanStart:', canStart);
        if(!canStart) return;
        await strategyContract.methods.startAward().send({from: MINT_ADDRESS});
        await strategyContract.methods.completeAward().send({from: MINT_ADDRESS});
    } catch (error) {
        console.log('Error ocurred when trying to award the prize', error);
    }
}

const checkERC721Prize = async() => {
    const result = await strategyContract.methods.getAwardErc721TokenIds(INTO_ETHER_TOKEN_ADDRESS).call();
    console.log(result);
}

module.exports = {
    getRecentTokenHash, 
    mintToken, 
    addERC721ToPrizePool, 
    getPrizePeriodRemaining,
    startAndAwardPrize,
    checkERC721Prize
};