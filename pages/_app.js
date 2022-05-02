import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import EthProvider, { useEthContext } from "../context/EthProvider";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import Transaction from "../components/Transaction";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "@mui/material";
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
          <ToastContainer />
          <Dialog />
          <Container sx={{
            py: 3,
          }}>
          <Transaction />
          </Container>
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
    parseInt(chainId, 16) !== parseInt(process.env.NEXT_PUBLIC_CHAINID)
    ? connected && <Modal />
    : "";
};

export default MyApp;
