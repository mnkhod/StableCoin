const { ethers, upgrades } = require('hardhat');

async function main () {
    const mnkCoinContract = await ethers.getContractFactory('MnkCoin');
    console.log('Deploying mnkCoin...');
    const mnkCoin = await upgrades.deployProxy(mnkCoinContract, [] , { initializer: 'initialize'})
    await mnkCoin.deployed();
    console.log('MnkCoin deployed to:', mnkCoin.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });