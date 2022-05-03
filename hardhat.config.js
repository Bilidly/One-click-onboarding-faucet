require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  paths: {
    artifacts: './artifacts',
  },
  networks: {
    hardhat: {
      chainId: 97
    },
    bsctest: {
      url: process.env.NEXT_PUBLIC_CHAIN_RPC,
      chainId: 97,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    },
  },
  solidity: "0.8.3"
};
