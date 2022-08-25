import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { useContractRead, useNetwork, usePrepareContractWrite, useProvider } from 'wagmi'
import Bountyscape from '../utils/Bountyscape.json'
import { useEffect, useState } from 'react';
import { Result } from "ethers/lib/utils";
import { GetReward } from "../components/scFunctions/read/getReward";
import { DeleteBounty } from "../components/scFunctions/write/deleteBounty";
import { create } from "ipfs-http-client";


const blockscapeIPFS = create({
  host: "ipfs.blockscape.network",
  port: 443,
  protocol: "https",
});


async function GetIPFS(bounties: string | Result | undefined) {

  let bountyArray = [];
  let tokenIdArray = [];

  let ipfs = new Array<JSON>;

  if (bounties !== undefined && bounties !== [] && bounties !== null) {
      for (let i = 0; i < bounties.length; i++) { 
        if ( bounties[i] !== '' && bounties[i] !== null && bounties[i] !== undefined) {

          const source = blockscapeIPFS.cat(bounties[i]);
          const data = [];
          for await (const chunk of source) {
            data.push(chunk);
          }
          const byteArray = data.toString().split(",");
          var bounty = "";
          for (let j = 0; j < byteArray.length; j++) {
            bounty += String.fromCharCode(byteArray[j]);
          }

        //const bounty = await fetch('https://gateway.pinata.cloud/ipfs/' + bounties[i])
        //ipfs.push(await bounty.json());
        ipfs.push(JSON.parse(bounty));
        bountyArray.push(bounties[i]);
        tokenIdArray.push(i);
        } 
    }
    } else 
    {
      console.log("No bounty found");
    }
  
  return [ipfs, bountyArray, tokenIdArray];  

}
  
const Home: NextPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<JSON[]>([]);
  const [bounty, setBounty] = useState<JSON[]>([]);
  const [tokenId, setTokenId] = useState<any>([]);
 
  const { chain } = useNetwork()
  const contractAddr = chain?.name === "Goerli"
       ? "0xb049977f9a53dc29aabbb67f9f9a72571a7835f2"
       : chain?.name === "Evmos Testnet" 
       ? "0x7bE0571a42bF0e4429d1fbcECA791575CFb73b4E"
       : "0x548325D23dD7FdcD3aC34daCfb51Ad10CeFd13fd";
 
   const { data:bounties, isSuccess, isLoading } = useContractRead({
     addressOrName: contractAddr,
     contractInterface: Bountyscape.abi,
     functionName: 'getBounties',
   })
 
   const { isError: isErrorContractor, } = usePrepareContractWrite({
     addressOrName: contractAddr,
     contractInterface: Bountyscape.abi,
     functionName: 'grantRoleContractor',
   })

   const { isError: isErrorEmployer } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: "grantRoleEmployer",
   });
 
   useEffect(() => {
     if (!isSuccess && isLoading ) {
        setIsLoaded(false);
      } else {
     GetIPFS(bounties)
       .then(([ipfs, bountyArray, tokenIdArray]) => {
         setData(ipfs);
         setIsLoaded(true);
         setBounty(bountyArray)
         setTokenId(tokenIdArray);
       })
       .catch((e) => {
         setIsLoaded(false);
         console.log(e);
       })};
   }, [bounties, isLoading, isSuccess]);

 
 
   return (
     <main className="min-h-screen">
      <div className="grid grid-cols-3 gap-8 mt-2 mx-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">For Bounty Hunter</h2>
            <p>Claim bounties and reward</p>
            <Link href={"/bounties"}>
              <div>
                <button className="btn btn-primary mt-2">
                  Find Bounties
                </button>
              </div>
            </Link>
          </div>
        </div>
        <div className="flex justify-center">
          {/* <Image
            src="https://i.ibb.co/N2xdQs5/Logobountyscape.png"
            width="180%"
            height="170%"
            alt="logo"
            quality="100"
          /> */}
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">For Employees</h2>
            <p>Outsource work via bounties</p>
            <Link 
              href={
                !isErrorEmployer && !isErrorContractor
                  ? "/onboarding"
                  : "/bounties/create"
              }
            >
              <div>
                <button 
                  className="btn btn-primary mt-2"
                >
                  New Bounty
                </button>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid justify-items-center mb-4">
      <div className="text-2xl font-bold mt-8">
        Bounty Highlights
      </div>
      <br/>
      {!isLoaded  && <div> <p>loading bounties...</p> </div>}

      {isLoaded && (
        <div>    
        <div className="grid grid-cols-1 gap-4">
          {data.map((item:any, i:number ) => (
          <div
            className="card card-compact w-96 bg-base-100 shadow-xl border-10px border-base-200 rounded-lg" 
            key={i}
          >
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{item.name}</h2>
              <div><p>{item.description}</p></div>
              <div className="badge badge-outline">{item.attributes[0].value}</div>
              <div className="badge badge-outline badge-primary">License: {item?.attributes[1]?.value === undefined ? "none" : item.attributes[1].value}</div>
              <div className="badge badge-outline badge-success">Reward: <GetReward tokenId={tokenId[i]} /></div> 
              <div className="card-actions justify-end">
                <button className="btn btn-outline btn-primary btn-sm"><Link  href={"/bounties/"+bounty?.[i]}>Details</Link></button>
              </div>
            </div>
            <div> <div hidden={!isErrorContractor}><div className="card-actions justify-start"> <DeleteBounty ipfsId={bounty?.[i]}></DeleteBounty></div></div></div>
          </div>
          ))}
        </div>
        </div>
      )}
     </div>      
    </main>
   )
}

export default Home;
