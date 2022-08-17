import Link from "next/link";
import { useContractRead, useNetwork, useProvider } from 'wagmi'
import Bountyscape from '../../utils/Bountyscape.json'
import { useEffect, useState } from 'react';
import { Result } from "ethers/lib/utils";
import { GetReward } from "../../components/scFunctions/read/getReward";



async function GetIPFS(bounties: string | Result | undefined) {
  
  let ipfs = new Array<JSON>;
  if (bounties !== undefined) {
      for (let i = 0; i < bounties.length; i++) { // 10 is the index of the first bounty for testing purposes
        const bounty = await fetch('https://gateway.pinata.cloud/ipfs/' + bounties[i])
        ipfs.push(await bounty.json());
    }
    }
  
  return ipfs;  

  }
  
function BountyOverview() {

 const [isLoaded, setIsLoaded] = useState(false);
 const [data, setData] = useState<JSON[]>([]);

 const { chain } = useNetwork()
 const contractAddr = chain?.name === 'Goerli' ? '0xDFDc2E99A1De4ea9DAf44591fd4d8a1C555F8472' : '0x5A7973aF52BE3A8590b6252F069A1e8502B0a975'



  const { data:bounties, isSuccess } = useContractRead({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: 'getBounties',
  })


  useEffect(() => {
    if (!isSuccess ) {
       setIsLoaded(false);
     } 
    GetIPFS(bounties)
      .then((res:JSON[]) => {
        setData(res);
        console.log(res)
        setIsLoaded(true);
      })
      .catch((e) => {
        setIsLoaded(false);
        console.log(e);
      });
  }, [isSuccess, bounties]);
  

  return (
    <main className="min-h-screen">
      
      <div className="grid justify-items-center">

<Link href={"/bounties/create"}><button className="btn btn-primary my-8">New Bounty</button></Link>

<div className="text-2xl font-bold mt-8">Bounty Overview</div>
<br/>
{!isLoaded  && <p>loading bounties...</p>}

{isLoaded && (
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
<p>{item.description}</p>
<div className="badge badge-outline">{item.attributes[0].value}</div>
<div className="badge badge-outline badge-success">Reward: <GetReward tokenId={i} /></div> 
<div className="card-actions justify-end">


<Link className="btn btn-primary my-8" href={"/bounties/"+bounties?.[i]}>Details</Link>
</div>
</div>
</div>
)
)}
  </div>
)}


</div>
            
   </main>
  );

}

export default BountyOverview;
