pragma solidity ^0.7.6;

import "hardhat/console.sol";

contract Shwap {
  uint public idCounter;

  event ProposalEvent(
    address indexed proposerAddress,
    address indexed proposerTokenAddress,
    address indexed counterpartTokenAddress,
    uint proposerTokenId,
    uint counterpartTokenId
  );

  struct Proposal {
    address proposerAddress;
    address proposerTokenAddress;
    address counterpartTokenAddress;
    uint proposerTokenId;
    uint counterpartTokenId;
  }
  
  mapping(uint => Proposal) public proposals;
    
  function addProposal(
    address _proposerTokenAddress,
    address _counterpartTokenAddress,
    uint _proposerTokenId,
    uint _counterpartTokenId
  ) public {
    Proposal memory proposal = Proposal(
      msg.sender,
      _proposerTokenAddress,
      _counterpartTokenAddress,
      _proposerTokenId,
      _counterpartTokenId
    );
    proposals[idCounter] = proposal;
    idCounter++;
    emit ProposalEvent(
      msg.sender,
      _proposerTokenAddress,
      _counterpartTokenAddress,
      _proposerTokenId,
      _counterpartTokenId
    );
  }

  function acceptProposal(
    uint _id
  ) public {
    // check if transfer is possible for both items
    bool approvalsConfirmed = isAllApproved(
      proposals[_id].proposerTokenAddress,
      proposals[_id].counterpartTokenAddress,
      proposals[_id].proposerTokenId,
      proposals[_id].counterpartTokenId
    );
    require(approvalsConfirmed, "Insufficient approvals");
    // do both transfers
    // remove proposal from proposals
    // take last proposal and put it in new gap, adapt counter, emit event
  }

  function isAllApproved(
    address _proposerTokenAddress,
    address _counterpartTokenAddress,
    uint _proposerTokenId,
    uint _counterpartTokenId
  ) internal returns(bool) {
    return isApproved(_proposerTokenAddress, _proposerTokenId) && isApproved(_counterpartTokenAddress, _counterpartTokenId);
  }

  function isApproved(
    address _tokenAddress,
    uint _tokenId
  ) internal returns(bool) {
    (
      bool success,
      bytes memory data
    ) = _tokenAddress.call(
      abi.encodeWithSignature(
        "getApproved(uint256)",
        _tokenId
      )
    );
    (address approvedAddress) = abi.decode(data, (address));
    return approvedAddress == address(this);
  }

  function transfer(
    address _tokenAddress,
    address _fromAddress,
    address _toAddress,
    uint _tokenId
  ) internal returns(bool){
    (
      bool success,
      bytes memory data
    ) = _tokenAddress.call(
      abi.encodeWithSignature(
        "transferFrom(address,address,uint256)",
        _fromAddress,
        _toAddress,
        _tokenId
      )
    );
    return success;
  }

}
