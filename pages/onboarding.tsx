// import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContractWrite } from "wagmi";
import type { NextPage } from 'next';
import Bountyscape from '../utils/Bountyscape.json';
import { GrantRoleEmployer } from '../components/scFunctions/write/grantRoleEmployer';
import { GrantRoleContractor } from '../components/scFunctions/write/grantRoleContractor';

const Onboarding: NextPage = () => {

  return (
    <main className="min-h-screen">
        <div className="grid justify-items-center">
            <div className="text-2xl font-bold mt-8">Hello Fren 👋</div>
            <div className="text-2xl mt-4">To start let us know who u are:</div>
            <div> <GrantRoleEmployer /></div>
            <div><GrantRoleContractor /></div>
  
      
    
        </div>    
    </main>
  );
};

export default Onboarding;
