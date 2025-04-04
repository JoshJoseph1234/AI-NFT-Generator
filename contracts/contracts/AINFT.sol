// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AINFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Mapping to track NFTs owned by each user
    mapping(address => uint256[]) private _userTokens;
    
    event NFTMinted(uint256 tokenId, address recipient, string tokenURI);

    constructor() ERC721("AI NFT Collection", "AINFT") {}

    // Remove onlyOwner modifier to allow any user to mint
    function mintNFT(address recipient, string memory tokenURI) 
        public 
        returns (uint256) 
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        // Add token to user's collection
        _userTokens[recipient].push(newItemId);

        emit NFTMinted(newItemId, recipient, tokenURI);
        return newItemId;
    }

    function getUserTokens(address user) public view returns (uint256[] memory) {
        return _userTokens[user];
    }

    function getUserTokenURIs(address user) public view returns (string[] memory) {
        uint256[] memory tokenIds = _userTokens[user];
        string[] memory uris = new string[](tokenIds.length);
        
        for(uint i = 0; i < tokenIds.length; i++) {
            uris[i] = tokenURI(tokenIds[i]);
        }
        
        return uris;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}