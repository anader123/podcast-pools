pragma solidity 0.6.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IntoTheEther is Ownable, ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() public ERC721("Into the Ether", "ITE") {
        _setBaseURI("ipfs://ipfs/");
    }
    
    function contractURI() public view returns (string memory) {
        return "ipfs://ipfs/QmdyQRNEFnjSX1VivhokGqnLgpq3oBxeStv6VJNdo3owZt";
    }

    function mintEpisode(address _mintAddress, string memory _ipfsHash) public onlyOwner returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(_mintAddress, newItemId);
        _setTokenURI(newItemId, _ipfsHash);

        return newItemId;
    }
}