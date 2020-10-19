const IPFS = require("ipfs-mini");
const axios = require("axios");
const ipfs = new IPFS({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
});

const ipfsImage = "ipfs://ipfs/QmNfNa7M9tQbRieAbsEnLKKa8UcyHffjMjBaBB1wJGC7hu";
const intoTheEtherURL = "https://podcast.ethhub.io/";

const formatTokenURIData = (dataObj) => {
    return {
        name: dataObj.name,
        description: dataObj.description,
        image: ipfsImage,
        external_url: intoTheEtherURL,
        attributes: [
            {
                trait_type: "Date",
                value: dataObj.date,
            },
            {
                trait_type: "Duration",
                value: dataObj.duration,
            },
        ],
    };
};

const uploadURIData = async (dataObj) => {
    try {
        const URIData = formatTokenURIData(dataObj);
        const ipfsHash = await ipfs.addJSON(URIData);
        console.log(`Data uploaded to IPFS: ${ipfsHash}`);
        return ipfsHash;
    } catch (error) {
        console.log(error);
    }
};

const getNameFromIpfs = async (ipfsHash) => {
    try {
        const result = await axios.get(
            `${process.env.IPFS_PROVIDER}${ipfsHash}`
        );
        const name = result.data.name;
        return name;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = { uploadURIData, getNameFromIpfs };
