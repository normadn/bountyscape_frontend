/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { useAccount, useBalance, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { useState } from "react";
import { ethers } from "ethers";
import SWNFT from '../utils/SWNFTUpgradeTestnet.json'


const Treasury: NextPage = () => {


  const [stake, setStake] = useState(ethers.utils.parseEther("1"));

  const { chain } = useNetwork();
  const treasuryAddr =
    chain?.name === "Goerli"
      ? "0x2910EeD4202FEe772DF6a9e47a2a1b31b834337d"
      : "0x548325D23dD7FdcD3aC34daCfb51Ad10CeFd13fd";
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

  const pubKey = "8CA4F86B049CF763735B4EE466F8E644A9DCE55DB98A0DE9EDC3A245AAB331C86AFBECF51C7A08254E6074672E5355EC" // swell network pubkey | blockscape :"05b48831c7141420a721d35e78c5daa0a933f66b28ed46729dcff6f8b5ffa658";
  const withdrawalCredentials = "0x0";
  const signature = "0x0";
  const depositDataRoot = "0x0";



  const { config, error: prepareError, isError: isPrepareError, } = usePrepareContractWrite({
    addressOrName: "0x23e33FC2704Bb332C0410B006e8016E7B99CF70A", // goerli testnet address for the swnft contract
    contractInterface: SWNFT,
    functionName: 'deposit',
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
  })
  
  const { data:swNFTdata, error, isError:swNFTError, write } = useContractWrite(config)





  return (
    <>
      <main className="min-h-screen">
        <div className="grid justify-items-center">
          <div className="text-2xl font-bold mt-8">bountyscape treasury</div>
          <br />
          <Image
            src="https://i.ibb.co/N2xdQs5/Logobountyscape.png"
            width="100%"
            height="100%"
            alt="logo"
            quality="100"
          />
          <br />

          <div className="stats bg-primary text-primary-content">
            <div className="stat">
              <div className="stat-title">Treasury balance</div>
              <div hidden={!isLoadingT} className="stat-value">
                {" "}
                Fetching balance…{" "}
              </div>
              <div hidden={!isErrorT} className="stat-value">
                {" "}
                Error fetching balance{" "}
              </div>
              <div hidden={isLoadingT || isErrorT} className="stat-value">
                {" "}
                {Number(TreasuryBalance?.formatted).toFixed(2)}{" "}
                {TreasuryBalance?.symbol}{" "}
              </div>
              <div className="stat-actions">
                <label className="btn btn-sm btn-success">
                  Staking APY: 8%
                </label>
              </div>
            </div>
          </div>
          <br />
          <div className="text-2xl font-bold mt-8">
            stake your {data?.symbol} powerd by blockscape & swell
          </div>
          <br />
          <div className="card w-96 bg-base-100 shadow-xl">
            <figure>
              <img src="https://i.ibb.co/Yh1HvJW/bls.jpg" alt="blockscape" />
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
                  onChange={(e) => setStake(ethers.utils.parseEther(e.target.value))}
                />
                <button className="btn btn-primary" onClick={() => write?.()}>Stake your {data?.symbol}</button>
              </div>
            </div>
          </div>
        </div>

        <><div className="toast toast-end">
          <div className="alert alert-error">
            <div>
              <span>{(prepareError || error)?.message}</span>
            </div>
          </div>
        </div></>
      </main>
    </>
  );
};

export default Treasury;
