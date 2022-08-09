import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import Bountyscape from '../../../utils/Bountyscape.json'

export function GrantRoleContractor() {
  const { config, error: prepareError, isError: isPrepareError, } = usePrepareContractWrite({
    addressOrName: '0xd821C935B8fAA376a4E7382b7EDbc0682A769310',
    contractInterface: Bountyscape.abi,
    functionName: 'grantRoleContractor',
  })
  
  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return (

<div>
      <button className="btn btn-primary" disabled={!write || isLoading} onClick={() => write?.()}>
        {isLoading ? 'Setting Status...' : 'Become Contractor'}
      </button>
      {isSuccess && (
        <div>
          You are now an Contractor
          <div>
            <a href={`https://evm.evmos.dev/tx/${data?.hash}`}>Evmos Explorer</a>
          </div>
        </div>
      )}
      {(isPrepareError || isError) && (
        <div>Error: {(prepareError || error)?.message}</div>
      )}
    </div>
  )
}