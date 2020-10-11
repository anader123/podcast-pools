import axios from 'axios';

export const getNftDataFromIpfs = async (hashArray) => {
    const episodeDataArray = [];
    hashArray.forEach(ipfsHash => {
        try {
            const episodeData = await axios.get(`https://ipfs.infura.io/ipfs/${ipfsHash}`);
            episodeDataArray.push(episodeData);
        } catch (error) {
            console.log(error);
        }
    })
    return episodeDataArray;
}

export const addressShortener = (address) => {
    if(address === undefined) return "0x00000"
    const shortAddress = `${address.slice(0, 6)}...${address.slice(37, 42)}`;
    return shortAddress;
}