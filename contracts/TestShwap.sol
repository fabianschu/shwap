pragma solidity ^0.7.6;

import "./Shwap.sol";

contract TestShwap is Shwap {
  event ApprovalConfirmation();
  event AllApprovalConfirmation();


  function _transfer(
    address _tokenAddress,
    address _fromAddress,
    address _toAddress,
    uint _tokenId
  ) public {
    transfer(_tokenAddress, _fromAddress, _toAddress, _tokenId);
  }

  function _isApproved(
    address _tokenAddress,
    uint _tokenId
  ) public {
    if (isApproved(_tokenAddress, _tokenId)) {
      emit ApprovalConfirmation();
    }
  }

  function _isAllApproved(
    address _proposerTokenAddress,
    address _counterpartTokenAddress,
    uint _proposerTokenId,
    uint _counterpartTokenId
  ) public {
    if (isAllApproved(_proposerTokenAddress, _counterpartTokenAddress, _proposerTokenId, _counterpartTokenId)) {
      emit AllApprovalConfirmation();
    }
  }
}
