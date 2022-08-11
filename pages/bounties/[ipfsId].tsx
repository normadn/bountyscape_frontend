import { Result } from "ethers/lib/utils";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ApproveCompletedBounty } from '../../components/scFunctions/write/approveCompletedBounty';
import { ClaimBounty } from '../../components/scFunctions/write/claimBounty';
import { ClaimFunds } from '../../components/scFunctions/write/claimFunds';
import { GetStatus } from '../../components/scFunctions/read/getStatus';
import { GetClaimers } from "../../components/scFunctions/read/getClaimers";

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

  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<ipfsData>();

  const router = useRouter();
  const { ipfsId } = router.query;
  const status = GetStatus(ipfsId);
  const claimers = GetClaimers(ipfsId);
  const claimer = "0x0000000000000000000000000000000000000000";//tbd

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
  }, [ipfsId]);

  
  return (
    <main className="min-h-screen">
    
      <div className="grid justify-items-center">

      <div className="text-2xl font-bold mt-8">Bounty Details</div>
      {!isLoaded && <p>loading bounty...</p>}
      
      {isLoaded && (

        <div className="grid justify-items-center grid-cols-1 gap-4">
        <Image src={data.image} width="200%" height="100%" quality="100"/>   
      <p>Title: {data.name}</p>
      <p>Description: {data.description}</p>
      <p>Type: {data.attributes[0].value}</p>
      <p>Status: {status ? "Done" : "Open for Claimers"}</p>

      <ClaimBounty ipfsId={ipfsId}/>
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
