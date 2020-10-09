require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getPodEpisodeData } = require('./utils/rssHelper');
const { uploadURIData, getNameFromIpfs } = require('./utils/ipfsHelper');
const { getRecentTokenHash, mintToken } = require('./utils/contractFunctions');

// App Instance
const app = express();

// Middleware 
app.use(express.json());
app.use(cors());

// const mainFunction = async () => {
//     const episodeData = await getPodEpisodeData(0); // 0 gets the latest epi
//     const recentIpfsHash = await getRecentTokenHash();
//     const recentTokenName = await getNameFromIpfs(recentIpfsHash);
//     const recentEpisodeName = episodeData.name;

//     if(recentTokenName === recentEpisodeName) return;

//     const tokenURI = await uploadURIData(episodeData);
//     const result = await mintToken(tokenURI);

//     // run again if token failed to mint
//     if(result === false) mainFunction();
//     console.log('token was minted');
//     const added = await addERC721ToPool();
//     // function addExternalErc721Award(address _externalErc721, uint256[] calldata _tokenIds) on strat contract is used to register tokens
//     // start the next prize comp
//     // award prize? 
// }

const mintEpisodeToken = async () => {
    const epiData = await getPodEpisodeData(2);
    const ipfsHash = await uploadURIData(epiData);
    console.log(ipfsHash)
    mintToken(ipfsHash);
}


mintEpisodeToken();
// getRecentTokenHash();

// Server Listening 
app.listen(process.env.SERVER_PORT, () => console.log(`Server is starting up on Port ${process.env.SERVER_PORT}`));