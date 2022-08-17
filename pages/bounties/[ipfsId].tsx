import { Result } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ApproveCompletedBounty } from '../../components/scFunctions/write/approveCompletedBounty';
import { ClaimBounty } from '../../components/scFunctions/write/claimBounty';
import { ClaimFunds } from '../../components/scFunctions/write/claimFunds';
import { GetStatus } from '../../components/scFunctions/read/getStatus';
import { GetClaimers } from "../../components/scFunctions/read/getClaimers";
import { CompleteBounty } from '../../components/scFunctions/write/completeBounty';
import { GetReward } from '../../components/scFunctions/read/getReward';
import { GetTokenID } from '../../components/scFunctions/read/getTokenID';
import Bountyscape from '../../utils/Bountyscape.json'
import { useNetwork, usePrepareContractWrite } from "wagmi";

interface ipfsData {
  name: string;
  description: string;
  attributes: [{trait_type: string, value: string}];
  image: string;
  external_url: string;
}


async function GetIPFS(ipfsId: string | Result | undefined) {
  const bounty = await fetch('https://gateway.pinata.cloud/ipfs/' + ipfsId)   
  return bounty.json();  
  }


function BountyDetail() {

  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Goerli' ? '0xDFDc2E99A1De4ea9DAf44591fd4d8a1C555F8472' : '0x0140CeC539ee2cf6bECA0597E1eFD2b723A0EBF7'


  const { isError: isErrorEmployer, } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: 'grantRoleEmployer',
  })

  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<ipfsData>();
  const router = useRouter();
  const { ipfsId } = router.query;
  const status = GetStatus(ipfsId);
  const claimers = GetClaimers(ipfsId);
  const tokenId = GetTokenID(ipfsId);

  useEffect(() => {
    GetIPFS(ipfsId)
      .then((res) => {
        setData(res);
        setIsLoaded(true);
      })
      .catch((e) => {
        setIsLoaded(false);
        console.log(e);
      });
  });

  
  return (
    <main className="min-h-screen">
    
      <div className="grid justify-items-center">

      <div className="text-2xl font-bold mt-8">Bounty Details</div>
      {!isLoaded && <p>loading bounty...</p>}
      
      {isLoaded && (data) && (

        <div className="grid justify-items-center grid-cols-1 gap-4">
        <Image src={data.image} width="200%" height="100%" quality="100"/>   
      <p>Title: {data.name}</p>
      <p>Description: {data.description}</p>
      <p>Type: {data.attributes[0].value}</p>
      <p>ERC-1155 Token ID: {tokenId}</p>
      <p>Rewards: <GetReward tokenId={tokenId}/></p>
      <p>Status: {status ? "Done" : "Open for Claimers"}</p>

      <ClaimBounty ipfsId={ipfsId}/>
      <button className="btn btn-primary" disabled={!isErrorEmployer} onClick={() => window.location = 'mailto:yourmail@domain.com'}>Submit work</button>
      <CompleteBounty ipfsId={ipfsId}/>
      <ClaimFunds ipfsId={ipfsId}/>

      

      <div className="text-2xl font-bold mt-8">Claims History</div>
      {claimers?.map((claimer) => ( 
        <div className="grid justify-items-center grid-cols-1 gap-4">
          <p>Claimer: {claimer}</p>
          <ApproveCompletedBounty ipfsId={ipfsId} claimer={claimer}/>
        </div>
          ))}
      

      </div>
      )}
    
      </div>



    </main>
  );
}

export default BountyDetail;
