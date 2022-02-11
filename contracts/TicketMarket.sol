// contracts/NFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TicketMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _ticketIds;
    Counters.Counter private _ticketsSold;

    address payable owner;
    uint256 listingFee = 0.25 ether;

    constructor() {
        owner = payable(msg.sender);
    }

    struct TicketItem {
        uint256 ticketId;
        uint256 price;
        uint256 tokenId;
        address nftContract;
        address payable owner;
        address payable seller;
        bool isSold;
    }

    mapping(uint256 => TicketItem) private _tickets;

    event TicketCreated(
        uint256 indexed itemId,
        uint256 indexed price,
        uint256 indexed ticketId,
        address nftContract,
        address owner,
        address seller,
        bool isSold
    );

    function getListingFee() public view returns (uint256) {
        return listingFee;
    }

    function createMarketItem(
        address nftContract,
        uint256 price,
        uint256 tokenId
    ) public payable nonReentrant {
        require(msg.value == listingFee, "You must pay the listing fee");
        require(price > 0, "Price must be greater than 0");

        _ticketIds.increment();
        uint256 ticketId = _ticketIds.current();

        _tickets[ticketId] = TicketItem(
            ticketId,
            price,
            tokenId,
            nftContract,
            payable(address(0)),
            payable(msg.sender),            
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit TicketCreated(
            ticketId,
            price,
            ticketId,
            nftContract,
            msg.sender,
            address(0),
            false
        );
        // console.log(_tickets[ticketId].owner,ticketId);
        // console.log(_tickets[2].owner);
    }

    function createMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint256 price = _tickets[itemId].price;
        uint256 tokenId = _tickets[itemId].tokenId;
        require(
            msg.value == price,
            "You must pay the price of the item"
        );

        _tickets[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        _tickets[itemId].owner = payable(msg.sender);
        _tickets[itemId].isSold = true;
        _ticketsSold.increment();
        payable(owner).transfer(listingFee);
    }

    function fetchTickets() public view returns (TicketItem[] memory) {
        uint256 itemCount = _ticketIds.current();
        uint256 unsoldItemCount = _ticketIds.current() - _ticketsSold.current();
        uint256 currentIndex = 0;

        TicketItem[] memory items = new TicketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (_tickets[i+1].owner == address(0)) {
                uint256 currentId = i + 1;
                TicketItem storage currentItem = _tickets[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchMyTickets() public view returns (TicketItem[] memory) {
        uint256 itemCount = _ticketIds.current();
        uint256 myItemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < itemCount; i++) {
            if (_tickets[i + 1].owner == msg.sender) {
                myItemCount += 1;
            }
        }

        TicketItem[] memory items = new TicketItem[](myItemCount);

        for (uint256 i = 0; i < itemCount; i++) {
            if (_tickets[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                TicketItem storage currentItem = _tickets[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchMyCreated() public view returns (TicketItem[] memory) {
        uint256 itemCount = _ticketIds.current();
        uint256 myItemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < itemCount; i++) {
            if (_tickets[i + 1].seller == msg.sender) {
                myItemCount += 1;
            }
        }

        TicketItem[] memory items = new TicketItem[](myItemCount);

        for (uint256 i = 0; i < itemCount; i++) {
            if (_tickets[i + 1].seller == msg.sender) {
                uint256 currentId = i + 1;
                TicketItem storage currentItem = _tickets[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
