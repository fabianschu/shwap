pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract TToken is ERC721 {

  constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

  function mint(address _target, uint _tokenId) public {
    _mint(_target, _tokenId);
  }
}
