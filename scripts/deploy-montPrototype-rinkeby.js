const { ethers, upgrades } = require('hardhat');

async function main () {
    const mnkCoinContract = await ethers.getContractFactory('MontCoinPrototype');
    console.log('Deploying MontCoinPrototype to Rinkeby...');
  const mnkCoin = await upgrades.deployProxy(mnkCoinContract, [] , { initializer: 'initialize',kind: 'uups'})
    await mnkCoin.deployed();
    console.log('MontCoinPrototype deployed to:', mnkCoin.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
