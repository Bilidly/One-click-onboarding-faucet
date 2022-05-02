import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import EthProvider, { useEthContext } from "../context/EthProvider";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const [showing, setShowing] = useState(false);
  useEffect(() => {
    setShowing(true);
  }, []);
  if (!showing) {
    return null;
  }
  if (typeof window !== "undefined") {
    return (
      <EthProvider>
        <div>
          <Dialog />
          <Component {...pageProps} />
        </div>
      </EthProvider>
    );
  } else {
    return (
      <div>
        <Component {...pageProps} />
      </div>
    );
  }
}

const Dialog = () => {
  const { chainId = "", connected } = useEthContext();
  return window.ethereum &&
    parseInt(chainId?.split("0x")[1], 16) !==
      parseInt(process.env.NEXT_PUBLIC_CHAINID)
    ? connected && <Modal />
    : "";
};

export default MyApp;
