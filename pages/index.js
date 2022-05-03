import { Button, CircularProgress, Container } from "@mui/material";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { useEthContext } from "../context/EthProvider";
import classes from "../styles/Home.module.css";
export default function Home() {
  const { accounts, connected, setAccounts, useFaucet, faucetLoading } =
    useEthContext();
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
  if (error) {
    return (
      <Button variant="contained" color="error">
        {error.message}
      </Button>
    );
  }
  return (
    <div>
      <Head>
        <link
          rel="preload"
          href="/fonts/MonumentExt/MonumentExtended-Regular.otf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/MonumentExt/MonumentExtended-Bold.otf"
          as="font"
          crossOrigin=""
        />
        <link rel="stylesheet" href="/fonts/MonumentExt/Monument.css" />
      </Head>
      <Container>
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
          <Button
            onClick={useFaucet}
            className={classes.buttonFaucet}
            disabled={faucetLoading}
          >
            {faucetLoading ? `Requesting tokens` : `Get testnet token set`}
            {faucetLoading && (
              <CircularProgress size={10} className={classes.loadingCircle} />
            )}
          </Button>
        ) : (
          <Button
            onClick={connect}
            className={classes.buttonFaucet}
            disabled={faucetLoading}
          >
            Connect
          </Button>
        )}
      </Container>
    </div>
  );
}
