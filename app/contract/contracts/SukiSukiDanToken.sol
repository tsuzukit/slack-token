pragma solidity 0.4.19;

import 'zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

contract SukiSukiDanToken is MintableToken {
    string public name = "Suki Suki Dan Token";
    string public symbol = "SSDT";
    uint8 public decimals = 18;

    function SukiSukiDanToken(uint256 initialSupply) public {
        totalSupply_ = initialSupply;
        balances[msg.sender] = initialSupply;
    }
}