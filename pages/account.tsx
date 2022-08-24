/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Quadrata from "../utils/Quadrata.json";
import Bountyscape from '../utils/Bountyscape.json'
import DemoApp from "../components/quadrata/all";
import { useAccount, useContractRead, usePrepareContractWrite, useNetwork, useBalance } from "wagmi";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Result } from "ethers/lib/utils";
import { ClaimFunds } from "../components/scFunctions/write/claimFunds";
import { evmosToEth, ethToEvmos } from "@tharsis/address-converter";

async function GetIPFS(bounties: string | Result | undefined) {
  let ipfs = new Array<JSON>;

  if (bounties !== undefined && bounties !== [] && bounties !== null && bounties.length !== undefined) {
    for (let i = 0; i < bounties.length; i++) {
      if (bounties[i] !== '' && bounties[i] !== null && bounties[i] !== undefined) {
        const bounty = await fetch('https://gateway.pinata.cloud/ipfs/' + bounties[i])
        ipfs.push(await bounty.json());

      }
    }
  } else {
    console.log("No bounty found");
  }

  return ipfs;

}

const Account: NextPage = () => {
  const { address } = useAccount()

  const { chain } = useNetwork();
  const contractAddr = chain?.name === "Goerli"
    ? "0xb049977f9a53dc29aabbb67f9f9a72571a7835f2"
    : chain?.name === "Evmos Testnet"
      ? "0x7bE0571a42bF0e4429d1fbcECA791575CFb73b4E"
      : "0x548325D23dD7FdcD3aC34daCfb51Ad10CeFd13fd";

  const [status, setStatus] = useState("Not Verified KYC/KYB - Become Verified:");
  const [disabled, setDisabled] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<JSON[]>([]);
  const [bounty, setBounty] = useState<JSON[]>([]);
  const [reward, setReward] = useState<any>([]);


  const { data: isBusiness, isLoading: isLoadingTokenId, isSuccess: isSuccessTokenId, error } = useContractRead({
    addressOrName: "0x2B212B47Faf2040cA4782e812048F5aE8ad5Fa2f",
    contractInterface: Quadrata,
    functionName: 'getAttributesFree',
    args: [address, 1, ethers.utils.id('IS_BUSINESS')],
  })


  const { isError: isErrorEmployer } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: "grantRoleEmployer",
  });

  const { isError: isErrorContractor } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: "grantRoleContractor",
  });

  async function getBalanceReward() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contractAddr = chain?.name === "Goerli"
        ? "0xb049977f9a53dc29aabbb67f9f9a72571a7835f2"
        : chain?.name === "Evmos Testnet"
          ? "0x7bE0571a42bF0e4429d1fbcECA791575CFb73b4E"
          : "0x548325D23dD7FdcD3aC34daCfb51Ad10CeFd13fd";
      const bountyscape = new ethers.Contract(contractAddr, Bountyscape.abi, provider);
      const ipfsArray: any = [];
      const rewardArray: any = [];
      const address = await signer.getAddress();
      for (let i = 0; i < 1000; i++) {

        const balance = await bountyscape.balanceOf(address, i)



        if (balance?.toString() !== "0") {
          ipfsArray.push(await bountyscape.tokenIDtoIPFS(i))
          rewardArray.push(ethers.utils.formatEther(await (await bountyscape.tokenIDtoReward(i)).toString()));
        }

        return [ipfsArray, rewardArray]
      }
    } catch (error) {
      console.log(error)
      return [[], []];
    }

  }



  useEffect(() => {
    if (bounty === undefined && data === undefined) {

    } else {
      GetIPFS(bounty)
        .then((res) => {
          setData(res);
          setIsLoaded(true)
        })
        .catch((e) => {
          setIsLoaded(false);
          console.log(e);
        })
    }
  }, [bounty, data, isLoaded]);

  useEffect(() => {
    if (isSuccessTokenId) {
      if (isBusiness?.[0].toString() === "0x7749ed7587e6dbf171ce6be50bea67236732d7ccfd51e327bc28b612ec06faa7") {
        setStatus("Verifed KYB - You are a verified business")
        setDisabled(true);
      } else if (isBusiness?.[0].toString() === "0xa357fcb91396b2afa7ab60192e270c625a2eb250b8f839ddb179f207b40459b4") {
        setStatus("Verified KYC - You are a verified individual")
        setDisabled(true);
      }
    } else {
      setStatus("Not Verified KYC/KYB - Become Verified:")
      setDisabled(false);

    }
  }, [isSuccessTokenId, isBusiness])


  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  useEffect(() => {
    getBalanceReward().then(([ipfsArray, rewardArray]) => {
      if (ipfsArray !== undefined && rewardArray !== undefined) {
        setBounty(ipfsArray);
        setReward(rewardArray);
        (window.ethereum as any).on('accountsChanged', () => { ((window as any).location.reload()) })
      }
    })
  });


  if (!showChild) {
    return null;
  }

  if (typeof window === 'undefined') {
    return <></>;
  } else {
    return (
      <main className="min-h-screen">
        <div className="grid justify-items-center">
          <div className="text-2xl font-bold mt-8">{isErrorContractor && !isErrorEmployer ? "Employer" : "Contractor"} Account Overview</div>
          <br />
          <div className="stats stats-vertical shadow">
            <div className="stat">
              <div className="stat-title">Your Ethereum Address</div>
              <div className="stat-value"> <div className="text-xl font-bold mt-8">{address}</div></div>
            </div>
            <div className="stat">
              <div className="stat-title">Your Cosmos Address</div>
              <div className="stat-value"><div className="text-xl font-bold mt-8">{ethToEvmos(String(address))}</div></div>
            </div>
          </div>

          <div className="stats shadow">

          </div>


          <br />

          {(!isLoaded && isErrorContractor) && <p>loading bounties...</p>}

          {(isLoaded && !isErrorContractor) && (
            <><div className="text-xl font-bold mt-8">Your claimed bountyscape NFTs:</div><div className="grid grid-cols-1 gap-4">
              {data.map((item: any, i: number) => (
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
                    <div className="badge badge-outline badge-success">Reward: {reward[i]}</div>
                    <div className="card-actions justify-end">


                      <ClaimFunds ipfsId={bounty[i]} />
                    </div>
                  </div>
                </div>
              )
              )}
            </div></>
          )}
          <br />
          {chain?.name === "Goerli" && (
            <><div className="text-xl font-bold mt-8">{status}</div><br /><button disabled={disabled} className="btn btn-primary">
              <label htmlFor="my-modal-3" className="modal-button">
                KYC/KYB
              </label>
            </button><input type="checkbox" id="my-modal-3" className="modal-toggle" /><div className="modal">
                <div className="modal-box relative">
                  <label
                    htmlFor="my-modal-3"
                    className="btn btn-primary btn-circle absolute right-2 top-2"
                  >
                    ✕
                  </label>
                  <DemoApp />
                </div>
              </div></>
          )}
        </div>
      </main>
    );
  }
};

export default Account;
