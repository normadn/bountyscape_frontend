import { useRouter } from "next/router";

function BountyDetail() {
  const router = useRouter();
  const { ipfsId } = router.query;
  return (
    <main className="min-h-screen">
      {" "}
      <h1>Bounty Detail</h1>
      <p>ipfsId: {ipfsId}</p>
    </main>
  );
}

export default BountyDetail;
