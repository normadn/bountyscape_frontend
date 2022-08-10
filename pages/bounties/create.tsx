
import { CreateBounty } from "../../components/scFunctions/write/createBounty"

function BountyDetail() {

  const ipfsId = 1
  const val = "1";


  return (
    <main className="min-h-screen">
      <div className="grid justify-items-center">
            <div className="text-2xl font-bold mt-8">Create New Bounty</div>
            

      <CreateBounty ipfsId={ipfsId} val={val}/>
      </div>
    </main>
  );
}

export default BountyDetail;
