// wallet_model
// source: https://ahmetoznar.medium.com/how-can-you-integrate-web3modal-for-dapps-60372f500769

import Web3 from "web3";
import Web3Modal from "web3modal";
import Authereum from "authereum";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useState } from "react";


export default function wallet_model() {
  const [loading, setLoading] = useState(false);
  return {
    get web3Loading() {
      return loading
    },
    async getweb3() {
      setLoading(true);
      let web3Modal;
      let provider;
      let web3;
      let providerOptions;
      providerOptions = {
        metamask: {
          id: "injected",
          name: "MetaMask",
          type: "injected",
          check: "isMetaMask"
        },
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: "INFURA_ID", // Required
            network: "rinkeby",
            qrcodeModalOptions: {
              mobileLinks: [
                "rainbow",
                "metamask",
                "argent",
                "trust",
                "imtoken",
                "pillar"
              ]
            }
          }
        },
        authereum: {
          package: Authereum // required
        },
      };
      web3Modal = new Web3Modal({
        network: "rinkeby",
        cacheProvider: true,
        providerOptions
      });
      provider = await web3Modal.connect();
      provider.on('error', (e) => {
        console.error('Wallet Error', e)
      });
      provider.on('end', (e) => {
        console.error('Wallet End', e)
      });
      provider.on("disconnect", (error) => {
        console.log('Wallet Disconnect', error);
      });
      provider.on("connect", (info) => {
        console.log('Wallet connect', info);
      });
      web3 = new Web3(provider);
      setLoading(false);
      return web3;
    },
  }
}