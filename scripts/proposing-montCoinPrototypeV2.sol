const { ethers, upgrades } = require('hardhat');

async function main () {
    const proxyAddress = '0x7f3b7419A6688fd027807E78a5aF4A0C92647888';
    const montCoinPrototypeV2 = await ethers.getContractFactory('MontCoinPrototypeV2');

    const proposal = await defender.proposeUpgrade(proxyAddress, montCoinPrototypeV2,{
      multisig : '0x136e08F59d4e77DCB30017Ea2000BC8DBb2b4797',
    });
    console.log("Upgrade proposal created at:", proposal.url);

  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
