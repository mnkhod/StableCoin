const { expect } = require("chai");
const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

const MnkCoinContract = artifacts.require("MontCoinPrototype");

contract("Testing BlackList Functionality", function ([owner, other]) {

  beforeEach(async function () {
    this.coin = await MnkCoinContract.new({ from: owner });
    this.coin.initialize();
  });

  it("testing blacklistUpdate() - blacklisting a person - reciever", async function () {
      const recieverAddress = '0x2546bcd3c84621e976d8185a91a922ae77ecec30';

      await this.coin.whiteListUpdate(owner,true);
      await this.coin.mint(owner,200);

      await this.coin.blackListUpdate(recieverAddress,true);
      expect((await this.coin.isBlackListed(recieverAddress))).to.equal(true);
      await expectRevert(this.coin.transfer(recieverAddress,200), 'Token transfer refused. Receiver is on blacklist',);
  });

  it("testing blacklistUpdate() - blacklisting a person - sender", async function () {
      const recieverAddress = '0x2546bcd3c84621e976d8185a91a922ae77ecec30';

      await this.coin.whiteListUpdate(owner,true);
      await this.coin.mint(owner,200);

      await this.coin.blackListUpdate(owner,true);
      expect((await this.coin.isBlackListed(owner))).to.equal(true);
      await expectRevert(this.coin.transfer(recieverAddress,200), 'Token transfer refused. Sender is on blacklist',);
  });

  it("testing blacklistUpdate() - unblacklisting a person", async function () {
      const blackListUserAddress = '0x2546bcd3c84621e976d8185a91a922ae77ecec30';
      await this.coin.blackListUpdate(blackListUserAddress,true);

      await this.coin.blackListUpdate(blackListUserAddress,false);

      expect((await this.coin.isBlackListed(blackListUserAddress))).to.equal(false);
  });

  it("testing isBlackListed()", async function () {
      const blackListUserAddress = '0x2546bcd3c84621e976d8185a91a922ae77ecec30';
      await this.coin.blackListUpdate(blackListUserAddress,true);
      expect((await this.coin.isBlackListed(blackListUserAddress))).to.equal(true);

      await this.coin.blackListUpdate(blackListUserAddress,false);
      expect((await this.coin.isBlackListed(blackListUserAddress))).to.equal(false);
  });

})

contract("Testing getCirculatingSupply() ", function ([owner, other]) {

  beforeEach(async function () {
    this.coin = await MnkCoinContract.new({ from: owner });
    this.coin.initialize();
  });

  it("testing mint - getCirculatingSupply() - should increase", async function () {
      const mintAddress = '0x2546bcd3c84621e976d8185a91a922ae77ecec30';
      await this.coin.whiteListUpdate(mintAddress,true);

      await this.coin.mint(mintAddress,200);
      expect((await this.coin.getCirculatingSupply()).toString()).to.equal('200');
  });

  it("testing burn - getCirculatingSupply() - should decrease", async function () {
      await this.coin.mint(owner,200);
      expect((await this.coin.getCirculatingSupply()).toString()).to.equal('200');

      await this.coin.burn(200);
      expect((await this.coin.getCirculatingSupply()).toString()).to.equal('0');
  });

})

contract("Testing Pause Functionality", function ([owner, other]) {

  beforeEach(async function () {
    this.coin = await MnkCoinContract.new({ from: owner });
    this.coin.initialize();
  });

  it("testing pause()", async function () {
      await this.coin.pause();
      
      await expectRevert( this.coin.burn(200), 'Pausable: paused',);
      await expectRevert( this.coin.mint(owner,200), 'Pausable: paused',);
  });

  it("testing unPause()", async function () {
      await this.coin.pause();
      
      await expectRevert( this.coin.burn(200), 'Pausable: paused',);
      await expectRevert( this.coin.mint(owner,200), 'Pausable: paused',);

      await this.coin.unpause();

      await this.coin.mint(owner,200);
      expect((await this.coin.getCirculatingSupply()).toString()).to.equal('200');

      await this.coin.burn(200);
      expect((await this.coin.getCirculatingSupply()).toString()).to.equal('0');
  });

})


contract("Testing WhiteList", function ([owner, other]) {

  beforeEach(async function () {
    this.coin = await MnkCoinContract.new({ from: owner });
    this.coin.initialize();
  });

  it("owner must be in whitelist at initialize", async function () {
      expect((await this.coin.isWhiteList(owner))).to.equal(true);

      await this.coin.mint(owner,200);
      expect((await this.coin.balanceOf(owner)).toString()).to.equal('200');
  });

  it("testing isWhiteList()", async function () {
      const mintAddress = '0x2546bcd3c84621e976d8185a91a922ae77ecec30';
      await expectRevert( this.coin.mint(mintAddress,200), 'Token mint refused. Address is not on whitelist',);

      expect((await this.coin.isWhiteList(mintAddress))).to.equal(false);
      await this.coin.whiteListUpdate(mintAddress,true);
      expect((await this.coin.isWhiteList(mintAddress))).to.equal(true);
  });

  it("testing whiteListUpdate()", async function () {
      const mintAddress = '0x2546bcd3c84621e976d8185a91a922ae77ecec30';

      await this.coin.whiteListUpdate(mintAddress,true);
      expect((await this.coin.isWhiteList(mintAddress))).to.equal(true);
      await this.coin.whiteListUpdate(mintAddress,false);
      expect((await this.coin.isWhiteList(mintAddress))).to.equal(false);
  });


})
