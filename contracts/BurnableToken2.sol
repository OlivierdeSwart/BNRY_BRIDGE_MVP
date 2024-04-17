pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/BasicToken.sol";

/**
 * @title Burnable Token
 * @dev Token that can be irreversibly burned (destroyed).
 */
contract BurnableToken is BasicToken {

  event Burn(address indexed burner, uint256 value, string btcAddress);

  /**
   * @dev Burns a specific amount of tokens.
   * @param _value The amount of token to be burned.
   * @param _btcAddress The BTC address to be associated with the burn.
   */
  function burn(uint256 _value, string _btcAddress) public {
    require(bytes(_btcAddress).length >= 26 && bytes(_btcAddress).length <= 35, "Invalid BTC address");
    _burn(msg.sender, _value, _btcAddress);
  }

  function _burn(address _who, uint256 _value, string _btcAddress) internal {
    // Check if the sender has enough WBNRY to burn
    require(_value <= balances[_who]);
    // Check if the BTC address is valid
    require(bytes(_btcAddress).length >= 26 && bytes(_btcAddress).length <= 35, "Invalid BTC address");
    // Check for spaces in the Bitcoin address
    for(uint i = 0; i < bytes(_btcAddress).length; i++) {
        require(bytes(_btcAddress)[i] != 0x20, "BTC address should not contain spaces");
    }
    
    // no need to require value <= totalSupply, since that would imply the
    // sender's balance is greater than the totalSupply, which *should* be an assertion failure
    balances[_who] = balances[_who].sub(_value);
    totalSupply_ = totalSupply_.sub(_value);
    emit Burn(_who, _value, _btcAddress);
    emit Transfer(_who, address(0), _value);
  }
}