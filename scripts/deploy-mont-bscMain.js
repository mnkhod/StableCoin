const { ethers, upgrades } = require('hardhat');

async function main () {
    const montCoinContract = await ethers.getContractFactory('MontCoin');
    console.log('Deploying MontCoin to MainNet...');
    const montCoin = await upgrades.deployProxy(montCoinContract, [] , { initializer: 'initialize', kind: 'uups'})
    await montCoin.deployed();
    console.log('MontCoin deployed to:', montCoin.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
