pragma solidity ^0.6.0;

// _baseURI = ipfs://ipfs/QmdyQRNEFnjSX1VivhokGqnLgpq3oBxeStv6VJNdo3owZt

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IntoTheEther is Ownable, ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address private mintAddress;

    constructor(address _mintAddress, string memory _baseURI) public ERC721("Into the Ether", "ITE") {
        mintAddress = _mintAddress;
        _setBaseURI(_baseURI);
    }

    function getTokenCount() public view returns(uint256) {
        return _tokenIds.current();
    }

    function mintEpisode(string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(mintAddress, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}