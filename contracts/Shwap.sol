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

  event ApprovalConfirmation(
    address tokenAddress,
    uint tokenId
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
    uint id
  ) public {
    // check if transfer is possible for both items
    // do both transfers
    // remove proposal from proposals
    // take last proposal and put it in new gap, adapt counter, emit event
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
    bool approval = approvedAddress == address(this);
    if(!approval) return false;
    emit ApprovalConfirmation(_tokenAddress, _tokenId);
    return true;
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
