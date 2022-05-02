import { Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useEthContext } from "../context/EthProvider";
export default function Home() {
  const { accounts, connected, setAccounts } = useEthContext();
  const [error, setError] = useState(null);
  const connect = useCallback(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(setAccounts)
        .catch(setError);
    }
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 5000);
  }, [error]);
  if(error) {
    return <Button variant="contained" color="error">
      {error.message}
    </Button>
  }
  return (
    <div>
      <h1>Home</h1>
      {accounts.length > 0 && (
        <div>
          <h2>Accounts</h2>
          <ul>
            {accounts.map((account) => (
              <li key={account}>{account}</li>
            ))}
          </ul>
        </div>
      )}
      {connected ? (
        <Button variant="contained" disableRipple>
          Connected
        </Button>
      ) : (
        <Button variant="contained" onClick={connect}>
          Connect
        </Button>
      )}
    </div>
  );
}
