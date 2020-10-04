pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IntoTheEther is Ownable, ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address private poolAddress;

    constructor(address _poolAddress) public ERC721("Into the Ether", "ITE") {
        poolAddress = _poolAddress;
    }

    // function contractURI() public view returns (string memory) {
    //     return "";
    // }

    function getTokenCount() public view returns(uint256) {
        return _tokenIds.current();
    }

    function mintEpisode(string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(poolAddress, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}