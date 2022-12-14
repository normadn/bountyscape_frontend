import Link from "next/link";
import { useContractRead, useNetwork, usePrepareContractWrite, useProvider } from 'wagmi'
import Bountyscape from '../../utils/Bountyscape.json'
import { useEffect, useState } from 'react';
import { Result } from "ethers/lib/utils";
import { GetReward } from "../../components/scFunctions/read/getReward";
import { DeleteBounty } from "../../components/scFunctions/write/deleteBounty";
import { create } from "ipfs-http-client";


const blockscapeIPFS = create({
  host: "ipfs.blockscape.network",
  port: 443,
  protocol: "https",
});

console.log (blockscapeIPFS);

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
            bounty += String.fromCharCode(Number(byteArray[j]));
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
      console.log("No retrobounty found");
    }
  
  return [ipfs, bountyArray, tokenIdArray];  

}
  
function BountyOverview() {

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
      <div className="grid justify-items-center">
        <br/>
      <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box w-60">
  <div className="collapse-title text-xl font-medium">
    What are RetroBounties?
  </div>
  <div className="collapse-content"> 
    <p >RetroBounties are our approach to support the development of public goods. <br/>The idea is based on the novel concept of retroactive public goods funding.</p>
  </div>
</div>
<div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box w-60">
  <div className="collapse-title text-xl font-medium">
    How does it work?
  </div>
  <div className="collapse-content"> 
    <p >There are periodical RetroBounty rounds. Each round has a specific purpose. Everyone can submit RetroBounties to the round and assign them a reward or just donate to the round, if he or she likes the purpose of it. In contrast to the standard bounties, the rewards of the RetroBounties are collected in a RetroBounty treasury and will be distributed to the Retrobunties retroactively!</p>
  </div>
</div>
<div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box w-60">
  <div className="collapse-title text-xl font-medium">
    Who gets which reward?
  </div>
  <div className="collapse-content"> 
    <p >After the RetroBounty round has ended, there will be a quadratic voting by the bountyscape DAO members. The rewards are then distributed based on the idea of the retroactive public goods funding.</p>
  </div>
  
</div>
      <Link href={"/retrobounties/create"}>
        <button 
          className="btn btn-primary my-4" 
          disabled={!isErrorContractor}
        >
          New RetroBounty
        </button>
      </Link>
      <button 
          className="btn btn-primary" 
          disabled={!isErrorContractor}
        >
          Donate to Round #1
        </button>
      <div className="text-2xl font-bold mt-8">
        RetroBounty Round #1
      </div>
      <p>TBD</p>
      <br/>
      {!isLoaded  && <button className="btn btn-primary" onClick={() => {(window as any).location.reload()}}>Reload retrobounties</button>}

      {isLoaded && (
        <div className="grid grid-cols-1 gap-4">
          {data.map((item:any, i:number ) => (
          (item?.attributes[2]?.value === "RetroBounty" ? true : false) && 
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
              <p>{item.description}</p>
              <div className="badge badge-outline badge-primary">License: {item?.attributes[1]?.value === undefined ? "none" : item.attributes[1].value}</div>
              <div className="card-actions justify-end">
                <button className="btn btn-outline btn-primary btn-sm"><Link  href={"/bounties/"+bounty?.[i]}>Details</Link></button>
              </div>
            </div>
            <div hidden={!isErrorContractor}><div className="card-actions justify-start"> <DeleteBounty ipfsId={bounty?.[i]}></DeleteBounty></div></div>
          </div>
          ))}
        </div>
      )}
    </div>      
   </main>
  );
}

export default BountyOverview;
