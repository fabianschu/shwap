pragma solidity ^0.7.6;

import "hardhat/console.sol";

contract Shwap {

  uint public idCounter;

  struct Proposal {
    address proposerAddress;
    address proposerTokenAddress;
    address searchedTokenAddress;
    uint proposerTokenId;
    uint searchedTokenId;
  }
  
  mapping(uint => Proposal) public proposals;
    
  function addProposal(
    address _proposerTokenAddress,
    address _searchedTokenAddress,
    uint _proposerTokenId,
    uint _searchedTokenId
  ) public {
    Proposal memory proposal = Proposal(
      msg.sender,
      _proposerTokenAddress,
      _searchedTokenAddress,
      _proposerTokenId,
      _searchedTokenId
    );
    proposals[idCounter] = proposal;
    idCounter++;
  }

  function transfer(
    address _tokenAddress,
    address _fromAddress,
    address _toAddress,
    uint _tokenId
  ) public {
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
  }

}
