const IPFS = require('ipfs-mini');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const ipfsImage; // IPFS hash of where the image is stored
const intoTheEtherURL = "https://podcast.ethhub.io/";

const getTokenURIData = (dataObj) => {
    return {
        "name": dataObj.name,
        "description": dataObj.description,
        "image": ipfsImage,
        "external_url": intoTheEtherURL,
        "attributes": [
            {
            "trait_type": "Date", 
            "value": dataObj.date
            },
            {
            "trait_type": "Duration", 
            "value": dataObj.duration
            },
        ]
    }
}

// Uploades URI data and returns hash
const uploadURIData = (dataObj) => {
    const URIData = getTokenURIData(dataObj);
    ipfs.add(URIData, (err, hash) => {
        if(err) {
            return console.log(err);
        }
        return hash;
    })
}

module.exports = { uploadURIData };
