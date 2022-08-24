// import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import type { NextPage } from "next";
import BountyscapeToken from "../utils/BountyscapeToken.json";

import Image from "next/image";

const DAO: NextPage = () => {
  const { chain } = useNetwork();
  const contractAddr =
    chain?.name === "Goerli"
      ? "0xb049977f9a53dc29aabbb67f9f9a72571a7835f2"
      : chain?.name === "Evmos Testnet"
      ? "0x7bE0571a42bF0e4429d1fbcECA791575CFb73b4E"
      : "0x548325D23dD7FdcD3aC34daCfb51Ad10CeFd13fd";
  const treasuryAddr =
    chain?.name === "Goerli"
      ? "0x53ab03a91696dcc8c4977335dc9764db15f9e6d5"
      : chain?.name === "Evmos Testnet"
      ? "0x4F26fdA347e6fA2FF2A32E5b2f114DA00cB376E3"
      : "0xd821C935B8fAA376a4E7382b7EDbc0682A769310";

  const tokenAddr =
    chain?.name === "Goerli"
      ? "0x68f7bd17bace86226ee5338a2f31d8337fd61261"
      : chain?.name === "Evmos Testnet"
      ? "0x68f7bd17bace86226ee5338a2f31d8337fd61261"
      : "0x69Ff0F3dA7DFb0b4dbB5548259284Fb88d586775";
  const { address } = useAccount();
  const { data, isError, isLoading } = useBalance({
    addressOrName: address,
  });

  const {
    data: TreasuryBalance,
    isError: isErrorT,
    isLoading: isLoadingT,
  } = useBalance({
    addressOrName: treasuryAddr,
  });

  const { data: tBalanc } = useContractRead({
    addressOrName: tokenAddr,
    contractInterface: BountyscapeToken.abi,
    functionName: "balanceOf",
    args: [contractAddr],
  });

  const { data: tBalancSelf } = useContractRead({
    addressOrName: tokenAddr,
    contractInterface: BountyscapeToken.abi,
    functionName: "balanceOf",
    args: [address],
  });

  async function addToken() {
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await (window as any).ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddr, // The address that the token is at.
            symbol: "BST", // A ticker symbol or shorthand, up to 5 chars.
            decimals: 18, // The number of decimals in the token
            image: "https://i.ibb.co/Zf4WT3b/Untitled-3.png", // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className="min-h-screen">
      <div className="grid justify-items-center">
        <div className="text-2xl font-bold mt-8">bountyscapeDAO</div>
        <br />
        <div className="stats bg-primary text-primary-content">
          <div className="stat">
            <div className="stat-title">Treasury balance</div>
            <div hidden={!isLoadingT} className="stat-value">
              {" "}
              …{" "}
            </div>
            <div hidden={!isErrorT} className="stat-value">
              {" "}
              Error{" "}
            </div>
            <div hidden={isLoadingT || isErrorT} className="stat-value">
              {" "}
              {Number(TreasuryBalance?.formatted).toFixed(2)}{" "}
              {TreasuryBalance?.symbol}{" "}
            </div>
            <div hidden={!isLoadingT} className="stat-value">
              {" "}
              …{" "}
            </div>
            <div hidden={!isErrorT} className="stat-value">
              {" "}
              Error{" "}
            </div>
            <div hidden={isLoadingT || isErrorT} className="stat-value">
              {(Number(tBalanc?.toString()) / 1e18).toFixed(2)} BST
            </div>
            <div className="stat-actions">
              {/* <label className="btn btn-sm btn-success">
                  Staking APY: 8%
                </label> */}
            </div>
          </div>
        </div>

        <div className="text-2xl font-bold mt-8">Your Membership</div>
        <br />
        <div className="stats bg-primary text-primary-content">
          <div className="stat">
            <div className="stat-title">Your BST balance</div>
            <div hidden={!isLoadingT} className="stat-value">
              {" "}
              …{" "}
            </div>
            <div hidden={!isErrorT} className="stat-value">
              {" "}
              Error{" "}
            </div>
            <div hidden={isLoadingT || isErrorT} className="stat-value">
              {(Number(tBalancSelf?.toString()) / 1e18).toFixed(2)} BST
            </div>
            <div className="stat-actions">
              {/* <label className="btn btn-sm btn-success">
                  Staking APY: 8%
                </label> */}
            </div>
            <button className="btn btn-secondary btn-xs" onClick={addToken}>
              Add Token to wallet
            </button>
          </div>
        </div>
        <div className="text-xl font-bold mt-8">Current Membership Level</div>
        <div className="btn-group btn-group-vertical">
          <div
            className="tooltip tooltip-primary tooltip-left"
            data-tip="HODL 1000 BST"
          >
            <div
              className="tooltip tooltip-primary tooltip-right"
              data-tip="fees reduced to 1.00%"
            >
              <button
                disabled={
                  Number(tBalancSelf?.toString()) / 1e18 >= 1000 ? false : true
                }
                className="btn btn-wide  btn-primary no-animation"
              >
                Goat Scaper{" "}
              </button>
            </div>
          </div>
          <div
            className="tooltip tooltip-primary tooltip-left"
            data-tip="HODL 500 BST"
          >
            {" "}
            <div
              className="tooltip tooltip-primary tooltip-right"
              data-tip="fees reduced to 1.25%"
            >
              <button
                disabled={
                  Number(tBalancSelf?.toString()) / 1e18 >= 500 &&
                  Number(tBalancSelf?.toString()) / 1e18 <= 1000
                    ? false
                    : true
                }
                className="btn btn-wide  btn-primary no-animation"
              >
                Executive Scaper{" "}
              </button>
            </div>
          </div>
          <div
            className="tooltip tooltip-primary tooltip-left"
            data-tip="HODL 300 BST"
          >
            {" "}
            <div
              className="tooltip tooltip-primary tooltip-right"
              data-tip="fees reduced to 1.5%"
            >
              {" "}
              <button
                disabled={
                  Number(tBalancSelf?.toString()) / 1e18 >= 300 &&
                  Number(tBalancSelf?.toString()) / 1e18 <= 500
                    ? false
                    : true
                }
                className="btn btn-wide  btn-primary no-animation"
              >
                Senior Scaper
              </button>
            </div>
          </div>
          <div
            className="tooltip tooltip-primary tooltip-left"
            data-tip="HODL 100 BST"
          >
            {" "}
            <div
              className="tooltip tooltip-primary tooltip-right"
              data-tip="fees reduced to 1.75%"
            >
              {" "}
              <button
                disabled={
                  Number(tBalancSelf?.toString()) / 1e18 >= 100 &&
                  Number(tBalancSelf?.toString()) / 1e18 <= 300
                    ? false
                    : true
                }
                className="btn btn-wide  btn-primary no-animation"
              >
                Intermediate Scaper
              </button>
            </div>
          </div>
          <div
            className="tooltip tooltip-primary tooltip-left"
            data-tip="HODL 25 BST"
          >
            {" "}
            <div
              className="tooltip tooltip-primary tooltip-right"
              data-tip="fees reduced to 2%"
            >
              {" "}
              <button
                disabled={
                  Number(tBalancSelf?.toString()) / 1e18 >= 25 &&
                  Number(tBalancSelf?.toString()) / 1e18 <= 100
                    ? false
                    : true
                }
                className="btn btn-wide  btn-primary no-animation"
              >
                Junior Scaper
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DAO;
