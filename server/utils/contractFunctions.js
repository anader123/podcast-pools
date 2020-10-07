const IntoTheEther = require('../abis/IntoTheEther.json');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');

// .env Variables
const {
    WEB3_PROVIDER,
    MINT_ADDRESS,
    INTO_ETHER_TOKEN_ADDRESS,
    MNEMONIC_PHRASE
} = process.env;

// @truffle/hdwallet-provider Setup
let provider = new HDWalletProvider({
    mnemonic: {
      phrase: MNEMONIC_PHRASE
    },
    providerOrUrl: WEB3_PROVIDER
  });

// Web3 Setup (Rinkeby)
const web3 = new Web3(provider);
const intoEtherTokenContract = new web3.eth.Contract(IntoTheEther.abi, INTO_ETHER_TOKEN_ADDRESS);
// const strategyContract = new web3.eth.Contract(abi, strategyContractAddress);
// const poolContract = new web3.eth.Contract(abi, poolContractAddress);

const mintToken = async (ipfsHash) => {
    try{
        const result = await intoEtherTokenContract.methods.mintEpisode(MINT_ADDRESS, ipfsHash).send({from: MINT_ADDRESS});
        console.log(result.transactionHash);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getRecentTokenHash = async() => {
    try {
        console.log(intoEtherTokenContract.methods)
        const tokenCount = await intoEtherTokenContract.methods.totalSupply().call();
        console.log(tokenCount);
        const result = await intoEtherTokenContract.methods.tokenURI(tokenCount).call();
        console.log(result)
        // const ipfsHash = result.slice(12); //return value is formatted as ipfs://ipfs/[hash]
        // console.log(ipfsHash);
        // return ipfsHash;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const startWinnerSelection = () => {

}

const startPrizeContest = () => {

}

const addERC721ToPool = async () => {
    try {
        const tokenId = await intoEtherTokenContract.methods.totalSupply().call(); //Newest token id == count;
        poolContract.methods.addExternalErc721Award(INTO_ETHER_TOKEN_ADDRESS, [tokenId]);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {web3, getRecentTokenHash, mintToken, addERC721ToPool};