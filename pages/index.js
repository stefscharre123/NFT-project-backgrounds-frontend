import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from '../components/header'
import Setup from '../components/setup'
import Mint from '../components/mint'
import Footer from '../components/Footer'
import { useEffect, useState } from "react";

export default function Home() {
  const [mintedNFT, setMintedNFT] = useState(null);
  const [mintingStatus, setMintingStatus] = useState(null);
  const [loadingState, setLoadingState] = useState(0);
  const [txError, setTxError] = useState(null);
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentAccountAddress, setCurrentAccountAddress] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [contract, setContract] = useState("");
  const [tree, setTree] = useState("");
  const [balance, setBalance] = useState();

  useEffect(() => {
    if(window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      })
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      })
  }});

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:" + chainId);

      //const goerliChainId = "0x7a69";
      const goerliChainId = "0x5";
      if (chainId !== goerliChainId) {
        alert("You are not connected to the goerli Testnet!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Found account", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };
  return (<>
      <Setup setCorrectNetwork={setCorrectNetwork} setTree={setTree} setCurrentAccount = {setCurrentAccount} setContract={setContract} currentAccount={currentAccount} contract={contract} setCurrentAccountAddress={setCurrentAccountAddress}setBalance={setBalance}/>
  
      <Header mintedNFT={mintedNFT} mintingStatus={mintingStatus} loadingState={loadingState} txError={txError} currentAccount={currentAccount} correctNetwork={correctNetwork} connectWallet={connectWallet}  balance={balance} />
      <div className="bg-[url('/background-page2.jpg')] bg-cover">
      <Mint contract={contract} tree={tree} setMintingStatus={setMintingStatus} setLoadingState={setLoadingState} setMintedNFT={setMintedNFT} setTxError={setTxError} connectWallet={connectWallet} currentAccount={currentAccount} correctNetwork={correctNetwork} txError={txError}/>
      <Footer/>
    </div></>
  )
}
