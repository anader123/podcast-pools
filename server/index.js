require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getPodEpisodeData } = require("./utils/rssHelper");
const { uploadURIData, getNameFromIpfs } = require("./utils/ipfsHelper");
const {
    getRecentTokenHash,
    mintToken,
    addERC721ToPrizePool,
    startAndAwardPrize,
} = require("./utils/contractFunctions");

// App Instance
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const checkRssAndMint = async () => {
    const episodeData = await getPodEpisodeData(0); // 0 gets the latest epi
    const recentIpfsHash = await getRecentTokenHash();
    const recentTokenEpisodeName = await getNameFromIpfs(recentIpfsHash);
    const recentEpisodeName = episodeData.name;

    if (recentTokenEpisodeName === recentEpisodeName)
        return console.log("No new token to mint");
    if (recentTokenEpisodeName === false)
        return console.log("Error getting name data");

    const tokenURI = await uploadURIData(episodeData);
    if (tokenURI === false) return console.log("Error with uploading to IPFS");

    const mintResult = await mintToken(tokenURI);
    if (mintResult === false) return console.log("Error with minting NFT");
    console.log(`Token was minted. TxHash: ${mintResult}`);

    const addResult = await addERC721ToPrizePool();
    if (addResult === false)
        return console.log("Error with adding token to the pool");
    console.log(`Token was added as a prize. TxHash: ${addResult}`);
};

// getPodEpisodeData(0);

// Checks to see if prize is ready to be given out and if it is, it rewards the winner
startAndAwardPrize();

// Sees what the newest podcast is in the rss feed and mints a new one if needed
checkRssAndMint();

// Server Listening
app.listen(process.env.SERVER_PORT, () =>
    console.log(`Server is running on Port ${process.env.SERVER_PORT}`)
);
