import { utils } from "ethers";
import { useContractRead, useNetwork } from "wagmi";
import Bountyscape from "../../../utils/Bountyscape.json";

export function GetReward({
  tokenId,
}: {
  tokenId: string | string[] | undefined;
}) {
  const { chain } = useNetwork();
  const contractAddr =
    chain?.name === "Goerli"
      ? "0xb049977f9a53dc29aabbb67f9f9a72571a7835f2"
      : chain?.name === "Evmos Testnet"
      ? "0x7bE0571a42bF0e4429d1fbcECA791575CFb73b4E"
      : "0x548325D23dD7FdcD3aC34daCfb51Ad10CeFd13fd";

  const {
    data: reward,
    isLoading: isLoadingTokenId,
    isSuccess: isSuccessTokenId,
  } = useContractRead({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: "tokenIDtoReward",
    args: [tokenId],
  });

  return (
    (isSuccessTokenId && reward !== undefined && (
      <div>
        {" "}
        {utils.formatEther(reward.toString())}{" "}
        {chain?.name === "Goerli" ? "ETH" : "EVMOS"}
      </div>
    )) || <div> 0 </div>
  );
}
