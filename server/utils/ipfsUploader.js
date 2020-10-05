const IPFS = require('ipfs-mini');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
// const fs = require('fs');

const ipfsImage = "ipfs://ipfs/QmNfNa7M9tQbRieAbsEnLKKa8UcyHffjMjBaBB1wJGC7hu"; 
const intoTheEtherURL = "https://podcast.ethhub.io/";

const formatTokenURIData = (dataObj) => {
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

const uploadURIData = (dataObj) => {
    const URIData = formatTokenURIData(dataObj);
    ipfs.addJSON(URIData, (err, hash) => {
        if(err) {
            return console.log(err);
        }
        return hash;
    });
}

// const uploadContractURI = () => {
//     const data = {
//                 "name": "Into the Ether",
//                 "description": "Into the Ether is a podcast focusing on all things Ethereum and DeFi. This podcast features in-depth discussions with prominent guests in the space hosted by Eric Conner as well as weekly news recaps featuring Anthony Sassano.",
//                 "image": ipfsImage,
//                 "external_link": intoTheEtherURL
//                 }
//     ipfs.addJSON(data, (err, hash) => {
//         if(err) {
//             return console.log(err);
//         }
//         return hash;
//     });
// }


// const fileName = "ETHHUB_Podcast.png";
// const filePath = "./server/ETHHUB_Podcast.png";
// const uploadImageFile = async (fileName, filePath) => {
//     const file = fs.readFileSync(filePath);
//     const fileAdded = await ipfs.add({path: fileName, content: file});
//     console.log(fileAdded);
// }

module.exports = { uploadURIData };