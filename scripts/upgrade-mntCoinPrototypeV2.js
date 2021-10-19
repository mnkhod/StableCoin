const { ethers, upgrades } = require('hardhat');

async function main () {
    // Upgrading
    const mnkCoinContractV2 = await ethers.getContractFactory('MntCoinPrototype');
    const upgraded = await upgrades.upgradeProxy("0xD54FB5b7C47D8c17f30aEa3Bae8155D2D22EC70b",mnkCoinContractV2,[],{ initializer: 'initialize'});
    console.log('MntCoinPrototype deployed to:', upgraded.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
