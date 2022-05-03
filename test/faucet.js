const { ethers, waffle } = require("hardhat");
const { expect } = require("chai");
const provider = waffle.provider;

let owner;
let user;

it("deploy contracts", async function () {
  [owner, user] = await ethers.getSigners(2);
  faucetContract = await ethers.getContractFactory("BilidlyFaucet");
  faucet = await faucetContract.deploy();
  token = await ethers.getContractFactory("RenBTCToken");
  RenBTC = await token.deploy('RenBTC', 'RenBTC', faucet.address, owner.address);
  USDC = await token.deploy('USDC', 'USDC', faucet.address, owner.address);
  expect(await RenBTC.balanceOf(faucet.address)).to.equal(ethers.BigNumber.from("10000000000000000000"));
  expect(await RenBTC.balanceOf(owner.address)).to.equal(ethers.BigNumber.from("10000000000000000000"));
})

it("faucet receives ETH", async function () {
  expect(await provider.getBalance(faucet.address)).to.equal(ethers.BigNumber.from("0"));
  await owner.sendTransaction({
    to: faucet.address,
    value: ethers.utils.parseEther("1.0"),
  });
  expect(await provider.getBalance(faucet.address)).to.equal(ethers.BigNumber.from("1000000000000000000"));
})

it("claims token set from faucet", async function () {
  expect(await RenBTC.balanceOf(user.address)).to.equal(ethers.BigNumber.from("0"));
  expect(await provider.getBalance(user.address)).to.equal(ethers.BigNumber.from("10000000000000000000000"));
  await faucet.sendMultiTokens([RenBTC.address, USDC.address], user.address);
  expect(await RenBTC.balanceOf(user.address)).to.equal(ethers.BigNumber.from("100000000000000000"));
  expect(await provider.getBalance(user.address)).to.equal(ethers.BigNumber.from("10000100000000000000000"));
})

it("Cannot claim again within limit", async function () {
  await expect(faucet.sendMultiTokens([RenBTC.address, USDC.address], user.address)).to.be.reverted;
})
