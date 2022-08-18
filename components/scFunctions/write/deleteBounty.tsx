import { ethers } from 'ethers'
import { usePrepareContractWrite, useContractWrite, useNetwork,useWaitForTransaction } from 'wagmi'
import Bountyscape from '../../../utils/Bountyscape.json'

export function DeleteBounty({ipfsId} : {ipfsId: any}) {



  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Goerli' ? '0xB4902E7c5F1645B955E565Cd9d49b04B8770A1Bd' : '0x7bE0571a42bF0e4429d1fbcECA791575CFb73b4E'

  const { config, error: prepareError, isError: isPrepareError, } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: 'deleteBounty',
    args: [ipfsId],
  })
  
  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })


  return (
    <div>
      <button className="btn btn-link btn-red btn-xs" onClick={() => write?.()}>
      {(!isLoading && !isSuccess) ? 'Delete' : ''}
        {(isLoading ) ? 'Deleting...' : ''}
        {(!isLoading && isSuccess) ? 'Bounty deleted!' : ''}
      </button>
      
      {(isError) && (
        
      // <><div className="toast toast-end">
      //     <div className="alert alert-error">
            <div>
              <span>{(prepareError || error)?.message}</span>
            </div>
        //   </div>
        // </div></>
        
          
      )}
    </div>
  )
}