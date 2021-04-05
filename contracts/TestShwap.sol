pragma solidity ^0.7.6;

import "./Shwap.sol";

contract TestShwap is Shwap {
  function _transfer(
    address _tokenAddress,
    address _fromAddress,
    address _toAddress,
    uint _tokenId
  ) public {
    transfer(_tokenAddress, _fromAddress, _toAddress, _tokenId);
  }
}
