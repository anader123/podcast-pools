import axios from "axios";

export const getNftDataFromIpfs = async (hashArray) => {
    const episodeDataArray = [];
    hashArray.forEach(async (ipfsHash) => {
        try {
            const episodeData = await axios.get(
                `https://ipfs.infura.io/ipfs/${ipfsHash}`
            );
            episodeDataArray.push(episodeData);
        } catch (error) {
            console.log(error);
        }
    });
    return episodeDataArray;
};

export const addressShortener = (address) => {
    if (address === undefined) return "0x00000";
    const shortAddress = `${address.slice(0, 6)}...${address.slice(37, 42)}`;
    return shortAddress;
};

export const txHashShortener = (txHash) => {
    if (txHash === undefined) return "0x00000";
    const shortTxHash = `${txHash.slice(0, 5)}...${txHash.slice(
        txHash.length - 3,
        txHash.length
    )}`;
    return shortTxHash;
};
