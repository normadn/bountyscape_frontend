import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useNetwork } from 'wagmi'
import Bountyscape from '../../../utils/Bountyscape.json'

export function GrantRoleContractor() {
  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Goerli' ? '0xB4902E7c5F1645B955E565Cd9d49b04B8770A1Bd' : '0x7bE0571a42bF0e4429d1fbcECA791575CFb73b4E'

  const { config, error: prepareError, isError: isPrepareError, } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: 'grantRoleContractor',
  })

  const { isError: isErrorEmployer, } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: 'grantRoleEmployer',
  })
  
  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return (
    <div>
      <button className="btn btn-primary my-8 " disabled={!write || isLoading || isErrorEmployer} onClick={() => write?.()}>
        {isLoading ? 'Setting Status...' : 'Become Contractor'}
      </button>
      {isSuccess && (
        <><div className="toast toast-end">
        <div className="alert alert-success">
          <div>
          <div>
          You are now an Contractor
          <div>
            <a href={`https://evm.evmos.dev/tx/${data?.hash}`}>Evmos Explorer</a>
          </div>
        </div>
          </div>
        </div>
      </div></>
      )}
      {(isError) && (
        
      <><div className="toast toast-end">
          <div className="alert alert-error">
            <div>
              <span>{(prepareError || error)?.message}</span>
            </div>
          </div>
        </div></>
        
          
      )}
    </div>
  )
}