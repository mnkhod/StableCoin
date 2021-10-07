require('dotenv').config()
require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require('hardhat-abi-exporter');
require('@openzeppelin/hardhat-upgrades');
require("@openzeppelin/test-helpers");
require("@nomiclabs/hardhat-truffle4");
require("@nomiclabs/hardhat-etherscan");


const infura_key = process.env.INFURA_SECRET_KEY
const our_mnemonic = process.env.MNEMONIC
const etherscan_key = process.env.ETHER_SCAN_KEY

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.2",
  abiExporter: {
    path: './data/abi',
    clear: true,
    flat: true,
    spacing: 2,
    pretty: true,
  },
  etherscan: {
    apiKey: etherscan_key
  },
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infura_key}`,
      accounts: { mnemonic: our_mnemonic },
    },
    bscTestNet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: { mnemonic: our_mnemonic },
    },
  },
};
