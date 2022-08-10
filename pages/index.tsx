import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <>
      <main className="min-h-screen">
        <div className="grid justify-items-center">
          <h1 className={styles.title}>Welcome to bountyscape</h1>
          <Image
            src="https://i.ibb.co/N2xdQs5/Logobountyscape.png"
            width="300%"
            height="300%"
            alt="logo"
            quality="100"
          />
        </div>
        
      </main>
    </>
  );
};

export default Home;
