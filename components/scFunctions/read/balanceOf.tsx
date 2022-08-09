import { useContractRead } from 'wagmi'
import Bountyscape from '../../../utils/Bountyscape.json'

export function BalanceOf(account:string, tokenId:BigInt) {
  const { data, isLoading, isSuccess } = useContractRead({
    addressOrName: '0xd821C935B8fAA376a4E7382b7EDbc0682A769310',
    contractInterface: Bountyscape.abi,
    functionName: 'balanceOf',
    args: [account, tokenId],
  })
  
  return data;
}