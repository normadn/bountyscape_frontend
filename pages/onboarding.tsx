// import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContractWrite } from "wagmi";
import type { NextPage } from 'next';
import Bountyscape from '../utils/Bountyscape.json';

const Onboarding: NextPage = () => {

  const { write: grantRoleEmployer} = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: '0xd821C935B8fAA376a4E7382b7EDbc0682A769310',
    contractInterface: Bountyscape.abi,
    functionName: 'grantRoleEmployer',
  })

  const { write: grantRoleContractor} = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: '0xd821C935B8fAA376a4E7382b7EDbc0682A769310',
    contractInterface: Bountyscape.abi,
    functionName: 'grantRoleContractor',
  })
  

  return (
    <main className="min-h-screen">
        <div className="grid justify-items-center">
            <div className="text-2xl font-bold mt-8">Hello Fren 👋</div>
            <div className="text-2xl mt-4">To start let us know who u are:</div>
            <button 
                className="btn btn-primary my-8"
                onClick={() => grantRoleEmployer?.()}
            >
                Employer
            </button>
            <button 
                className="btn btn-primary my-8"
                onClick={() => grantRoleContractor?.()}
            >
                Contractor
            </button>
        </div>    
    </main>
  );
};

export default Onboarding;
