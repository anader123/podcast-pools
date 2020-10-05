require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getPodEpisodeData } = require('./utils/rssHelper');
const { uploadImageFile, uploadContractURI } = require('./utils/ipfsUploader');

// .env Variables
const {
    SERVER_PORT,
    WEB3_PROVIDER,
    IPFS_PROVIDER,
    MINT_ADDRESS,
    PRIV_KEY
} = process.env;

// App Instance
const app = express();

// Middleware 
app.use(express.json());
app.use(cors());

// Server Listening 
app.listen(SERVER_PORT, () => console.log(`Server is starting up on Port ${SERVER_PORT}`));

// param is the episode to get, 0 is the latest
// getPodEpisodeData(1);
