import { useRouter } from "next/router";


function BountyDetail() {
    const router = useRouter();
    const { ipfsId } = router.query;
    return (
        <div>
        <h1>Bounty Detail</h1>
        <p>ipfsId: {ipfsId}</p>
        </div>
    );
}

export default BountyDetail;
