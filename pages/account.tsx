/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { GrantRoleEmployer } from "../components/scFunctions/write/grantRoleEmployer";
import { RevokeRoleEmployer } from "../components/scFunctions/write/revokeRoleEmployer";
import { GrantRoleContractor } from "../components/scFunctions/write/grantRoleContractor";
import { RevokeRoleContractor } from "../components/scFunctions/write/revokeRoleContractor";
import Quadrata from "../utils/Quadrata.json";


import QUADRATA_READER_ABI from "../components/quadrata/kyc";
import DemoApp from "../components/quadrata/all";
import { useAccount, useContractRead, usePrepareContractWrite } from "wagmi";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const Account: NextPage = () => {


  const { address, isConnecting, isDisconnected } = useAccount()


  const [status, setStatus] = useState("Not Verified KYC/KYB - Become Verified:");
  const [disabled, setDisabled] = useState(true);


  const { data:isBusiness, isLoading:isLoadingTokenId, isSuccess:isSuccessTokenId, error } = useContractRead({
    addressOrName: "0x2B212B47Faf2040cA4782e812048F5aE8ad5Fa2f",
    contractInterface: Quadrata,
    functionName: 'getAttributesFree',
    args: [address, 1, ethers.utils.id('IS_BUSINESS')],
  })

  useEffect (() => {
  if (isSuccessTokenId) {
  if (isBusiness?.[0].toString() === "0x7749ed7587e6dbf171ce6be50bea67236732d7ccfd51e327bc28b612ec06faa7") {
  setStatus ("Verifed KYB - You are a verified business")
  setDisabled(true);
  } else if (isBusiness?.[0].toString() === "0xa357fcb91396b2afa7ab60192e270c625a2eb250b8f839ddb179f207b40459b4") {
  setStatus("Verified KYC - You are a verified individual")
  setDisabled(true);
  }
  } else {
  setStatus("Not Verified KYC/KYB - Become Verified:")
  setDisabled(false);

  }
  } , [isSuccessTokenId, isBusiness])


  return (
    <main className="min-h-screen">
      <div className="grid justify-items-center">
        <div className="text-2xl font-bold mt-8">Account Overview</div>
        <br />
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Total Likes</div>
            <div className="stat-value text-primary">25.6K</div>
            <div className="stat-desc">21% more than last month</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Page Views</div>
            <div className="stat-value text-secondary">2.6M</div>
            <div className="stat-desc">21% more than last month</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <div className="avatar online">
                <div className="w-16 rounded-full">
                  <img
                    src="https://placeimg.com/128/128/people"
                    alt="account"
                  />
                </div>
              </div>
            </div>
            <div className="stat-value">86%</div>
            <div className="stat-title">Tasks done</div>
            <div className="stat-desc text-secondary">31 tasks remaining</div>
          </div>
        </div>

        <GrantRoleEmployer />
        {/* <RevokeRoleEmployer /> */}
        <GrantRoleContractor />
        <br />
        {/* <RevokeRoleContractor /> */}

        <div className="text-xl font-bold mt-8">{status}</div>
        <br />
        <button disabled={disabled} className="btn btn-primary">
        <label htmlFor="my-modal-3"  className="modal-button">
          KYC/KYB
        </label>
        </button>

        <input type="checkbox" id="my-modal-3" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box relative">
            <label
              htmlFor="my-modal-3"
              className="btn btn-primary btn-circle absolute right-2 top-2"
            >
              ✕
            </label>
            <DemoApp />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Account;
