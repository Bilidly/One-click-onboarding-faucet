import React, { createContext, useState, useContext, useEffect } from "react";
import { getWeb3Provider } from "../web3";
import { injected } from "../web3/connector";
import Greeter from "../artifacts/contracts/Greeter.sol/Greeter.json";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { BigNumber } from "bignumber.js";
const EthContext = createContext({
  accounts: [],
  loading: true,
  connected: false,
  chainId: null,
  popup: {},
  data: {},
  setAccounts: () => {},
  useFucet: () => {},
  fucetLoading: false,
});
EthContext.displayName = "EthContext";
export const useEthContext = () => useContext(EthContext);
const ABI_TOKEN = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const BUSD_ADDRESS = "0x4df462774bc8f79e96ed0633f2cd8b3526dc960a";
const USDC_ADDRESS = "0xea022b43d76fd19f80790c674674436060884084";
const ALPACA_ADDRESS = "0x805429aa16b52a0fde69ccfd5c23ba394374078a";
const CAKE_ADDRESS = "0xd8215b742f9825071ad318b54539dd20a62d8839";
const BETH_ADDRESS = "0xd46ab0a9bfd56fffaf5f31dec12f4d17bac0d77a";
const BBTC_ADDRESS = "0xf742dc29844cc43524365fe2c438cda8493a71af";
const RENBTC_ADDRESS = "0xa3746e22af7ffc9f85d10ba2767d0d036dbb8e5f";
const EthProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [popup, setPopup] = useState({});
  const [fucetLoading, setFucetLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [web3Context, setWeb3Context] = useState(null);
  const [data, setData] = useState({ status: "WAITING" });
  const configureWeb3 = async () => {
    injected.isAuthorized().then((isAuthorized) => {
      const { supportedChainIds } = injected;
      const { chainId = process.env.NEXT_PUBLIC_CHAINID } =
        window.ethereum || window.BinanceChain || {};
      const parsedChainId = parseInt(chainId, 16);

      const isChainSupported = supportedChainIds.includes(parsedChainId);
      if (isAuthorized && isChainSupported) {
        injected.activate().then((a) => {
          setConnected(true);
          setChainId(chainId);
          setAccounts([a.account]);
          setWeb3Context(a.provider);
        });
      } else {
        if (!isChainSupported) {
          setChainId(null);
        }
      }
    });
  };
  useEffect(()=> {
    console.log("useEffect", fucetLoading)
  },[fucetLoading])
  const useFucet = async () => {
    if (accounts.length > 0) {
      setFucetLoading(true);
      const web3 = getWeb3Provider(web3Context);
      const testnetTokenTXID = uuidv4();
      const gasPrice = await getGasPrice();
      const tokenContract = new web3?.eth.Contract(Greeter.abi, ABI_TOKEN);
      setPopup({
        title: `Request fund from faucet`,
        verb: "Received faucet tokens",
        transactions: [
          {
            uuid: testnetTokenTXID,
            description: `Requesting BUSD, USDC, BETH, BBTC, RenBTC, CAKE, ALPACA`,
            status: "WAITING",
          },
        ],
      });
      await _callContractWait(
        web3,
        tokenContract,
        "greet",
        [],
        accounts[0],
        gasPrice,
        testnetTokenTXID,
        async (err) => {
          if (err) {
            toast.error(err);
          }
        }
      );
      setFucetLoading(false);
    }
  };

  const _callContractWait = async (
    web3,
    contract,
    method,
    params,
    account,
    gasPrice,
    uuid,
    callback,
    sendValue = null
  ) => {
    setData({ status: "PENDING", uuid });
    try {
      const gasAmount = await contract.methods[method](...params).estimateGas({
        from: accounts[0],
        value: sendValue,
      });
      let sendGasAmount = BigNumber(gasAmount).times(1.5).toFixed(0);
      let sendGasPrice = BigNumber(gasPrice).times(1.5).toFixed(0);
      await contract.methods[method](...params)
        .send({
          from: accounts[0],
          gasPrice: web3.utils.toWei(sendGasPrice, "gwei"),
          gas: sendGasAmount,
          value: sendValue,
        })
        .on("transactionHash", function (txHash) {
          setData({ uuid, txHash, status: "SUBMITTED" });
        })
        .on("receipt", function (receipt) {
          setData({
            uuid,
            txHash: receipt.transactionHash,
            status: "CONFIRMED",
          });
          callback(null, receipt.transactionHash);
        })
        .on("error", function (error) {
          // console.log(error);
          throw error;
        });
    } catch (error) {
      console.error(error);
      if (!error.toString().includes("-32601")) {
        if (error.message) {
          setData({ uuid, error: error.message, status: "REJECTED" });
          return callback(error.message);
        }
        setData({ uuid, error: error, status: "REJECTED" });
        callback(error);
      }
      if (error.message) {
        setData({ uuid, error: error.message, status: "REJECTED" });
        return callback(error.message);
      }
      setData({ uuid, error: error, status: "REJECTED" });
      callback(error);
    }
  };

  const getGasPrice = async () => {
    try {
      const web3 = getWeb3Provider(web3Context);
      const gasPrice = await web3.eth.getGasPrice();
      const gasPriceInGwei = web3.utils.fromWei(gasPrice, "gwei");
      return gasPriceInGwei;
    } catch (e) {
      console.log(e);
      return {};
    }
  };

  // const web3Provider =
  useEffect(() => {
    const updateAccount = (a) => {
      setAccounts(a);
      if (a?.length > 0) {
        setConnected(true);
      } else {
        setConnected(false);
      }
    };
    if (typeof window !== "undefined" && window.ethereum) {
      setChainId(window.ethereum.chainId);
      if (window.ethereum.selectedAddress) {
        setAccounts([window.ethereum.selectedAddress]);
        setConnected(true);
      }
      configureWeb3();
      window.ethereum.on("accountsChanged", updateAccount);
      window.removeEventListener("ethereum#initialized", updateAccount);
      window.addEventListener("ethereum#initialized", updateAccount, {
        once: true,
      });
      window.ethereum.on("chainChanged", configureWeb3);
    }
  }, []);

  return (
    <EthContext.Provider
      value={{
        accounts,
        connected,
        fucetLoading,
        chainId,
        setAccounts,
        data,
        popup,
        useFucet
      }}
    >
      {children}
    </EthContext.Provider>
  );
};

export default EthProvider;
