import Link from "next/link";
import React, { useState } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from "next/image";
import { usePrepareContractWrite,useNetwork } from "wagmi";
import Bountyscape from '../utils/Bountyscape.json'


const Navbar = () => {

  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Goerli' ? '0xDFDc2E99A1De4ea9DAf44591fd4d8a1C555F8472' : '0x0140CeC539ee2cf6bECA0597E1eFD2b723A0EBF7'


  const { isError: isErrorEmployer, } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: 'grantRoleEmployer',
  })

  const { isError: isErrorContractor, } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: 'grantRoleContractor',
  })



  return (
    <header>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <label className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
            </label>
            <ul className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <Link href={"/onboarding"}>
                  Onboarding
                </Link>
              </li>
              <li>
                <Link href={"/account"}>
                  Account
                </Link>
              </li>
            </ul>
          </div>
          <a href={"/"} className="btn btn-ghost normal-case text-xl"><Image
            src="https://i.ibb.co/dDnbRQQ/logosmall.png"
            width="39.6px"
            height="31.5px"
            alt="logo"
            quality="100"
            lazyBoundary="400px"
          /> <div> bountyscape</div></a>
        </div>
        <div className="navbar-center hidden lg:flex">
        <div className="flex-none hidden lg:block">
          <ul className="menu menu-horizontal p-0">
            <li>
              <Link href={"/bounties"}>
                Bounties
              </Link>
            </li>
            {/* <li>
              <Link href={"/account"}>
                Account
              </Link>
            </li> */}
            <li>
              <Link href={"/treasury"}>
                Treasury
              </Link>
            </li>
          </ul>
          
        </div>
        </div>
        <div className="navbar-end">
          <ConnectButton />
          
        </div>
        <Link href={!isErrorEmployer && !isErrorContractor ? "/onboarding" : "/account"}> 
        <button className="btn btn-primary btn-sm ml-2">{isErrorEmployer && isErrorContractor ? "Error" : isErrorEmployer ? "Contractor" : isErrorContractor ? "Employer" : "Account"}</button>
        </Link>
      </div>
      

    </header>
    
    
  );
};

export default Navbar;