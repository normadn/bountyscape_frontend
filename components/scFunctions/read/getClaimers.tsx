import { useContractRead, useNetwork } from 'wagmi'
import Bountyscape from '../../../utils/Bountyscape.json'

export function GetClaimers(ipfsId: string | string[] | undefined) {
  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Goerli' ? '0xB4902E7c5F1645B955E565Cd9d49b04B8770A1Bd' : '0x7bE0571a42bF0e4429d1fbcECA791575CFb73b4E'

  const { data, isLoading, isSuccess } = useContractRead({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: 'getClaimers',
    args: [ipfsId],
  })
  
  return data;
}