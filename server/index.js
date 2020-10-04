require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getPodEpisodeData } = require('./utils/rssHelper');


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

// App Instance
const app = express();

// Middleware 
app.use(express.json());
app.use(cors());

// Server Listening 
app.listen(SERVER_PORT, () => console.log(`Server is starting up on Port ${SERVER_PORT}`));

// para is the episode to get, 0 is the latest
getPodEpisodeData(0);