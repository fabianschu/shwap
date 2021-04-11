pragma solidity ^0.7.6;

import "hardhat/console.sol";

contract Shwap {
  uint public numberProposals;
  
  mapping(uint => Proposal) public proposals;
  // mapping(address => ) private proposers;

  struct Proposal {
    address proposerAddress;
    address proposerTokenAddress;
    address counterpartTokenAddress;
    uint proposerTokenId;
    uint counterpartTokenId;
    bool exists;
  }

  struct ownerProposals {
    address proposerAddress;
    address proposerTokenAddress;
    address counterpartTokenAddress;
    uint proposerTokenId;
    uint counterpartTokenId;
    bool exists;
  }

  event ProposalEvent(
    address indexed proposerAddress,
    address indexed proposerTokenAddress,
    address indexed counterpartTokenAddress,
    uint proposerTokenId,
    uint counterpartTokenId
  );

  event IndexChange (
    uint indexed oldIdx,
    uint indexed newIdx
  );
    
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
      _counterpartTokenId,
      true
    );
    proposals[numberProposals] = proposal;
    numberProposals++;
    emit ProposalEvent(
      msg.sender,
      _proposerTokenAddress,
      _counterpartTokenAddress,
      _proposerTokenId,
      _counterpartTokenId
    );
  }

  function acceptProposal(
    uint _idx
  ) public {
    // check if proposals available
    require(numberProposals > 0, "No proposals available");
    
    // check if proposal wiht index exists
    require(proposals[_idx].proposerAddress != address(0), "Index does not exist");


    // check if acceptor is counterpart
    require(isOwner(proposals[_idx].counterpartTokenAddress, proposals[_idx].counterpartTokenId), "Not authorized");

    // check if transfer is possible for both items
    bool approvalsConfirmed = isAllApproved(
      proposals[_idx].proposerTokenAddress,
      proposals[_idx].counterpartTokenAddress,
      proposals[_idx].proposerTokenId,
      proposals[_idx].counterpartTokenId
    );
    require(approvalsConfirmed, "Insufficient approvals");

    // do both transfers
    bool proposerTransfer = transfer(
      proposals[_idx].proposerTokenAddress,
      proposals[_idx].proposerAddress,
      msg.sender,
      proposals[_idx].proposerTokenId
    );
    require(proposerTransfer, "Transfer failure");
    bool counterpartTransfer = transfer(
      proposals[_idx].counterpartTokenAddress,
      msg.sender,
      proposals[_idx].proposerAddress,
      proposals[_idx].counterpartTokenId
    );
    require(counterpartTransfer, "Transfer failure");
    
    // clean up data structure
    proposals[_idx] = proposals[numberProposals - 1];
    delete proposals[numberProposals - 1];
    emit IndexChange(numberProposals - 1, _idx);
    numberProposals--;
  }

  function isOwner(
    address _tokenAddress,
    uint _tokenId
  ) internal returns(bool) {
    (
      bool success,
      bytes memory data
    ) = _tokenAddress.call(
      abi.encodeWithSignature(
        "ownerOf(uint256)",
        _tokenId
      )
    );
    (address ownerAddress) = abi.decode(data, (address));
    return ownerAddress == msg.sender;
  }

  function isAllApproved(
    address _proposerTokenAddress,
    address _counterpartTokenAddress,
    uint _proposerTokenId,
    uint _counterpartTokenId
  ) internal returns(bool) {
    return isApproved(_proposerTokenAddress, _proposerTokenId)
      && isApproved(_counterpartTokenAddress, _counterpartTokenId);
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
