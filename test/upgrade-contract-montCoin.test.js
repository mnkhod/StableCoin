const { ethers, upgrades } = require('hardhat');


describe('Mont Coin Testing Contract Upgrade', function () {

  before(async function () {
    this.montCoin = await ethers.getContractFactory('MontCoin');
    this.montCoinPrototypeV2 = await ethers.getContractFactory('MontCoinPrototypeV2');
  });

  beforeEach(async function () {
    this.coin = await upgrades.deployProxy(this.montCoin,{kind:'uups'});
  });

  it('testing circulating supply', async function () {
    expect((await this.coin.getCirculatingSupply()).toString()).to.equal('0');
  });

  it('upgrading to v2', async function () {
    this.coin2 = await upgrades.upgradeProxy(this.coin, this.montCoinPrototypeV2);
    expect(await this.coin2.odko() == true)
  });


});
