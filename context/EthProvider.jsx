import React, { createContext, useState, useContext, useEffect } from "react";

const EthContext = createContext({
  accounts: [],
  loading: true,
  connected: false,
  chainId: null,
  setAccounts: () => {},
});
EthContext.displayName = "EthContext";
export const useEthContext = () => useContext(EthContext);

const EthProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [connected, setConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
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
      }
      window.ethereum.on("accountsChanged", updateAccount);
      window.removeEventListener("ethereum#initialized", updateAccount);
      window.addEventListener("ethereum#initialized", updateAccount, {
        once: true,
      });
      window.ethereum.on("chainChanged", setChainId);
    }
  }, []);
  return (
    <EthContext.Provider value={{ accounts, connected, chainId, setAccounts }}>
      {children}
    </EthContext.Provider>
  );
};

export default EthProvider;
