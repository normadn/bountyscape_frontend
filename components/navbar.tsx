import Link from "next/link";
import React, { useState } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from "next/image";


// const MENU_LIST = [
//   { text: "Home", href: "/" },
//   { text: "About Us", href: "/about" },
//   { text: "Contact", href: "/contact" },
// ];


const Navbar = () => {
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
          <ul className="menu menu-horizontal p-0">
            <li>
              <Link href={"/onboarding"}>
                Onboarding
              </Link>
            </li>
            <li>
              <Link href={"/bounties"}>
                Bounties
              </Link>
            </li>
            <li>
              <Link href={"/account"}>
                Account
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Navbar;