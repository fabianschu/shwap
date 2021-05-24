pragma solidity ^0.8.4;

import "./TradeHub.sol";

contract TestTradeHub is TradeHub {
    event ApprovalConfirmation();
    event AllApprovalConfirmation();
    event OwnershipConfirmation();

    function _transfer(
        address _tokenAddress,
        address _fromAddress,
        address _toAddress,
        uint256 _tokenId
    ) public {
        transfer(_tokenAddress, _fromAddress, _toAddress, _tokenId);
    }

    function _isApproved(address _tokenAddress, uint256 _tokenId) public {
        if (isApproved(_tokenAddress, _tokenId)) {
            emit ApprovalConfirmation();
        }
    }

    function _isOwner(address _tokenAddress, uint256 _tokenId) public {
        if (isOwner(_tokenAddress, _tokenId)) {
            emit OwnershipConfirmation();
        }
    }

    function _isAllApproved(
        address _proposerTokenAddress,
        address _counterpartTokenAddress,
        uint256 _proposerTokenId,
        uint256 _counterpartTokenId
    ) public {
        if (
            isAllApproved(
                _proposerTokenAddress,
                _counterpartTokenAddress,
                _proposerTokenId,
                _counterpartTokenId
            )
        ) {
            emit AllApprovalConfirmation();
        }
    }
}
