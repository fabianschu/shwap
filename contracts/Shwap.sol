pragma solidity ^0.7.6;

import "hardhat/console.sol";

contract Shwap {

  function authorize(address _tokenAddress, uint _tokenId) public {
    console.log("Shwap > this >");
    console.log("Shwap > doSomething > msg.sender >");
    console.log(msg.sender);
    _tokenAddress.delegatecall(abi.encodePacked(bytes4(keccak256("doSomething()")), this ,_tokenId));
    // _tokenAddress.delegatecall(abi.encodePacked(bytes4(keccak256("approve(address,uint256)")), this ,_tokenId));
  }

}
