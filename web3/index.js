import Web3 from "web3";
import { network } from "./connector";

const getWeb3Provider = (web3context) => {
  let provider = null;
  if (!web3context) provider = network.providers["1"];
  else provider = web3context;
  if (!provider) return null;
  return new Web3(provider);
};
export { getWeb3Provider };
