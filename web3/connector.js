import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [parseInt(process.env.NEXT_PUBLIC_CHAINID)]
});

const RPC_URLS = {
  56: "https://bsc-dataseed.binance.org/",
  97: "https://data-seed-prebsc-1-s1.binance.org:8545"
};

let obj = {}
if(process.env.NEXT_PUBLIC_CHAINID == 56) {
  obj = { 56: RPC_URLS[56] }
} else {
  obj = { 97: RPC_URLS[97] }
}

export const network = new NetworkConnector({ urls: obj });
