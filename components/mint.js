import { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
const keccak256 = require("keccak256");
import Popup from "reactjs-popup";
import styles from "../styles/Home.module.css";

const mint = ({
  contract,
  tree,
  setMintingStatus,
  setLoadingState,
  setMintedNFT,
  setTxError,
  connectWallet,
  currentAccount,
  correctNetwork,
  txError,
}) => {
  const [saleState, setSalestate] = useState(0);
  const [alreadyMinted, setAlreadyMinted] = useState(false);
  const [amount, setAmount] = useState(0);
  const [errorMessage, seterrorMessage] = useState("");

  const state = ["Closed", "Whitelist", "Public"];

  const getProof = (personMinting) => {
    const buf2hex = (x) => "0x" + x.toString("hex");
    let leaf = buf2hex(keccak256(personMinting)); // address from wallet using walletconnect/metamask
    let proof = tree.getProof(leaf).map((x) => buf2hex(x.data));
    return proof;
  };
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const salestateFromContract = await contract.getSaleState();
        console.log(salestateFromContract);
        setSalestate(salestateFromContract);
        const mintedAlready = await contract
          .connect(currentAccount)
          .getAlreadyMinted();
        setAlreadyMinted(mintedAlready);
        //console.log(mintedAlready);
      } catch {
        console.log("contract not initialized");
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [contract]);

  const mintNFT = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        if (saleState == 1) {
          try {
            let nftTx = await contract.whitelistMint(getProof(currentAccount), {
              value: ethers.utils.parseEther("0.05"),
            });
            console.log("Mining....", nftTx.hash);
            setMintingStatus(0);

            let tx = await nftTx.wait();
            setLoadingState(1);
            console.log("Mined!", tx);
            let event = tx.events[0];
            console.log(event);
            let value = event.args[2];
            console.log(value);
            let tokenId = value.toNumber();

            console.log(
              `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
            );

            getMintedNFT(tokenId);
          } catch (error) {
            console.log("Error: " + error.message);
            setTxError(error.message);
          }
        } else if (saleState == 2) {
          let nftTx = await contract.publicMint(2, {
            value: ethers.utils.parseEther(getValue()),
          });
          console.log("Mining....", nftTx.hash);
          setMintingStatus(0);

          let tx = await nftTx.wait();
          setLoadingState(1);
          console.log("Mined!", tx);
          let event = tx.events[0];
          console.log(event);
          let value = event.args[2];
          console.log(value);
          let tokenId = value.toNumber();
        } else {
          console.log("mint not open");
        }
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error minting character", error);
      setTxError(error.message);
    }
  };
  function getValue() {
    setAmount(2);
    if (amount == 1) {
      return "0.05";
    }
    if (amount == 2) {
      return "0.10";
    }
  }
  const getMintedNFT = async (tokenId) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        let tokenUri = await contract.tokenURI(tokenId);
        console.log(tokenUri);
        setMintingStatus(1);
        setMintedNFT(meta.image);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setTxError(error.message);
    }
  };

  // function errorMessageFunction(){

  //   const index = txError.indexOf("reverted with reason string '")
  //   console.log(index);
  // }
  // useEffect(() => {
  //   errorMessageFunction()
  // }, [txError]);

  return (
    <>
      <section className="justify-center text-center section d-flex ">
        {" "}
        {/* 
      <section className="justify-center text-center h-screen d-flex  bg-[url('/background-blue.png')] bg-center bg-cover">
      bg-center puts the image in the center of the screen
      bg-cover adjusts the height to the section
      h-screen is 100% of viewport*/}
        <div className="grid grid-cols-9">
          <div className="col-span-4">
            <main>
              <h1 className="main-title mb-2">Welcome to the backgroundverse</h1>

              <p className="main-desc">
                Mint your background and get ready to explore the wonderful world of the backgroundverse
              </p>

              {/* ---- */}
              <div>
                {!currentAccount == "" && correctNetwork ? (
                  <>
                    <br />
                    <h2 className="font-bold">Connected ✅</h2>
                    {alreadyMinted && saleState == 1 ? (
                      <button type="button" className="btn connect-btn-2">
                        You already minted
                      </button>
                    ) : (
                      <button
                        onClick={mintNFT}
                        type="button"
                        className="btn connect-btn-2"
                      >
                        Mint NFT
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <br />
                    <button
                      className="btn connect-btn-2"
                      onClick={connectWallet}
                    >
                      Connect Wallet
                    </button>
                  </>
                )}
                {txError ? <div>{txError}</div> : ""}
              </div>

              {/* ---- */}
            </main>
          </div>
          <div className="col-span-5">
            <div className="flex relative">
              <div class="max-w-sm bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-black via-black to-sky-900 rounded-xl shadow-md dark:bg-gray-800 dark:border-gray-700 fixed top-48  w-64 ml-36">
              <div className="p-2">
                <a href="#">
                  <img class="rounded-t-lg" src="/backgrounds5.jpg" alt="" />
                </a>
                </div>
                <div class="p-4">
                  <a href="#">
                    <h5 class="mb-2 text-3xl font-bold tracking-tight text-white dark:text-white">
                      Mint
                    </h5>
                  </a>
                  <a
                    href="#"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Read more
                    <svg
                      aria-hidden="true"
                      class="w-4 h-4 ml-2 -mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div class="max-w-sm bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-black via-black to-sky-900 rounded-xl shadow-md dark:bg-gray-800 dark:border-gray-700 right-80 top-64 fixed w-64">
                <div className="p-2">
                <a href="#">
                  <img class="rounded-t-lg" src="/backgrounds6.jpg" alt="" />
                </a>
                </div>
                <div class="p-4">
                  <a href="#">
                    <h5 class="mb-2 text-3xl font-bold tracking-tight text-white dark:text-white">
                      Collect
                    </h5>
                  </a>
                  <a
                    href="#"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Read more
                    <svg
                      aria-hidden="true"
                      class="w-4 h-4 ml-2 -mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div class="max-w-sm bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-black via-black to-sky-900  rounded-xl shadow-md dark:bg-gray-800 dark:border-gray-700 right-28 top-80 fixed w-64">
              <div className="p-2">
                <a href="#">
                  <img class="rounded-t-lg" src="/background2.jpg" alt="" />
                </a>
                </div>
                <div class="p-4">
                  <a href="#">
                    <h5 class="mb-2 text-3xl font-bold tracking-tight text-white dark:text-white">
                      Explore
                    </h5>
                  </a>
                  <a
                    href="#"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Read more
                    <svg
                      aria-hidden="true"
                      class="w-4 h-4 ml-2 -mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default mint;
