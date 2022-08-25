import Router from 'next/router'
import { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from "wagmi";
import type { NextPage } from 'next';
import Bountyscape from '../utils/Bountyscape.json';
import { GrantRoleEmployer } from '../components/scFunctions/write/grantRoleEmployer';
import { GrantRoleContractor } from '../components/scFunctions/write/grantRoleContractor';
;
import { usePrepareContractWrite, useNetwork } from 'wagmi'

const Onboarding: NextPage = () => {
  const { chain } = useNetwork()

  const contractAddr = chain?.name === "Goerli"
  ? "0xb049977f9a53dc29aabbb67f9f9a72571a7835f2"
  : chain?.name === "Evmos Testnet" 
  ? "0x7bE0571a42bF0e4429d1fbcECA791575CFb73b4E"
  : "0x548325D23dD7FdcD3aC34daCfb51Ad10CeFd13fd";

  const { isConnected } = useAccount();

  const { isError: isErrorContractor, } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: 'grantRoleContractor',
  })

  useEffect(() => {
    if(isErrorContractor) {
      setTimeout(() => {
        Router.push('/bounties')
      }, 100);
    }
  }, [isErrorContractor]);

  return (
    <main className="min-h-screen">
      <div className="grid justify-items-center">
        <div className="text-2xl font-bold mt-8">Hello Fren 👋</div>
        <div className="text-2xl mt-4">To get started:</div>
        <div className="text-2xl mt-2">1. Connect your wallet</div>
        <div className="text-2xl mt-2 mb-8">2. Let us know how you want to participate</div>

        { isConnected ? 
          <></> :
          <ConnectButton
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
        }
        
        <div className="grid grid-cols-2 gap-8 mt-8">
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Employer</h2>
              <p>Choose this role if you want to outsource work via bounties</p>
              <div className="card-actions justify-center">
                <GrantRoleEmployer />
              </div>
            </div>
          </div>

          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Contractor</h2>
              <p>Choose this role to claim bounties and rewards</p>
              <div className="card-actions justify-center">
                <GrantRoleContractor />                
              </div>
            </div>
          </div>
        </div>
      </div>    
    </main>
  );
};

export default Onboarding;
