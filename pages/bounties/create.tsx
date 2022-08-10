import { CreateBounty } from "../../components/scFunctions/write/createBounty";

function BountyDetail() {
  const ipfsId = 1;
  const val = "1";

  return (
    <main className="min-h-screen">
      <div className="grid justify-items-center">
        <div className="text-2xl font-bold mt-8">Create New Bounty</div>
        <br/>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Bounty Title</span>
          </label>
          <input
            type="text"
            placeholder="Enter Bounty Title"
            className="input input-bordered input-primary w-full max-w-xs"
          />
          <label className="label"></label>
          <label className="label">
            <span className="label-text">Reward Amount</span>
          </label>
          <input
            type="number"
            placeholder="Enter Reward Amount"
            className="input input-bordered input-primary w-full max-w-xs"
          />
          <label className="label"></label>
          <label className="label">
            <span className="label-text">Bounty Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered textarea-primary textarea-lg w-full max-w-xs"
            placeholder="Enter Description"
          ></textarea>
          <label className="label">
            <span className="label-text">Bounty Type</span>
          </label>
          <select className="select select-bordered select-primary">
            <option disabled selected>
              Select Bounty Type
            </option>
            <option>Coding</option>
            <option>Design</option>
            <option>SEO</option>
            <option>Marketing</option>
            <option>Website</option>
            <option>Consulting</option>
          </select>
          <label className="label"></label>
        </div>
        <CreateBounty ipfsId={ipfsId} val={val} />
      </div> 
    </main>
  );
}

export default BountyDetail;
