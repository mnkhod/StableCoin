// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20SnapshotUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";



contract MntCoinPrototype is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, PausableUpgradeable, ERC20SnapshotUpgradeable , OwnableUpgradeable, UUPSUpgradeable {
    using SafeMath for uint256;
    uint256 private _transaction_fee;
    address private _transaction_address;
    uint256 private _circulatingSupply;
    mapping(address => bool) private _blacklist;
    mapping(address => bool) private _whitelist;

    function initialize() public initializer {
        __ERC20_init("MntCoinPrototype", "MNTC-PROTOTYPE");
        __ERC20Burnable_init();
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
        _transaction_fee=0;
        _circulatingSupply=0;
        _transaction_address = msg.sender;
        whiteListUpdate(msg.sender,true);
    }

    function transfer(address recipient, uint256 amount) public override returns(bool){
        require(amount.sub(_transaction_fee) > 0, "Not Enough Fee");
        require (!isBlackListed(recipient), "Token transfer refused. Receiver is on blacklist");

        uint256 realAmount = amount.sub(_transaction_fee);
        _transfer(msg.sender,_transaction_address,_transaction_fee);
        _transfer(msg.sender,recipient,realAmount);
        return true;
    }


    function getTransactionFee() public view returns(uint) {
        return _transaction_fee;
    }

    event TransactionFeeUpdate(uint oldFee, uint newFee);
    function setTransactionFee(uint fee) public onlyOwner returns(uint){
        emit TransactionFeeUpdate(_transaction_fee, fee);
        _transaction_fee = fee;
        return _transaction_fee;
    }

    function getTransactionAddress() public view returns(address) {
        return _transaction_address;
    }

    function setTransactionAddress(address newTransactionAddress) public onlyOwner returns(address) {
        require(newTransactionAddress != address(0), "new transaction address is 0");
        _transaction_address = newTransactionAddress;
        return _transaction_address;
    }

    function isBlackListed(address user) public view returns (bool) {
        return _blacklist[user];
    }

    function blackListUpdate(address user, bool value) public virtual onlyOwner {
        _blacklist[user] = value;
    }

    function isWhiteList(address user) public view returns (bool) {
        return _whitelist[user];
    }

    function whiteListUpdate(address user, bool value) public virtual onlyOwner {
        _whitelist[user] = value;
    }



    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }


    function getCirculatingSupply() public view returns(uint) {
        return _circulatingSupply;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require (isWhiteList(to), "Token mint refused. Address is not on whitelist");
        _mint(to, amount);
        _circulatingSupply = _circulatingSupply.add(amount);
    }

    function burn(uint256 amount) public onlyOwner override{
        _burn(msg.sender, amount);
        _circulatingSupply = _circulatingSupply.sub(amount);
    }

    function snapshot() public onlyOwner {
        _snapshot();
    }

    // Hooks
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override(ERC20Upgradeable, ERC20SnapshotUpgradeable)
    {
        super._beforeTokenTransfer(from, to, amount);
    }


    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
}
