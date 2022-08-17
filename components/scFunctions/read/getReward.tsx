import { utils } from 'ethers'
import { useContractRead, useNetwork } from 'wagmi'
import Bountyscape from '../../../utils/Bountyscape.json'

export function GetReward({ tokenId }) {
  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Goerli' ? '0xDFDc2E99A1De4ea9DAf44591fd4d8a1C555F8472' : '0x0140CeC539ee2cf6bECA0597E1eFD2b723A0EBF7'

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

