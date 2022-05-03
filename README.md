![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)

### What is it?
A one-click Testnet on-ramp for Web3 projects.

**Stack: NodeJS, ReactJS, NextJS, Hardhat**

This repo is made of:
(1) A faucet smart contract and mock ERC20 tokens
(2) A boilerplate ReactJS + NextJS implementation

### Why build it?
Onboarding users to a testnet can be painful, as users need to complete multiple steps to be able to actively participate (add testnet network, get testnet native token, get protocol tokens for testing). This repo allows once-click onboarding.

### Faucet features
- Receives native blockchain token (eg ETH), send 0.1 ETH everytime it's called
- Receives ERC20 tokens, send 1% of reserve of each requested token everytime it's called
- An address must wait a determined period between each request (set to 24 hours)
- ERC20 contracts (in this repo, BUSD, USDC, RenBTC, BTCB, BETH, CAKE, ALPACA) mint half of supply to the faucet, the other half to deployer. Owner can mint new tokens anytime. 

### UI
- Prompt user to connect to web3
- Prompt user to switch to relevant network, or alternatively automatically add the network to wallet
- User can then click on a button and get sent 0.1 native blockchain token (eg ETH) and a set of ERC20 tokens determined by the faucet owner

### How to use it?
Install dependencies
```sh
cd dillinger
npm i
```

Create .env with the following variables (examples with BNB chain testnet)
```sh
PRIVATE_KEY=[your dev private key]
NEXT_PUBLIC_CHAINID=97
NEXT_PUBLIC_CHAIN_NAME="Binance Smart Chain Testnet"
NEXT_PUBLIC_CHAIN_RPC=https://data-seed-prebsc-1-s1.binance.org:8545/
NEXT_PUBLIC_CHAIN_EXPLORER=https://testnet.bscscan.com
NEXT_PUBLIC_CHAIN_TOKEN_NAME=tBNB
NEXT_PUBLIC_CHAIN_TOKEN_SYMBOL=tBNB
```

Build and test the smart contracts with Hardhat
```sh
npx hardhat test
```

Deploy contracts to testnet (example with BNB Chain testnet, modify hardhat config to deloy another network)
```sh
npx hardhat run --network bsctest scripts/deploy.js
```

Add newly deployed Faucet and tokens addresses to ethProvider.jsx

Run the app
```sh
npm run dev
```

### About Bilidly
Bilidly is a low cost AMM for pegged and volatile assets based on Andre Cronje's Solidly protocol.
| Plugin | README |
| ------ | ------ |
| Website | [https://testnet.bilidly.exchange](https://testnet.bilidly.exchange) |
| Notion | [https://bilidly.notion.site/Smart-contracts-58c7c8f4cd4d4a35a9ca44a06ac4991c](https://bilidly.notion.site/Smart-contracts-58c7c8f4cd4d4a35a9ca44a06ac4991c) |
| Telegram | [https://t.me/bilidly](https://t.me/bilidly) |
| Twitter | [https://twitter.com/bilidlyexchange](https://twitter.com/bilidlyexchange) |

### License

MIT

**Free Software, Hell Yeah!**

