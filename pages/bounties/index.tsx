import { GetBounties } from "../../components/scFunctions/read/getBounties";



function BountyOverview() {

    //const list = GetBounties();
    const list = ["IPFS1", "IPFS2", "IPFS3"];
    console.log(list)
    
    return (
        <><div>
            <h1>Bounty Overview</h1>
        </div>
                {list.map((item) => {
                    return (
                        <div key={item}>
                            {item}
                        </div>
                    );
                }
                )}
            </>    
    );
}

export default BountyOverview;