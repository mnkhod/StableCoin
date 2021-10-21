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



contract MontCoinPrototype is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, PausableUpgradeable, ERC20SnapshotUpgradeable , OwnableUpgradeable, UUPSUpgradeable {
    using SafeMath for uint256;
    uint256 private _circulatingSupply;
    mapping(address => bool) private _blacklist;
    mapping(address => bool) private _whitelist;

    function initialize() public initializer {
        __ERC20_init("PrototypeMont", "P-MONT");
        __ERC20Burnable_init();
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
        _circulatingSupply=0;
        whiteListUpdate(msg.sender,true);
    }

    function transfer(address recipient, uint256 amount) public override returns(bool){
        require (!isBlackListed(recipient), "Token transfer refused. Receiver is on blacklist");
        require (!isBlackListed(msg.sender), "Token transfer refused. Sender is on blacklist");

        _transfer(msg.sender,recipient,amount);
        return true;
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
