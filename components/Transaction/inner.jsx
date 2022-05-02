import React, { Component, useState, useEffect } from "react";
import { Typography, Button, CircularProgress, Tooltip } from "@mui/material";
import classes from "./transaction.module.css";

import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PauseIcon from "@mui/icons-material/Pause";
import { useEthContext } from "../../context/EthProvider";
let isTestnet = process.env.NEXT_PUBLIC_CHAINID == 97;


function formatAddress(address, length = "short") {
  if (!address) return "";
  if (length === "short") {
    return (
      address.substring(0, 6) +
      "..." +
      address.substring(address.length - 4, address.length)
    );
  } else if (length === "long") {
    return (
      address.substring(0, 12) +
      "..." +
      address.substring(address.length - 8, address.length)
    );
  }
}

// URLS
let scan = "https://bscscan.com/";

if (isTestnet) {
  scan = "https://testnet.bscscan.com/";
}

const ETHERSCAN_URL = scan;

export default function Transaction({ transaction }) {
  const [expanded, setExpanded] = useState(false);
  const { data } = useEthContext()
  const mapStatusToIcon = (status) => {
    switch (status) {
      case "WAITING":
        return <PauseIcon className={classes.orangeIcon} />;
      case "PENDING":
        return <HourglassEmptyIcon className={classes.greenIcon} />;
      case "SUBMITTED":
        return <HourglassFullIcon className={classes.greenIcon} />;
      case "CONFIRMED":
        return <CheckCircleIcon className={classes.greenIcon} />;
      case "REJECTED":
        return <ErrorIcon className={classes.redIcon} />;
      case "DONE":
        return <CheckCircleIcon className={classes.greenIcon} />;
      default:
        return "";
    }
  };

  const mapStatusToTootip = (status) => {
    switch (status) {
      case "WAITING":
        return "Transaction will be submitted once ready";
      case "PENDING":
        return "Transaction is pending your approval in your wallet";
      case "SUBMITTED":
        return "Transaction has been submitted to the blockchain and we are waiting on confirmation.";
      case "CONFIRMED":
        return "Transaction has been confirmed by the blockchain.";
      case "REJECTED":
        return "Transaction has been rejected.";
      default:
        return "";
    }
  };

  const onExpendTransaction = () => {
    setExpanded(!expanded);
  };

  const onViewTX = () => {
    window.open(`${ETHERSCAN_URL}tx/${transaction.txHash}`, "_blank");
  };

  return (
    <div className={classes.transaction} key={transaction?.uuid}>
      <div className={classes.transactionInfo} onClick={onExpendTransaction}>
        <Typography className={classes.transactionDescription}>
          {transaction?.description}
        </Typography>
        {
          transaction?.status && <Tooltip title={mapStatusToTootip(transaction?.status)}>
          {mapStatusToIcon(transaction?.status)}
        </Tooltip>
        }
      </div>
      {expanded && (
        <div className={classes.transactionExpanded}>
          {transaction?.txHash && (
            <div className={classes.transaactionHash}>
              <Typography color="textSecondary">
                {formatAddress(transaction?.txHash, "long")}
              </Typography>
              <Button onClick={onViewTX}>View in Explorer</Button>
            </div>
          )}
          {transaction?.error && (
            <Typography className={classes.errorText}>
              {transaction?.error}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
}
