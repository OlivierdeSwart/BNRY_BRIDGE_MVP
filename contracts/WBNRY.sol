pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/PausableToken.sol";
import "./OwnableContract.sol";
import "./BurnableToken2.sol";
import "./MintableToken2.sol";

contract WBNRY is StandardToken, DetailedERC20("Wrapped BNRY", "WBNRY", 8),
    MintableToken, BurnableToken, PausableToken, OwnableContract {

    function burn(uint value, string btcAddress) public whenNotPaused {
        super.burn(value, btcAddress);
    }

    function finishMinting() public onlyOwner returns (bool) {
        return false;
    }

    function renounceOwnership() public onlyOwner {
        revert("renouncing ownership is blocked");
    }
}