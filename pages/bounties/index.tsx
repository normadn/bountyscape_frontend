import { GetBounties } from "../../components/scFunctions/read/getBounties";
import Link from "next/link";
import { GrantRoleEmployer } from '../../components/scFunctions/write/grantRoleEmployer';



const bountyList = ['QmaRwZiC1SmAqTWx2aB6PmdcXDUU11H9hUY1bncZ4GJJeb','QmZ6NSLSm2nybYwiQbPu5Rq8CwDatnhQ9DYvQGyvaEgKDb'] //GetBounties();

export async function getStaticProps() {
    // Call an external API endpoint to get posts
    let ipfs = new Array<JSON>;
    for (let i = 0; i < bountyList.length; i++) {
        const bounty = await fetch('https://gateway.pinata.cloud/ipfs/' + bountyList[i])
        ipfs.push(await bounty.json());
    }

    return {
      props: {
        ipfs,
      },
    }
  }
    
  
function BountyOverview({ ipfs }) {

  return (
    <main className="min-h-screen">

            <div className="grid justify-items-center">

            <Link href={"/bounties/create"}><button className="btn btn-primary my-8">New Bounty</button></Link>

            <div className="text-2xl font-bold mt-8">Bounty Overview</div>
            <br/>
            
            {ipfs.map((item:any, i:number ) => {
    return (
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
          <div className="card-actions justify-end">
            
            
            <Link className="btn btn-primary my-8" href={"/bounties/"+bountyList[i]}>Details</Link>
          </div>
        </div>
      </div>
     
    );
  })}

      
       </div>
   </main>
  );
}

export default BountyOverview;
