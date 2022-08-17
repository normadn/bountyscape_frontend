import { utils } from 'ethers'
import { useContractRead, useNetwork } from 'wagmi'
import Bountyscape from '../../../utils/Bountyscape.json'

export function GetReward({ tokenId }) {
  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Goerli' ? '0xDFDc2E99A1De4ea9DAf44591fd4d8a1C555F8472' : '0x5A7973aF52BE3A8590b6252F069A1e8502B0a975'

  const { data:reward, isLoading:isLoadingTokenId, isSuccess:isSuccessTokenId } = useContractRead({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: 'tokenIDtoReward',
    args: [tokenId],
  })
  
  return (
    ( isSuccessTokenId && <div> {utils.formatEther(reward.toString())} {chain?.name === 'Goerli' ? "ETH" : "EVMOS"}</div> ) || <div> 0 </div>
  )
}
