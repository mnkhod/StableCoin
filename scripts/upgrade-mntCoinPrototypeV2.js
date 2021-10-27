const { ethers, upgrades } = require('hardhat');

async function main () {
    // Upgrading

    montCoinPrototypeV2 = await ethers.getContractFactory('MontCoinPrototypeV2');
    coin2 = await upgrades.upgradeProxy("0xc4cFEe841dCCa0a672f6cBCadbAF6Fd7F38D7147", montCoinPrototypeV2);
    console.log(`Address Is At ${coin2.address}`)
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
