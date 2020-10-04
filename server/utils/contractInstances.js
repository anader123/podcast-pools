// .env Variables
const {
    SERVER_PORT,
    WEB3_PROVIDER,
    IPFS_PROVIDER,
    MINT_ADDRESS,
    PRIV_KEY
} = process.env;

// Web3 Setup (Kovan)
const Web3 = require('web3');
const web3 = new Web3(WEB3_PROVIDER);
web3.eth.accounts.wallet.add(PRIV_KEY);
// const intoEtherToken = new web3.eth.Contract(abi, intoEtherTokenAddress);
// const strategyContract = new web3.eth.Contract(abi, strategyContractAddress);
// const poolContract = new web3.eth.Contract(abi, poolContractAddress);

module.exports = {web3};