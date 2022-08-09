import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import Bountyscape from '../../../utils/Bountyscape.json'

export function RevokeRoleContractor() {
  const { config } = usePrepareContractWrite({
    addressOrName: '0xd821C935B8fAA376a4E7382b7EDbc0682A769310',
    contractInterface: Bountyscape.abi,
    functionName: 'revokeRoleContractor',
  })
  
  const { data, isLoading, isSuccess, write } = useContractWrite(config)

  return (
    <div>
      <button className="btn btn-primary my-8" onClick={() => write?.()}>Revoke Contractor</button>
    </div>
  )
}