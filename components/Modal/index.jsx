import React from "react";
import { SvgIcon, Typography, Button } from "@mui/material";
import classes from "./Modal.module.css";
const switchChain = async () => {
  const hexChain = "0x" + Number(process.env.NEXT_PUBLIC_CHAINID).toString(16);
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexChain }],
    });
  } catch (switchError) {
    console.log(switchError);
  }
};

function WrongNetworkIcon(props) {
  return (
    <SvgIcon viewBox="0 0 64 64" strokeWidth="1" {...props}>
      <g strokeWidth="2" transform="translate(0, 0)"><path fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="square" strokeMiterlimit="10" d="M33.994,42.339 C36.327,43.161,38,45.385,38,48c0,3.314-2.686,6-6,6c-2.615,0-4.839-1.673-5.661-4.006" strokeLinejoin="miter"></path> <path fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="square" strokeMiterlimit="10" d="M47.556,32.444 C43.575,28.462,38.075,26,32,26c-6.075,0-11.575,2.462-15.556,6.444" strokeLinejoin="miter"></path> <path fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="square" strokeMiterlimit="10" d="M59.224,21.276 C52.256,14.309,42.632,10,32,10c-10.631,0-20.256,4.309-27.224,11.276" strokeLinejoin="miter"></path> <line data-color="color-2" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="square" strokeMiterlimit="10" x1="10" y1="54" x2="58" y2="6" strokeLinejoin="miter"></line></g>
      </SvgIcon>
  );
}

const addChain = async () => {
  let hexChain = "0x" + Number(process.env.NEXT_PUBLIC_CHAINID).toString(16);
  const params = {
    chainId: hexChain, // A 0x-prefixed hexadecimal string
    chainName: process.env.NEXT_PUBLIC_CHAIN_NAME,
    nativeCurrency: {
      name: process.env.NEXT_PUBLIC_CHAIN_TOKEN_NAME,
      symbol: process.env.NEXT_PUBLIC_CHAIN_TOKEN_SYMBOL, // 2-6 characters long
      decimals: 18,
    },
    rpcUrls: [process.env.NEXT_PUBLIC_CHAIN_RPC],
    blockExplorerUrls: [process.env.NEXT_PUBLIC_CHAIN_EXPLORER],
  };

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [params],
    });
  } catch (switchError) {
    console.log("switch error", switchError);
  }
};

const Modal = () => {
  return (
    <div className={classes.chainInvalidError}>
      <div className={classes.ErrorContent}>
        <WrongNetworkIcon className={classes.networkIcon} />
        <Typography className={classes.ErrorTxt}>
          Switch to{" "}
          {process.env.NEXT_PUBLIC_CHAINID == "97"
            ? "BSC Testnet"
            : "BSC Mainnet"}{" "}
          <br /> or add it to your wallet networks.
        </Typography>
        <Button
          className={classes.switchNetworkBtn}
          variant="contained"
          onClick={() => switchChain()}
        >
          Switch to{" "}
          {process.env.NEXT_PUBLIC_CHAINID == "97"
            ? "BSC Testnet"
            : "BSC Mainnet"}
        </Button>
        <Button
          className={classes.switchNetworkBtn}
          variant="contained"
          onClick={() => addChain()}
        >
          Add{" "}
          {process.env.NEXT_PUBLIC_CHAINID == "97"
            ? "BSC Testnet"
            : "BSC Mainnet"}{" "}
          to wallet
        </Button>
      </div>
    </div>
  );
};

export default Modal;
