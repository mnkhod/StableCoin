const { ethers, upgrades } = require('hardhat');

async function main () {
  const gnosisSafe = '0x136e08F59d4e77DCB30017Ea2000BC8DBb2b4797';

  console.log('Transferring ownership of ProxyAdmin...');
  // The owner of the ProxyAdmin can upgrade our contracts
  await upgrades.admin.changeAdminForProxy("0x7f3b7419A6688fd027807E78a5aF4A0C92647888",gnosisSafe);
  console.log('Transferred ownership of ProxyAdmin to:', gnosisSafe);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
