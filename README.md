# Podcast Pools

_Win NFT episodes from your favorite Podcasts_

## Description

Podcast Pools allows for podcast creators to capture value by having their fans lock up stablecoins into a no loss lottery where the prize is an NFT that represents that week’s episode.

In this project, a no loss lottery is where users lock up Dai into an interest earning protocol in exchange for ticket tokens and a chance to win a prize. The no loss aspect is that the user doesn't lose their initial deposit, only the interest while their Dai is locked up. In this case, the prize for the lottery is an NTF episode from that week's podcast and the interest from all the Dai goes to fund the Podcast creator. If a user doesn't win that week's prize they are auto enrolled into the next week's prize drawing without having to do anything.

Similar to Patreon, people can contribute to creators they support, but instead of directly donating money, they are instead giving the interest earned by their assets for a chance to win a [tokenized episode](https://en.wikipedia.org/wiki/Non-fungible_token).

![alt text](https://github.com/anader123/podcast-pools/raw/master/readme_images/podpool-summary.png "Summary")

## Project Highlights

-   PoolTogether v3 Contracts
-   ERC721 Standard for NFTs
-   IPFS for NFT metadata storage
-   Ethers.js
-   Portis Login
-   Server's Web3 Provider is powered by Pocket Network
-   Node/Express Server
-   React Frontend
-   Mobile Responsive

## System Overview

![alt text](https://github.com/anader123/podcast-pools/raw/master/readme_images/add-diagram.png "Add Diagran")

**a.** The server is listening to a Podcast's [RSS feed](https://en.wikipedia.org/wiki/RSS) and sees that a new episode has been added.

**b.** The serves then formats the recent episode data and uploads the metadata to [IPFS](https://ipfs.io/#how).

**c.** The server uses it's private key to mint a new [NFT episode](https://en.wikipedia.org/wiki/Non-fungible_token) to the pool contract's address. When the server creates the NFT, it points the [token's metadata URI ](https://docs.opensea.io/docs/metadata-standards) to the IPFS hash of the metadata for the new episode.

**d.** The NFT contract mints and assigns ownership to the pool contract.

**e.** Lastly, the server then calls a function on the strategy contract to let it know that an NFT episode needs to be added to the next prize round.

## Contract Overview

**ERC721 Contract:** Contract that stores all the state and metadata pointers for the NFTs that have been created.

**Pool Contract:** Users deposit stablecoins to this contract and are given ticket tokens in return in a one to one ratio. This contract is in charge of maintaing user's balances and added them to yield earing protocols (Compound in this case). Lastly, this contract holds the NTF episodes as well and is the one that sends them to the winner.

**Strategy Contract:** Controls where the interest from the deposited stablecoins is awarded to as well as the NFT epsidoes. However, the strategy contract is not able to touch a user's inital deposit, only the interest earned. The interest earned is given to the podcast creator and the NFT is given to the person that is drawn as the winner.

## Application Views

### Mobile

![alt text](https://raw.githubusercontent.com/anader123/podcast-pools/master/readme_images/podpool-mobile.png "Mobile view")

### Desktop

![alt text](https://raw.githubusercontent.com/anader123/podcast-pools/master/readme_images/podpool-desktop.png "Desktop view")

## Token URI Format

**URIs are formatted as ipfs://ipfs/[ipfsHash]**

For example: Querying IPFS with the hash [QmQMZA7WZiZUVJqujJX2kbtUu53VmWaF7PhkwqatF9uF8j](https://ipfs.infura.io/ipfs/QmQMZA7WZiZUVJqujJX2kbtUu53VmWaF7PhkwqatF9uF8j) returns:

```javascript
{
    name:"EthHub Weekly #130",

    description:"SushiSwap drama, crypto market volatility...",

    image:"ipfs://ipfs/QmNfNa7M9tQbRieAbsEnLKKa8UcyHffjMjBaBB1wJGC7hu",

    external_url:"https://podcast.ethhub.io/",

    attributes:[
        {trait_type:"Date", value:"Tue, 08 Sep 2020"},
        {trait_type:"Duration", value:"49:28"}
    ]
}
```

You can view this asset [here](https://rinkeby.opensea.io/assets/0x6325764783626e233f5ff4f2d8d1f2bccd9d6105/1) on OpenSea.

## Contract URI

The URI for the contract can be found at the IPFS hash below

```javascript
contractURI = "ipfs://ipfs/QmdyQRNEFnjSX1VivhokGqnLgpq3oBxeStv6VJNdo3owZt";
```

## Contract Addresses (Rinkeby)

```javascript
PRIZE_STRAT_ADDRESS = 0xdf577189ad9659070d903d1a7a22d0fb9e07f2f8;
PRIZE_POOL_ADDRESS = 0x65d16e7c4a7cb9d8fa2d8bbe55916ffb6efe87fd;
INTO_ETH_TOKEN_ADDRESS = 0x6325764783626e233f5ff4f2d8d1f2bccd9d6105;
DAI_TOKEN_ADDRESS = 0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea;
TICKET_TOKEN_ADDRESS = 0x8bea329655c9809355922ac70fd4b0e51ce3fbd8;
```
