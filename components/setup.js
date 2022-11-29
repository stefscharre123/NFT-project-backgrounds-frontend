const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");
import abi from "../constants/abi.json";
import contractAddress from "../constants/contractAddresses.json";
import { useEffect } from "react";
import { ethers } from "ethers";
import whitelistAddresses from "../constants/whitelistAddresses.json";

const setup = ({setCorrectNetwork, setTree, setCurrentAccount, setContract, currentAccount, contract, setBalance}) => {
    const checkCorrectNetwork = async () => {
        const { ethereum } = window;
        let chainId = await ethereum.request({ method: "eth_chainId" });
        console.log("Connected to chain:" + chainId);
    
        //const goerliChainId = "0x7a69";
        const goerliChainId = "0x5";
        if (chainId !== goerliChainId) {
          setCorrectNetwork(false);
        } else {
          setCorrectNetwork(true);
        }
      };
    
      function setTreeFunction() {
        const leaves = whitelistAddresses.map((x) => keccak256(x));
        let tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        setTree(tree);
      }
    
      const checkIfWalletIsConnected = async () => {
        const { ethereum } = window;
        if (ethereum) {
          //console.log("Got the ethereum object: ", ethereum);
        } else {
          //console.log("No Wallet found. Connect Wallet");
        }
    
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    
        if (accounts.length !== 0) {
          console.log("Found authorized Account: ", accounts[0]);
          setCurrentAccount(accounts[0]);
        } else {
          console.log("No authorized account found");
        }
      };
    
      useEffect(() => {
        checkIfWalletIsConnected();
        checkCorrectNetwork();
        setTreeFunction();
      }, []);
    
      const setContractState = async () => {
        const provider = new ethers.providers.Web3Provider(ethereum);

        // const provider = new ethers.providers.JsonRpcProvider(
        //   "http://127.0.0.1:8545",
        //   31337
        // );

        // const provider = new ethers.providers.provider(
        //   "https://eth-goerli.g.alchemy.com/v2/Ikdiv4m_1M30b0jSMRERR5xBq7EVFAbl",
        //   5
        // );
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const signer = provider.getSigner();
        const balance = await provider.getBalance(accounts[0]);
        setBalance(ethers.utils.formatEther(balance));
        console.log(ethers.utils.formatEther(balance))
       setContract(new ethers.Contract(contractAddress, abi, signer));
       console.log("Contract " + contract.address);
      };
    
      useEffect(() => {
        setContractState();
      }, [currentAccount]);
};

export default setup;
