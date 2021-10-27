const { ethers, upgrades } = require('hardhat');

async function main () {
    const proxyAddress = '0xc4cFEe841dCCa0a672f6cBCadbAF6Fd7F38D7147';
    const montCoinPrototypeV3 = await ethers.getContractFactory('MontCoinPrototypeV3');

    const proposal = await defender.proposeUpgrade(proxyAddress, montCoinPrototypeV3,{
      multisig : '0x45cb74b591E12cC46620e910Ac0d6177Ed1a595C',
      title: 'Upgrading to Version-3'
    });
    console.log("Upgrade proposal created at:", proposal.url);

  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
