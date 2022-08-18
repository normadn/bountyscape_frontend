import { utils } from 'ethers'
import { useContractRead, useNetwork } from 'wagmi'
import Bountyscape from '../../../utils/Bountyscape.json'

export function GetReward({ tokenId } : { tokenId: string | string[] | undefined }) {
  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Goerli' ? '0xB4902E7c5F1645B955E565Cd9d49b04B8770A1Bd' : '0x7bE0571a42bF0e4429d1fbcECA791575CFb73b4E'

  const { data:reward, isLoading:isLoadingTokenId, isSuccess:isSuccessTokenId } = useContractRead({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: 'tokenIDtoReward',
    args: [tokenId],
  })
  
  return (
    ( (isSuccessTokenId && reward !== undefined) && <div> {utils.formatEther(reward.toString())} {chain?.name === 'Goerli' ? "ETH" : "EVMOS"}</div> ) || <div> 0 </div>
  )
}

