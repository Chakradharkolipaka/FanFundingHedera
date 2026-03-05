// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract FanFunding is ERC721URIStorage, ReentrancyGuard {
    uint256 private _tokenIdCounter;

    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(uint256 => uint256) public totalDonations;
    mapping(uint256 => Donation[]) private _donations;
    mapping(address => uint256) public totalDonatedBy;

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string tokenURI
    );
    event DonationReceived(
        uint256 indexed tokenId,
        address indexed donor,
        address indexed creator,
        uint256 amount,
        uint256 timestamp
    );

    error ZeroDonation();
    error TokenDoesNotExist(uint256 tokenId);
    error TransferFailed();

    constructor() ERC721("FanFunding", "FANF") {}

    function mintNFT(string calldata _tokenURI) external returns (uint256) {
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        emit NFTMinted(newTokenId, msg.sender, _tokenURI);
        return newTokenId;
    }

    function donate(uint256 _tokenId) external payable nonReentrant {
        if (msg.value == 0) revert ZeroDonation();
        if (_ownerOf(_tokenId) == address(0))
            revert TokenDoesNotExist(_tokenId);

        address creator = ownerOf(_tokenId);
        _donations[_tokenId].push(
            Donation(msg.sender, msg.value, block.timestamp)
        );
        totalDonations[_tokenId] += msg.value;
        totalDonatedBy[msg.sender] += msg.value;

        (bool success, ) = payable(creator).call{value: msg.value}("");
        if (!success) revert TransferFailed();

        emit DonationReceived(
            _tokenId,
            msg.sender,
            creator,
            msg.value,
            block.timestamp
        );
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }

    function getDonations(
        uint256 _tokenId
    ) external view returns (Donation[] memory) {
        return _donations[_tokenId];
    }

    function getDonationCount(
        uint256 _tokenId
    ) external view returns (uint256) {
        return _donations[_tokenId].length;
    }
}
