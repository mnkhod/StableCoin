const { ethers, upgrades } = require('hardhat');

async function main () {
    const mnkCoinContract = await ethers.getContractFactory('MntCoinPrototype');
    console.log('Deploying MntCoinPrototype...');
    const mnkCoin = await upgrades.deployProxy(mnkCoinContract, [] , { initializer: 'initialize'})
    await mnkCoin.deployed();
    console.log('MntCoinPrototype deployed to:', mnkCoin.address);

    // Upgrading
    const mnkCoinContractV2 = await ethers.getContractFactory('MntCoinPrototype');
    const upgraded = await upgrades.upgradeProxy(mnkCoin.address,mnkCoinContractV2)
    
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
