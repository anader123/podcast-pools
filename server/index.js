require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Parsing XML
const parseString = require('xml2js').parseString;

// .env Variables
const {
    SERVER_PORT,
    RSS_FEED,
    WEB3_PROVIDER,
    IPFS_PROVIDER
} = process.env;

// App Instance
const app = express();

// Middleware 
app.use(express.json());
app.use(cors());

// Server Listening 
app.listen(SERVER_PORT, () => console.log(`Server is starting up on Port ${SERVER_PORT}`));

// Makes request to RSS feed
const getPodEpisodeData = async() => {
    let xlmResponse = await axios.get(RSS_FEED);
    xlmResponse = xlmResponse.data; 

    let xlmResult;
    parseString(xlmResponse, function (err, result) {
      xlmResult = result;
    });

    // latest release time
    const latestPubDate = xlmResult.rss.channel[0].pubDate[0]; 

    // episode data, 0 = newest ep
    const episode = xlmResult.rss.channel[0].item[0]; 
    const title = episode.title[0];
    const pubDate = episode.pubDate[0];
    const description = episode.description[0];
    const duration = episode['itunes:duration'][0];
    
    const episodeData = {title, pubDate, description, duration};
    
    return {
        latestPubDate,
        episodeData
    }
}

getPodEpisodeData();