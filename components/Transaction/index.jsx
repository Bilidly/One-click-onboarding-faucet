import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Typography,
  DialogContent,
  Dialog,
  Slide,
  IconButton,
  Badge,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CloseIcon from "@mui/icons-material/Close";
import Lottie from "lottie-react";
import successAnim from "./success.json";
import Transaction from "./inner";
import ListIcon from "@mui/icons-material/List";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" {...props} ref={ref} />
));

import classes from "./transaction.module.css";
import { useEthContext } from "../../context/EthProvider";
let isTestnet = process.env.NEXT_PUBLIC_CHAINID == 97;

let scan = "https://bscscan.com/";

if (isTestnet) {
  scan = "https://testnet.bscscan.com/";
}

const ETHERSCAN_URL = scan;

export default function TransactionQueue() {
  const [transactionQueueLength, setQueueLength] = useState(0);
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [purpose, setPurpose] = useState(null);
  const [type, setType] = useState(null);
  const [action, setAction] = useState(null);
  const { data, popup } = useEthContext();
  const handleClose = () => {
    setOpen(false);
  };

  const fullScreen = window.innerWidth < 576;
  const transactionAdded = useCallback(() => {
    setPurpose(popup.title);
    setType(popup.type);
    setAction(popup.verb);
    setOpen(true);
    const txs = [...popup.transactions];
    setTransactions(txs);
    setQueueLength(popup.transactions.length);
  }, [data, popup]);

  const transactionPending = useCallback(() => {
    let txs = popup?.transactions?.map((tx) => {
      return tx.uuid === data.uuid
        ? {
            ...tx,
            description: tx.description || data.description,
            status: "PENDING",
          }
        : tx;
    });
    setTransactions(txs);
  }, [data, popup]);

  const transactionSubmitted = useCallback(() => {
    let txs = popup?.transactions?.map((tx) => {
      return tx.uuid === data.uuid
        ? {
            ...tx,
            description: tx.description || data.description,
            txHash: data.txHash,
            status: "SUBMITTED",
          }
        : tx;
    });
    setTransactions(txs);
  }, [data, popup]);

  const transactionConfirmed = useCallback(() => {
    let txs = popup?.transactions?.map((tx) => {
      return tx.uuid === data.uuid
        ? {
            ...tx,
            description: tx.description || data.description,
            txHash: data.txHash,
            status: "CONFIRMED",
          }
        : tx;
    });
    setTransactions(txs);
  },[data, popup]);

  const transactionRejected = useCallback(() => {
    let txs = popup?.transactions?.map((tx) => {
      if (tx.uuid === data.uuid) {
        tx.status = "REJECTED";
        tx.description = data.description || tx.description;
        tx.error = data.error;
      }
      return tx.uuid === data.uuid
        ? {
            ...tx,
            description: tx.description || data.description,
            error: data.error,
            status: "REJECTED",
          }
        : tx;
    });
    setTransactions(txs);
  }, [data, popup]);
  const transactionStatus = useCallback(() => {
    let txs = popup?.transactions?.map((tx) => {
      return tx.uuid === data.uuid
        ? {
            ...tx,
            description: tx.description || data.description,
            status: data.status,
          }
        : tx;
    });
    setTransactions(txs);
  }, [data, popup]);
  const functions = useMemo(
    () => ({
      PENDING: transactionPending,
      SUBMITTED: transactionSubmitted,
      CONFIRMED: transactionConfirmed,
      REJECTED: transactionRejected,
      ADDED: transactionAdded,
      WAITING: transactionStatus,
    }),
    [data, popup]
  );
  useEffect(() => {
    functions?.[data?.status]?.();
  }, [data, popup]);
  const renderDone = (txs) => {
    if (
      !(
        transactions &&
        transactions.filter((tx) => {
          return ["DONE", "CONFIRMED"].includes(tx.status);
        }).length === transactions.length
      )
    ) {
      return null;
    }

    let lottie = (
      <Lottie
        loop={false}
        className={classes.animClass}
        animationData={successAnim}
      />
    );

    return (
      <div className={classes.successDialog}>
        {lottie}
        <Typography className={classes.successTitle}>
          {action ? action : "Transaction Successful!"}
        </Typography>
        <Typography className={classes.successText}>
          Transaction has been confirmed by the blockchain.
        </Typography>
        {txs &&
          txs.length > 0 &&
          txs
            .filter((tx) => {
              return tx.txHash != null;
            })
            .map((tx, idx) => {
              return (
                <Typography
                  className={classes.viewDetailsText}
                  key={`tx_key_${idx}`}
                >
                  <a href={`${ETHERSCAN_URL}tx/${tx?.txHash}`} target="_blank">
                    {tx && tx.description ? tx.description : "View in Explorer"}{" "}
                    <OpenInNewIcon className={classes.newWindowIcon} />
                  </a>
                </Typography>
              );
            })}
      </div>
    );
  };

  const renderTransactions = (transactions) => {
    if (
      transactions &&
      transactions.filter((tx) => {
        return ["DONE", "CONFIRMED"].includes(tx.status);
      }).length === transactions.length
    ) {
      return null;
    }

    return (
      <>
        <div className={classes.headingContainer}>
          <Typography className={classes.heading}>
            {purpose ? purpose : "Pending Transactions"}
          </Typography>
        </div>
        <div className={classes.transactionsContainer}>
          {transactions &&
            transactions.map((tx, idx) => {
              return <Transaction transaction={tx} />;
            })}
        </div>
      </>
    );
  };
  return (
    <>
      {popup.transactions?.length > 0 && (
        <IconButton
          className={classes.accountButton}
          variant="contained"
          color="primary"
          onClick={() => {
            setOpen(true);
          }}
        >
          <Badge
            badgeContent={transactionQueueLength}
            color="secondary"
            overlap="circular"
            sx={{
              badge: {
                backgroundColor: "#ffb405",
              },
            }}
          >
            <ListIcon className={classes.iconColor} />
          </Badge>
        </IconButton>
      )}
      <Dialog
        className={classes.dialogScale}
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={"sm"}
        TransitionComponent={Transition}
        fullScreen={fullScreen}
      >
        <DialogContent>
          <IconButton className={classes.closeIconbutton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          {renderTransactions(transactions)}
          {renderDone(transactions)}
        </DialogContent>
      </Dialog>
    </>
  );
}
