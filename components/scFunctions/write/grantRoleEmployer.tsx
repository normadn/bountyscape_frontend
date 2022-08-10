import { Address } from 'cluster';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useNetwork } from 'wagmi'
import Bountyscape from '../../../utils/Bountyscape.json'




export function GrantRoleEmployer() {

  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Goerli' ? '0xDFDc2E99A1De4ea9DAf44591fd4d8a1C555F8472' : '0xd821C935B8fAA376a4E7382b7EDbc0682A769310'

  const { config, error: prepareError, isError: isPrepareError, } = usePrepareContractWrite({
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
      <button className="btn btn-primary my-8 " disabled={!write || isLoading} onClick={() => write?.()}>
        {isLoading ? 'Setting Status...' : 'Become Employer'}
      </button>
      {isSuccess && (
        <><div className="toast toast-end">
        <div className="alert alert-success">
          <div>
          <div>
          You are now an Employer
          {/* <div>
            <a href={`https://evm.evmos.dev/tx/${data?.hash}`}>Evmos Explorer</a>
          </div> */}
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