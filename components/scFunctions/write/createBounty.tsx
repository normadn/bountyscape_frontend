import { ethers } from 'ethers'
import { usePrepareContractWrite, useContractWrite, useNetwork,useWaitForTransaction } from 'wagmi'
import Bountyscape from '../../../utils/Bountyscape.json'

export function CreateBounty({ipfsContent, val}) {


  const ipfsId = ipfsContent;
  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Goerli' ? '0xDFDc2E99A1De4ea9DAf44591fd4d8a1C555F8472' : '0x0140CeC539ee2cf6bECA0597E1eFD2b723A0EBF7'

  const { config, error: prepareError, isError: isPrepareError, } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: 'createBounty',
    args: [ipfsId],
    overrides: {
      value: ethers.utils.parseEther(val),
    },
  })
  
  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })


  return (
    <div>
      <button className="btn btn-primary " disabled={!write || isLoading} onClick={() => write?.()}>
        {isLoading ? 'Creating...' : 'Confirm'}
      </button>
      {isSuccess && (
        <><div className="toast toast-end">
        <div className="alert alert-success">
          <div>
          <div>
          Bounty created!
          {/* <div>
            <a href={`https://evm.evmos.dev/tx/${data?.hash}`}>Evmos Explorer</a>
          </div> */}
        </div>
          </div>
        </div>
      </div></>
      )}
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