import { useContractRead, useNetwork } from 'wagmi'
import Bountyscape from '../../../utils/Bountyscape.json'

export function GetClaimers(ipfsId: string | string[] | undefined) {
  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Goerli' ? '0xDFDc2E99A1De4ea9DAf44591fd4d8a1C555F8472' : '0x0140CeC539ee2cf6bECA0597E1eFD2b723A0EBF7'

  const { data, isLoading, isSuccess } = useContractRead({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: 'getClaimers',
    args: [ipfsId],
  })
  
  return data;
}