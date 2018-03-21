pragma solidity 0.4.19;

import 'zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

contract CustomToken is MintableToken {
    address[] public tokenHolders;
    string public name = "Suki Suki Dan Token";
    string public symbol = "SSDT";
    uint8 public decimals = 18;
    uint256 initialSupply = 10000e18;

    function CustomToken() public {
        totalSupply_ = initialSupply;
        balances[msg.sender] = initialSupply;
        tokenHolders.push(msg.sender);
    }

    /**
    * @dev transfer token for a specified address
    * @param _to The address to transfer to.
    * @param _value The amount to be transferred.
    */
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0));
        require(_value <= balances[msg.sender]);

        // if it is first time to take holder, insert address to holders array
        if (balances[_to] == 0)
            tokenHolders.push(_to);

        // SafeMath.sub will throw if there is not enough balance.
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        Transfer(msg.sender, _to, _value);

        return true;
    }

    function getTokenHolders() public view returns (address[]) {
        return tokenHolders;
    }
}