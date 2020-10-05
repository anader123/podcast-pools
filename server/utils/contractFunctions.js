const IntoTheEther = require('../abis/IntoTheEther.json');

// .env Variables
const {
    WEB3_PROVIDER,
    MINT_ADDRESS,
    PRIV_KEY,
    INTO_ETHER_TOKEN_ADDRESS
} = process.env;

// Web3 Setup (Rinkby)
const Web3 = require('web3');
const web3 = new Web3(WEB3_PROVIDER);
web3.eth.accounts.wallet.add(PRIV_KEY);
const intoEtherTokenContract = new web3.eth.Contract(IntoTheEther.abi, INTO_ETHER_TOKEN_ADDRESS);
// const strategyContract = new web3.eth.Contract(abi, strategyContractAddress);
// const poolContract = new web3.eth.Contract(abi, poolContractAddress);

const mintToken = async (tokenURI) => {
    try{
        const result = await intoEtherTokenContract.methods.mintEpisode(tokenURI).send({from: MINT_ADDRESS});
        console.log(result);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getRecentTokenHash = async() => {
    try {
        const tokenCount = await intoEtherTokenContract.methods.totalSupply().call();
        const result = await intoEtherTokenContract.methdods.tokenURI(tokenCount).call();
        const ipfsHash = result.slice(12); //return value is formatted as ipfs://ipfs/[hash]
        return ipfsHash;
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