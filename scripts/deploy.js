const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const FaucetContract = await hre.ethers.getContractFactory("BilidlyFaucet");
  const faucet = await FaucetContract.deploy();
  await faucet.deployed();
  console.log("Faucet deployed to:", faucet.address);

  const BUSDToken = await hre.ethers.getContractFactory("BUSDToken");
  const busdToken = await BUSDToken.deploy("Binance USD", "BUSD", deployer.address, faucet.address);

  const USDCToken = await hre.ethers.getContractFactory("USDCToken");
  const usdcToken = await USDCToken.deploy("USD Circle", "USDC", deployer.address, faucet.address);

  const BETHToken = await hre.ethers.getContractFactory("BETHToken");
  const bethToken = await BETHToken.deploy("Binance ETH", "BETH", deployer.address, faucet.address);

  const BBTCToken = await hre.ethers.getContractFactory("BBTCToken");
  const bbtcToken = await BBTCToken.deploy("Binance BTC", "BBTC", deployer.address, faucet.address);
  
  const RenBTCToken = await hre.ethers.getContractFactory("RenBTCToken");
  const renbtcToken = await RenBTCToken.deploy("Ren BTC", "RenBTC", deployer.address, faucet.address);

  const ALPACAToken = await hre.ethers.getContractFactory("ALPACAToken");
  const alpacaToken = await ALPACAToken.deploy("Alpaca", "ALPACA", deployer.address, faucet.address);

  const CAKEToken = await hre.ethers.getContractFactory("CAKEToken");
  const cakeToken = await CAKEToken.deploy("Pancake Swap", "CAKE", deployer.address, faucet.address);

  await busdToken.deployed();
  await usdcToken.deployed();
  await bethToken.deployed();
  await bbtcToken.deployed();
  await renbtcToken.deployed();
  await alpacaToken.deployed();
  await cakeToken.deployed();

  console.log("BUSD deployed to:", busdToken.address);
  console.log("USDC deployed to:", usdcToken.address);
  console.log("BETH deployed to:", bethToken.address);
  console.log("BBTC deployed to:", bbtcToken.address);
  console.log("RenBTC deployed to:", renbtcToken.address);
  console.log("ALPACA deployed to:", alpacaToken.address);
  console.log("CAKE deployed to:", cakeToken.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
