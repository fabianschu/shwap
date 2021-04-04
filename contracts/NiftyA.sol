pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract NiftyA is ERC721 {
  constructor() ERC721("lol", "LOL")  {
    _mint(msg.sender, 1);
  }

  function doSomething(address _to, uint256 _tokenId) external {
    console.log("__");
    console.log("NiftyA > doSomething > msg.sender >");
    console.log(msg.sender);
    console.log("NiftyA > doSomething > _to >");
    console.log(_to);
    console.log("NiftyA > doSomething > _tokenId >");
    console.log(_tokenId);
    console.log("__");
  }
}
