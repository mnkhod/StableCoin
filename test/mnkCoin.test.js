const { expect } = require("chai");
const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

const MnkCoinContract = artifacts.require("MntCoinPrototype");

contract("Testing Transaction Fee Functionality", function ([owner, other]) {

  beforeEach(async function () {
    this.coin = await MnkCoinContract.new({ from: owner });
    this.coin.initialize({ from: owner });
  });

  it("initial getTransactionFee() should return 0", async function () {
    expect((await this.coin.getTransactionFee()).toString()).to.equal('0');
  });

  it("testing setTransactionFee()", async function () {
      await this.coin.setTransactionFee(20);

      expect((await this.coin.getTransactionFee()).toString()).to.equal('20');
  });



  it("initial setTransactionAddress() should return owner address", async function () {
    expect((await this.coin.getTransactionAddress()).toString()).to.equal(owner);
  });

  it("testing setTransactionAddress()", async function () {
      let transactionFeeOwnerAddress = '0xcd3b766ccdd6ae721141f452c550ca635964ce71'
      await this.coin.setTransactionAddress(transactionFeeOwnerAddress);

      expect((await this.coin.getTransactionAddress()).toString()).to.equal(
        transactionFeeOwnerAddress
      );
  });




  it("testing transactionFeeAddress when transfer works", async function () {
      let transactionFeeOwnerAddress = '0xcd3b766ccdd6ae721141f452c550ca635964ce71'
      let sendPersonAddress = '0xdd2fd4581271e230360230f9337d5c0430bf44c0'
      await this.coin.setTransactionAddress(transactionFeeOwnerAddress);
      await this.coin.setTransactionFee(10);

      await this.coin.mint(owner,50);
      await this.coin.transfer(sendPersonAddress,20)

      expect((await this.coin.balanceOf(transactionFeeOwnerAddress)).toString()).to.equal('10');
      expect((await this.coin.balanceOf(sendPersonAddress)).toString()).to.equal('10');
      expect((await this.coin.balanceOf(owner)).toString()).to.equal('30');
  });

})

contract("Testing BlackList Functionality", function ([owner, other]) {

  beforeEach(async function () {
    this.coin = await MnkCoinContract.new({ from: owner });
    this.coin.initialize();
  });

  it("testing blacklistUpdate() - blacklisting a person", async function () {
      const blackListUserAddress = '0x2546bcd3c84621e976d8185a91a922ae77ecec30';
      await this.coin.blackListUpdate(blackListUserAddress,true);

      expect((await this.coin.isBlackListed(blackListUserAddress))).to.equal(true);
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
