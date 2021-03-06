import React, { useState, useEffect } from "react";
import Pact from "pact-lang-api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createContext } from "react/cjs/react.production.min";
import { DEFAULT_CHAIN_ID, DEFAULT_GAS_PRICE, LOCAL_ACCOUNT_KEY, LOCAL_CHAIN_ID, MAINNET_NETWORK_ID, TESTNET_NETWORK_ID } from "../utils/Constants";

export const PactContext = createContext(); //Define Pact Context

const PactContextProvider = ({ children }) => {
    const [chainId, setChainId] = useState(() => tryLoadLocal(LOCAL_CHAIN_ID));
    const [gasPrice, setGasPrice] = useState(DEFAULT_GAS_PRICE);
    const [netId, setNetId] = useState(null);
    const [account, setAccount] = useState(() => tryLoadLocal(LOCAL_ACCOUNT_KEY));
    const [networkUrl, setNetworkUrl] = useState(null);

    useEffect(() => {
        setNetworkUrl(getNetworkUrl(netId));
    }, [netId]);
    
    const setNetworkSettings = (netId, chainId, gasPrice) => {
        setNetId(netId);
        setChainId(chainId);
        setGasPrice(gasPrice);
    };

    const useSetNetworkSettings = (netId, chainId, gasPrice=DEFAULT_GAS_PRICE) => {
        useEffect(() => {
            setNetworkSettings(netId, chainId, gasPrice)
        }, [netId, chainId, gasPrice]);
    }

    const defaultMeta = (gasLimit) => {
        return Pact.lang.mkMeta(
            "",
            chainId,
            gasPrice,
            gasLimit ?? 150000,
            creationTime(),
            600
        );
    };

    const readFromContract = async (cmd, returnError) => {
        try {
            let data = await Pact.fetch.local(cmd, networkUrl);
            if (data?.result?.status === "success") {
                return data.result.data;
            } else {
                if (returnError === true) {
                    return data?.result?.error?.message;
                } else {
                    return null;
                }
            }
        } catch (e) {
            toast.error("Had trouble fetching data from the blockchain");
            console.log(e);
        }
        return null;
    };
    return (
        <PactContext.Provider
            value={{
                netId,
                chainId,
                account,
                gasPrice,
                networkUrl,
                setNetId,
                setChainId,
                setAccount,
                defaultMeta,
                setGasPrice,
                setNetworkUrl,
                readFromContract,
                setNetworkSettings,
                useSetNetworkSettings
            }}
        >
            {children}
        </PactContext.Provider>
    )
}

function getNetworkUrl(netId) {
    if (netId == null) {
        return;
    }
    if (netId === TESTNET_NETWORK_ID) {
        return `https://api.testnet.chainweb.com/chainweb/0.0/${TESTNET_NETWORK_ID}/chain/${DEFAULT_CHAIN_ID}/pact`;
    } else if (netId === MAINNET_NETWORK_ID) {
        return `https://api.chainweb.com/chainweb/0.0/${MAINNET_NETWORK_ID}/chain/${DEFAULT_CHAIN_ID}/pact`;
    }
    throw new Error("networkId must be testnet or mainnet");
}

function creationTime() {
    return Math.round(new Date().getTime() / 1000) - 10;
}

function tryLoadLocal(key) {
    let val = localStorage.getItem(key);
    if (val == null) {
        return null;
    }
    try {
        // return JSON.parse(val);
        return val;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export {
    PactContextProvider
}