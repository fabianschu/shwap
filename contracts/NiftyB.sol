pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract NiftyB is ERC721 {
  constructor() ERC721("rofl", "ROFL")  {
    _mint(msg.sender, 1);
  }
}
