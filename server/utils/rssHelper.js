const axios = require('axios');
const parseString = require('xml2js').parseString; // Parsing XML

// Makes request to RSS feed
const getPodEpisodeData = async(index) => {
    let response = await axios.get(process.env.RSS_FEED);
    let data = response.data; 

    let xlmResult;
    parseString(data, function (err, result) {
      xlmResult = result;
    });

    // episode data
    const episode = xlmResult.rss.channel[0].item[index]; 
    let name = episode.title[0];
    let description = episode.description[0];
    let date = episode.pubDate[0].slice(0, 16);
    const duration = episode['itunes:duration'][0];

    const returnData = formatData(name, description);
    name = returnData.name;
    description = returnData.description;
    
    const episodeData = {name, date, description, duration};
    console.log(episodeData);
    return episodeData
}

const formatData = (name, description) => {
    let finalName;
    let finalDescription;
    if(name.substr(0, 13) === "EthHub Weekly") {
        finalName = name.slice(0, 18);
        finalDescription = name.slice(20);
        return {name:finalName, description:finalDescription};
    }
    else {
        finalDescription = description.slice(3, (description.length-4));
        return {name, description:finalDescription};
    }
}

module.exports = {getPodEpisodeData}