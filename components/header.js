//import tree from "../constants/tree.json";
import contractAddress from "../constants/contractAddresses.json";
const keccak256 = require("keccak256");
const header = ({
  mintedNFT,
  mintingStatus,
  loadingState,
  txError,
  currentAccount,
  correctNetwork,
  connectWallet,
  balance,
}) => {
  return (
    <>
      <nav className="flex items-center justify-between flex-wrap p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6 ml-10 text-4xl font-bold">
          <p>
            Back
            {/* <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500"> */}
              grounds
            {/* </span> */}
          </p>
        </div>

        <div className="block flex items-center ">
        <div className="mr-8">
          <img
                src="/Twitter-logo-white.svg"
                alt="Follow us on twitter"
                className="h-8"
              />
          </div>
          <div className="mr-8">
            <img
              src="/discord-mark-white.svg"
              alt="Join our discord"
              className="h-8"
            />
          </div>
          <div className="text-xl font-semibold mt-0 mr-8">
            <a
              href={`https://rinkeby.rarible.com/collection/${contractAddress}`}
              target="_blank"
            >
              <img
                src="/Opensea-logo-white.svg"
                alt="Buy on opensea"
                className="h-10"
              />
            </a>
          </div>

          {currentAccount === "" ? (
            <button className="btn connect-btn" onClick={connectWallet}>
              Connect Wallet
            </button>
          ) : correctNetwork ? (
            <button className="btn connect-btn flex  items-center">
              <div>
                <span className="mr-2 ml-2">
                  {balance != null ? balance.slice(0, 3) : ""} ETH
                </span>
              </div>
              <div className="address-btn">
                {currentAccount.slice(0, 5)}...
                {currentAccount.slice(currentAccount.length - 4)}
              </div>
            </button>
          ) : (
            <button className="btn wrong-network-btn">WRONG NETWORK</button>
          )}
          {loadingState === 0 ? (
            mintingStatus === 0 ? (
              txError === null ? (
                <div className="flex flex-col justify-center items-center">
                  <div className="text-lg font-bold">
                    Processing your transaction
                  </div>
                </div>
              ) : (
                <div className="text-lg text-red-600 font-semibold">
                  {txError}
                </div>
              )
            ) : (
              <div></div>
            )
          ) : (
            <div className="flex flex-col justify-center items-center">
              <div className="font-semibold text-lg text-center mb-4">
                Your Eternal Domain Character
              </div>
              <img
                src={mintedNFT}
                alt=""
                className="h-60 w-60 rounded-lg shadow-2xl shadow-[#6FFFE9] hover:scale-105 transition duration-500 ease-in-out"
              />
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default header;
