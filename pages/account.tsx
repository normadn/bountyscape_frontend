// import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import type { NextPage } from 'next';
import Bountyscape from '../utils/Bountyscape.json';
import styles from '../styles/Home.module.css';

const Account: NextPage = () => {


  
  const { data, isLoading, isSuccess, write } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: '0xd821C935B8fAA376a4E7382b7EDbc0682A769310',
    contractInterface: Bountyscape.abi,
    functionName: 'grantRoleEmployer',
  })
  

  return (
    <>
      <main className={styles.main}>
    
      <button disabled={!write} onClick={() => write?.()}>
        Get the Employer status
      </button>
      <button disabled={!write} onClick={() => write?.()}>
        Revoke your Employer status
      </button>
      <button disabled={!write} onClick={() => write?.()}>
        Get the Contractor status
      </button>
      <button disabled={!write} onClick={() => write?.()}>
        Revoke your Contractor status
      </button>
       
      </main>
    </>
  );
};

export default Account;
