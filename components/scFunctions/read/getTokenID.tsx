import { useContractRead } from 'wagmi'
import Bountyscape from '../../../utils/Bountyscape.json'

export function GetTokenID() {
  const { data, isLoading, isSuccess } = useContractRead({
    addressOrName: '0xd821C935B8fAA376a4E7382b7EDbc0682A769310',
    contractInterface: Bountyscape.abi,
    functionName: 'getTokenID',
  })
  
  return data;
}