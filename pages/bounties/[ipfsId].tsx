import { Result } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { ApproveCompletedBounty } from "../../components/scFunctions/write/approveCompletedBounty";
import { ClaimBounty } from "../../components/scFunctions/write/claimBounty";
import { ClaimFunds } from "../../components/scFunctions/write/claimFunds";
import { GetStatus } from "../../components/scFunctions/read/getStatus";
import { GetClaimers } from "../../components/scFunctions/read/getClaimers";
import { CompleteBounty } from "../../components/scFunctions/write/completeBounty";
import { GetReward } from "../../components/scFunctions/read/getReward";
import { GetTokenID } from "../../components/scFunctions/read/getTokenID";
import Bountyscape from "../../utils/Bountyscape.json";
import { useAccount, useNetwork, usePrepareContractWrite } from "wagmi";

import storage from "../../utils/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Link from "next/link";

import { create } from "ipfs-http-client";

const blockscapeIPFS = create({
  host: "ipfs.blockscape.network",
  port: 443,
  protocol: "https",
});

interface ipfsData {
  name: string;
  description: string;
  attributes: [
    { trait_type: string; value: string },
    { trait_type: string; value: string }
  ];
  image: string;
  external_url: string;
}

async function GetIPFS(ipfsId: any) {
  // const bounty = await fetch("https://gateway.pinata.cloud/ipfs/" + ipfsId);
  // return bounty.json();

  try {
    const source = blockscapeIPFS.cat(ipfsId);
    const data = [];
    for await (const chunk of source) {
      data.push(chunk);
    }
    const byteArray = data.toString().split(",");
    var bounty = "";
    for (let j = 0; j < byteArray.length; j++) {
      bounty += String.fromCharCode(Number(byteArray[j]));
    }
    return JSON.parse(bounty);
  } catch (error) {
    console.log(error);
    const source = blockscapeIPFS.cat(ipfsId);
    const data = [];
    for await (const chunk of source) {
      data.push(chunk);
    }
    const byteArray = data.toString().split(",");
    var bounty = "";
    for (let j = 0; j < byteArray.length; j++) {
      bounty += String.fromCharCode(Number(byteArray[j]));
    }
  }

  return JSON.parse(bounty);
}

function BountyDetail() {
  const { address } = useAccount();

  // State to store uploaded file
  const [file, setFile] = useState("");

  // progress
  const [percent, setPercent] = useState(0);

  // Handle file upload event and update state
  function handleChange(event: {
    target: { files: SetStateAction<string>[] };
  }) {
    setFile(event.target.files[0]);
  }

  const handleUpload = () => {
    if (!file) {
      alert("Please upload a txt file first!");
    }

    const storageRef = ref(storage, `/files/${ipfsId}${address}.txt`);

    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {});
      }
    );
  };

  const { chain } = useNetwork();
  const contractAddr =
    chain?.name === "Goerli"
      ? "0xb049977f9a53dc29aabbb67f9f9a72571a7835f2"
      : chain?.name === "Evmos Testnet"
      ? "0x7bE0571a42bF0e4429d1fbcECA791575CFb73b4E"
      : "0x548325D23dD7FdcD3aC34daCfb51Ad10CeFd13fd";

  const { isError: isErrorEmployer } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: "grantRoleEmployer",
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<ipfsData>();
  const router = useRouter();
  const { ipfsId } = router.query;
  const status = GetStatus(ipfsId);
  const claimers = GetClaimers(ipfsId);
  const tokenId = GetTokenID(ipfsId);

  useEffect(() => {
    GetIPFS(ipfsId)
      .then((res) => {
        setData(res);
        setIsLoaded(true);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [ipfsId, claimers]);

  const { isError: isPrepareError } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: "claimBounty",
    args: [ipfsId],
  });

  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window === "undefined") {
    return <></>;
  } else {
    return (
      <main className="min-h-screen">
        <div className="grid justify-items-center">
          <div className="text-2xl font-bold mt-8">Bounty Details</div>
          {!isLoaded && <button className="btn btn-primary" onClick={() => {(window as any).location.reload()}}>Reload bounties</button>}

          {isLoaded && data && (
            <div className="grid justify-items-center grid-cols-1 gap-4">
              <Image
                src={data.image}
                width="200%"
                height="100%"
                quality="100"
                alt="NFT"
              />
              <p>Title: {data.name}</p>
              <p>Description: {data.description}</p>
              <p>Type: {data.attributes[0].value}</p>
              <p>
                License Requirement:{" "}
                {data?.attributes[1]?.value === undefined
                  ? "none"
                  : data.attributes[1].value}
              </p>
              <p>ERC-1155 Token ID: {tokenId}</p>
              <p>
                Rewards: <GetReward tokenId={tokenId} />
              </p>
              <p>Status: {status ? "Done" : "Open for Claimers"}</p>

              <ClaimBounty ipfsId={ipfsId} />

              <button
                disabled={!isErrorEmployer || !isPrepareError}
                className="btn btn-primary modal-button"
              >
                {" "}
                <label htmlFor="my-modal">Submit work</label>{" "}
              </button>
              <input type="checkbox" id="my-modal" className="modal-toggle" />
              <div className="modal">
                <div className="modal-box grid justify-items-center">
                  <label
                    htmlFor="my-modal"
                    className="btn btn-sm btn-circle absolute right-2 top-2"
                  >
                    ✕
                  </label>
                  <div>
                    {" "}
                    <input
                      className="center w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-yellow-50 file:text-yellow-700
                      hover:file:bg-yellow-100 "
                      type="file"
                      onChange={handleChange}
                      accept="/*"
                    />{" "}
                  </div>
                  <br />
                  <button className="btn btn-primary" onClick={handleUpload}>
                    Upload your work
                  </button>
                  <br />
                  <progress
                    className="progress progress-primary w-56"
                    value={percent}
                    max="100"
                  ></progress>
                  <div hidden={!(percent === 100)} className="text-center">
                    {" "}
                    Work uploaded!
                  </div>
                </div>
              </div>

              <CompleteBounty ipfsId={ipfsId} />
              <ClaimFunds ipfsId={ipfsId} />

              <div className="text-2xl font-bold mt-8">Claims History</div>
              {claimers?.map((claimer) => (
                <div
                  className="grid justify-items-center grid-cols-1 gap-4"
                  key={claimer}
                >
                  <Link
                    href={`https://firebasestorage.googleapis.com/v0/b/bountyscape-b7f21.appspot.com/o/files%2F${ipfsId}${claimer}.txt?alt=media&token=bbeac4fc-5c48-472e-b3be-b68e45d255da`}
                  >
                    <p className="link">
                      {" "}
                      Claimer: {claimer}{" "}
                      <Image
                        src="https://i.ibb.co/FYTHRRQ/foreign.png"
                        alt="link"
                        width="17px"
                        height="17px"
                      />
                    </p>
                  </Link>
                  <ApproveCompletedBounty ipfsId={ipfsId} claimer={claimer} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }
}

export default BountyDetail;
