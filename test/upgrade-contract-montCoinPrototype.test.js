const { ethers, upgrades } = require('hardhat');


describe('Mont Coin Prototype Testing Contract Upgrade', function () {

  before(async function () {
    this.montCoinPrototype = await ethers.getContractFactory('MontCoinPrototype');
    this.montCoinPrototypeV2 = await ethers.getContractFactory('MontCoinPrototypeV2');
  });

  beforeEach(async function () {
    this.coin = await upgrades.deployProxy(this.montCoinPrototype,{kind:'uups'});
  });

  it('testing circulating supply', async function () {
    expect((await this.coin.getCirculatingSupply()).toString()).to.equal('0');
  });

  it('upgrading to v2', async function () {
    this.coin2 = await upgrades.upgradeProxy(this.coin, this.montCoinPrototypeV2);
    expect(await this.coin2.odko() == true)
  });


});
