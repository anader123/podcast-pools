pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/drafts/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IntoTheEther is ERC721Full is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721Full("Into the Ether", "ITE") public {
    }

    function mintToPool(address poolAddress, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(poolAddress, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}