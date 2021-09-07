// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";



contract MnkCoin is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, PausableUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
    using SafeMath for uint256;
    uint256 private transaction_fee;
    address private transaction_address;

    function initialize() initializer public {
        __ERC20_init("MnkCoin", "MNK");
        __ERC20Burnable_init();
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
        transaction_fee=0;
        transaction_address = msg.sender;
    }

    function transfer(address recipient, uint256 amount) public override returns(bool){
        require(amount.sub(transaction_fee) > 0, "Not Enough Fee");

        uint256 realAmount = amount.sub(transaction_fee);
        _transfer(msg.sender,transaction_address,transaction_fee);
        _transfer(msg.sender,recipient,realAmount);
        return true;
    }


    function getTransactionFee() public view returns(uint) {
        return transaction_fee;
    }

    function setTransactionFee(uint fee) public onlyOwner returns(uint){
        transaction_fee = fee;
        return transaction_fee;
    }

    function getTransactionAddress() public view returns(address) {
        return transaction_address;
    }

    function setTransactionAddress(address newTransactionAddress) public onlyOwner returns(address) {
        transaction_address = newTransactionAddress;
        return transaction_address;
    }




    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
}