pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "./interfaces/IERC721.sol";

contract TradeHub {
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

  event ProposalAdded(
    uint numberProposals,
    address indexed proposerAddress,
    address indexed proposerTokenAddress,
    address indexed counterpartTokenAddress,
    uint proposerTokenId,
    uint counterpartTokenId
  );

  event IndexChange (
    uint indexed oldLastIdx,
    uint indexed newIdx
  );
    
  function listProposal(
    address _proposerTokenAddress,
    address _counterpartTokenAddress,
    uint _proposerTokenId,
    uint _counterpartTokenId
  ) public {
    // ERC721 ierc721 = ERC721(_proposerTokenAddress);
    
    require(isOwner(
      _proposerTokenAddress,
      _proposerTokenId
      ),
      "Proposer must be owner of proposed token");

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
    emit ProposalAdded(
      numberProposals,
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
    // return if there are no proposals
    require(numberProposals > 0, "No proposals available");
    
    // check if proposal with index exists
    require(proposals[_idx].proposerAddress != address(0), "Index does not exist");

    // check if acceptor owns the requested nft
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
    
    removeProposal(_idx);
  }

  function delistProposal(
    uint _idx
  ) public {
    require(proposals[_idx].proposerAddress == msg.sender,
      "You are not the owner of the proposed token"
    );
    removeProposal(_idx);
  }

  function removeProposal(uint _idx) internal {
    proposals[_idx] = proposals[numberProposals - 1];
    delete proposals[numberProposals - 1];
    emit IndexChange(numberProposals - 1, _idx);
    numberProposals--;
  }

  function isOwner(
    address _tokenAddress,
    uint _tokenId
  ) internal view returns(bool) {
      IERC721 erc721 = IERC721(_tokenAddress);
      address ownerAddress = erc721.ownerOf(_tokenId);

    return ownerAddress == msg.sender;
  }

  function isAllApproved(
    address _proposerTokenAddress,
    address _counterpartTokenAddress,
    uint _proposerTokenId,
    uint _counterpartTokenId
  ) internal view returns(bool) {
    return isApproved(_proposerTokenAddress, _proposerTokenId)
      && isApproved(_counterpartTokenAddress, _counterpartTokenId);
  }

  function isApproved(
    address _tokenAddress,
    uint _tokenId
  ) internal view returns(bool) {
    IERC721 erc721 = IERC721(_tokenAddress);
    address approvedAddress = erc721.getApproved(_tokenId);
    return approvedAddress == address(this);
  }

  function transfer(
    address _tokenAddress,
    address _fromAddress,
    address _toAddress,
    uint _tokenId
  ) internal returns(bool){
    IERC721 erc721 = IERC721(_tokenAddress);
    erc721.safeTransferFrom(_fromAddress, _toAddress, _tokenId);
    return true;
  }

}
