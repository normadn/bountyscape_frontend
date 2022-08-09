import { usePrepareContractWrite, useContractWrite, Unit } from 'wagmi'
import Bountyscape from '../../../utils/Bountyscape.json'

export function BalanceOf(account:string, tokenId:BigInt) {
  const { config } = usePrepareContractWrite({
    addressOrName: '0xd821C935B8fAA376a4E7382b7EDbc0682A769310',
    contractInterface: Bountyscape.abi,
    functionName: 'balanceOf',
    args: [account, tokenId],
  })
  
  const { data, isLoading, isSuccess, write } = useContractWrite(config)

  return (
    <div>
      <button className="btn btn-primary" onClick={() => write?.()}>Get Balance</button>
    </div>
  )
}