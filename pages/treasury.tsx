import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Image from "next/image";

const Treasury: NextPage = () => {
  return (
    <>
      <main className="min-h-screen">
        <div className="grid justify-items-center">
          <h1 className={styles.title}>bountyscape treasury</h1>
          <Image
            src="https://i.ibb.co/N2xdQs5/Logobountyscape.png"
            width="100%"
            height="100%"
            alt="logo"
            quality="100"
          />
          <br/>

          <div className="stats bg-primary text-primary-content">
            <div className="stat">
              <div className="stat-title">Treasury balance</div>
              <div className="stat-value">$89,400</div>
              <div className="stat-actions">
                <label className="btn btn-sm btn-success">Staking APY: 8%</label>
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">Your rewards balance</div>
              <div className="stat-value">$89,400</div>
              <div className="stat-actions">
                <button className="btn btn-sm">Claim Rewards</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Treasury;
