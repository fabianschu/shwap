pragma solidity ^0.7.6;

import "hardhat/console.sol";

contract Shwap {
  struct Payment {
      uint amount;
      uint timestamp;
      
  }
  
  struct Balance {
      uint totalBalance;
      uint numPayments;
      mapping(uint => Payment) payments;
  }
  
  mapping(address => Balance) public balanceReceived;
    
  function transfer(address _tokenAddress, address _fromAddress, address _toAddress, uint _tokenId) public {
    (bool success, bytes memory data) = _tokenAddress.call(
      abi.encodeWithSignature("safeTransferFrom(address,address,uint256)",  _fromAddress, _toAddress, _tokenId)
    );
  }
}
