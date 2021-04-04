pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract NiftyA is ERC721 {
  constructor() ERC721("aaa", "AAA")  {
    _mint(msg.sender, 1);
  }
}
