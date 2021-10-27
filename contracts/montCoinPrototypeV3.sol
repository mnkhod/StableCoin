// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;


import "./montCoinPrototype.sol";

contract MontCoinPrototypeV3 is MontCoinPrototype {
    uint256 private _loyaltyPoints;

    function getLoyalPoints() public view returns(uint) {
        return _loyaltyPoints;
    }

    function setLoyalPoints(uint256 value) public virtual onlyOwner {
        _loyaltyPoints = value;
    }

}
