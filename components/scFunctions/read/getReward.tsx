import { utils } from 'ethers'
import { useContractRead, useNetwork } from 'wagmi'
import Bountyscape from '../../../utils/Bountyscape.json'

export function GetReward({ tokenId }) {
  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Goerli' ? '0xDFDc2E99A1De4ea9DAf44591fd4d8a1C555F8472' : '0xd821C935B8fAA376a4E7382b7EDbc0682A769310'

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

