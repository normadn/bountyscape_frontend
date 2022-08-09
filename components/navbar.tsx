import Link from "next/link";
import React, { useState } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from '../styles/Navbar.module.css';


// const MENU_LIST = [
//   { text: "Home", href: "/" },
//   { text: "About Us", href: "/about" },
//   { text: "Contact", href: "/contact" },
// ];


const Navbar = () => {
//   const [navActive, setNavActive] = useState(false);
//   const [activeIdx, setActiveIdx] = useState(-1);

  return (
    <header>
      <nav className={styles.nav}>
        <Link href={"/"}>
          <a>
            <h1 className="logo">Bountyscape</h1>
          </a>
        </Link>
        <Link href={"/account"}>
            <a>
                Account
            </a>
            </Link>
        <ConnectButton />
      </nav>
    </header>
  );
};

export default Navbar;