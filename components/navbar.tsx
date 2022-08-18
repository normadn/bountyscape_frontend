import Link from "next/link";
import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { usePrepareContractWrite, useNetwork } from "wagmi";
import Bountyscape from "../utils/Bountyscape.json";

const Navbar = () => {
  const { chain } = useNetwork();
  const contractAddr =
    chain?.name === "Goerli"
      ? "0xB4902E7c5F1645B955E565Cd9d49b04B8770A1Bd"
      : "0x7bE0571a42bF0e4429d1fbcECA791575CFb73b4E";

  const { isError: isErrorEmployer } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: "grantRoleEmployer",
  });

  const { isError: isErrorContractor } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: "grantRoleContractor",
  });

  return (
    <header>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex="0" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex="0"
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href={"/bounties"}>Bounties</Link>
              </li>
              <li>
                <Link href={"/treasury"}>Treasury</Link>
              </li>
              <li>
                <Link href={
              !isErrorEmployer && !isErrorContractor
                ? "/onboarding"
                : "/account"
            }>Account</Link>
              </li>
            </ul>
          </div>
          <Link href={"/"}><label tabIndex="0" className="btn btn-ghost normal-case text-xl">
            <Image
              src="https://i.ibb.co/dDnbRQQ/logosmall.png"
              width="39.6px"
              height="31.5px"
              alt="logo"
              quality="100"
              lazyBoundary="400px"
            />{" "}
            <div> bountyscape</div>
          </label></Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal p-0">
            <li>
              <Link href={"/bounties"}>Bounties</Link>
            </li>
            <li>
              <Link href={"/treasury"}>Treasury</Link>
            </li>
            <li>
              <Link href={
              !isErrorEmployer && !isErrorContractor
                ? "/onboarding"
                : "/account"
            }>Account</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <ConnectButton
            label="Login"
            showBalance={{
              smallScreen: false,
              largeScreen: true,
            }}
            chainStatus="icon"
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
