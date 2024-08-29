// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract ITokenFaucet is Ownable {
    uint256 public dailyClaim = 1000 * 1e18;

    uint256 public claimInterval = 1 days;

    mapping(address => uint256) public lastClaimed;

    IERC20 public iToken;
    constructor(address _iAddress) Ownable(msg.sender) {
        iToken = IERC20(_iAddress);
    }

    error AlreadyClaimed();

    event Claimed(address _cliamer, uint256 _amount);

    function claim() external {
        if ((block.timestamp - lastClaimed[msg.sender]) < claimInterval) {
            revert AlreadyClaimed();
        }
        lastClaimed[msg.sender] = block.timestamp;
        SafeERC20.safeTransfer(iToken, msg.sender, dailyClaim);
        emit Claimed(msg.sender, dailyClaim);
    }

    function drain() external onlyOwner {
        SafeERC20.safeTransfer(iToken, owner(), iToken.balanceOf(address(this)));
    }
}