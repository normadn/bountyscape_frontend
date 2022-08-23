/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Image from "next/image";
import {
  useAccount,
  useBalance,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import SWNFT from "../utils/SWNFTUpgradeTestnet.json";
import Link from "next/link";

//Cosmos Staking
import { evmosToEth, ethToEvmos } from "@tharsis/address-converter";
import {
  generateEndpointBroadcast,
  generatePostBodyBroadcast,
  generateEndpointAccount,
} from "@tharsis/provider";
import {
  createTxRawEIP712,
  signatureToWeb3Extension,
  createMessageSend,
  createTxMsgDelegate
} from "@tharsis/transactions";

async function evmosStaking(address: any, amount: any) {
  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  const addrRawData = await fetch(
    `https://rest.bd.evmos.org:1317${generateEndpointAccount(
      ethToEvmos(String(address))
    )}`,
    options
  );
  const account = await addrRawData.json();
  const evmosAcc = account.account.base_account;
  console.log(account);
  const sender = {
    accountAddress: evmosAcc.address,
    sequence: evmosAcc.sequence,
    accountNumber: evmosAcc.account_number,
    pubkey: evmosAcc.pub_key.key,
  };

  const chainEvmos = {
    chainId: 9001,
    cosmosChainId: "evmos_9001-2",
  };

  const fee = {
    amount: "7000000000000000",
    denom: "aevmos",
    gas: "350000",
  };

  const memo = "";

  const params = {
    validatorAddress: "evmosvaloper1sx5qerxjzthnjzne7wz4x6ml4envjehvwtx8c7",
    amount: String(amount),
    denom: "aevmos",
  };
  const msg = createTxMsgDelegate(chainEvmos, sender, fee, memo, params);

  let signature = await (window as any).ethereum.request({
    method: "eth_signTypedData_v4",
    params: [evmosToEth(sender.accountAddress), JSON.stringify(msg.eipToSign)],
  });

  let extension = signatureToWeb3Extension(chainEvmos, sender, signature);

  // Create the txRaw
  let rawTx = createTxRawEIP712(
    msg.legacyAmino.body,
    msg.legacyAmino.authInfo,
    extension
  );

  const postOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: generatePostBodyBroadcast(rawTx),
  };

  let broadcastPost = await fetch(
    `https://rest.bd.evmos.org:1317${generateEndpointBroadcast()}`,
    postOptions
  );
  let response = await broadcastPost.json();
  console.log(response);
}

const Staking: NextPage = () => {
  const [stake, setStake] = useState(0);

  const { chain } = useNetwork();
  const treasuryAddr =
    chain?.name === "Goerli"
      ? "0x53ab03a91696dcc8c4977335dc9764db15f9e6d5"
      : "0x4F26fdA347e6fA2FF2A32E5b2f114DA00cB376E3";
  const { address } = useAccount();
  const { data, isError, isLoading } = useBalance({
    addressOrName: address,
  });

  

  const pubKey =
    "8CA4F86B049CF763735B4EE466F8E644A9DCE55DB98A0DE9EDC3A245AAB331C86AFBECF51C7A08254E6074672E5355EC"; // swell network pubkey | blockscape :"05b48831c7141420a721d35e78c5daa0a933f66b28ed46729dcff6f8b5ffa658";
  const withdrawalCredentials = "0x0";
  const signature = "0x0";
  const depositDataRoot = "0x0";

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    addressOrName: "0x23e33FC2704Bb332C0410B006e8016E7B99CF70A", // goerli testnet address for the swnft contract
    contractInterface: SWNFT,
    functionName: "deposit",
    args: [
      //pubKey,
      480,
      stake,
      //signature,
      //depositDataRoot
    ],
    // overrides: {
    //   value: ethers.utils.parseEther(stake),
    // },
  });

  // Query the node

  // console.log(JSON.stringify(msg.eipToSign))

  const {
    data: swNFTdata,
    error,
    isError: swNFTError,
    write,
  } = useContractWrite(config);


  return (
    <>
      <main className="min-h-screen">
        <div className="grid justify-items-center">
        
          {chain?.name !== "Goerli" && (
            <>
              <br />
              <div className="text-2xl font-bold mt-8">
                Stake your {data?.symbol} powered by blockscape validators
              </div>
              <br />
              <div className="card w-96 bg-base-100 shadow-xl">
                <figure>
                  <img
                    src="https://i.ibb.co/PmLLVGM/Screenshot-2022-08-10-at-11-09-11.jpg"
                    alt="blockscape"
                  />
                </figure>

                <div className="card-body">
                  <div className="alert alert-success shadow-lg">
                    <span className="font-bold text-center">
                      Commission 5% | APR 302.26%
                    </span>
                  </div>

                  <div className="alert alert-warning shadow-lg text-center">
                    <div className="font-bold">
                      <span>
                        <p>Available to Stake</p>
                        <p hidden={!isLoading}> Fetching balance… </p>
                        <p hidden={!isError}> Error fetching balance </p>
                        <p hidden={isLoading || isError}>
                          {Number(data?.formatted).toFixed(2)} {data?.symbol}{" "}
                        </p>

                        <br />
                        <p className="card-actions justify-center">
                          <input
                            type="number"
                            placeholder="Enter Stake Amount"
                            className="input input-bordered input-primary w-full max-w-xs"
                            onChange={(e) =>
                              setStake((parseFloat(e.target.value) * 1000000000000000000))
                            }
                          />
                          <button
                            className="btn btn-primary"
                            onClick={() => evmosStaking?.(address, stake)}
                          >
                            Stake your {data?.symbol}
                          </button>
                        </p>
                      </span>
                    </div>
                  </div>
                  <div className="alert alert shadow text-xs">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-current flex-shrink-0 w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span>
                        Staking will lock your funds for 14 days
                      </span>
                    </div>
                  </div>
                  <br />
                  <div className="alert alert shadow-lg link link-hover">
                    <div>
                      <Image
                        src="https://i.ibb.co/FYTHRRQ/foreign.png"
                        alt="link"
                        width="17px"
                        height="17px"
                      />
                      <span>
                        <Link href="https://blockscape.network/">
                          Learn more about blockscape
                        </Link>
                      </span>
                    </div>
                  </div>
                  <div className="alert alert shadow-lg link link-hover">
                    <div>
                      <Image
                        src="https://i.ibb.co/FYTHRRQ/foreign.png"
                        alt="link"
                        width="17px"
                        height="17px"
                      />
                      <span>
                        <Link href="https://app.evmos.org/staking">
                          Manage your delegation & stake
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {chain?.name === "Goerli" && (
            <>
              <br />
              <div className="text-2xl font-bold mt-8">
                stake your {data?.symbol} powered by blockscape & swell
              </div>
              <br />
              <div className="card w-96 bg-base-100 shadow-xl">
                <figure>
                  <img
                    src="https://i.ibb.co/Yh1HvJW/bls.jpg"
                    alt="blockscape"
                  />
                </figure>
                <div className="card-body">
                  <div className="grid grid-cols-2 gap-2">
                    <div>Available to Stake</div>
                    <div hidden={!isLoading}> Fetching balance… </div>
                    <div hidden={!isError}> Error fetching balance </div>
                    <div hidden={isLoading || isError}>
                      {" "}
                      {Number(data?.formatted).toFixed(2)} {data?.symbol}{" "}
                    </div>
                  </div>
                  <div className="card-actions justify-center">
                    <input
                      type="number"
                      placeholder="Enter Stake Amount"
                      className="input input-bordered input-primary w-full max-w-xs"
                      onChange={(e) =>
                        setStake(ethers.utils.parseEther(e.target.value))
                      }
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => write?.()}
                    >
                      Stake your {data?.symbol}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* <><div className="toast toast-end">
          <div className="alert alert-error">
            <div>
              <span>{(prepareError || error)?.message}</span>
            </div>
          </div>
        </div></> */}
      </main>
    </>
  );
};

export default Staking;
