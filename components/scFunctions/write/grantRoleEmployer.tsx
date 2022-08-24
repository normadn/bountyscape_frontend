import Router from 'next/router'
import { useEffect } from 'react';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useNetwork } from 'wagmi'
import Bountyscape from '../../../utils/Bountyscape.json'

export function GrantRoleEmployer() {

  const { chain } = useNetwork()
  const contractAddr = chain?.name === "Goerli"
      ? "0xb049977f9a53dc29aabbb67f9f9a72571a7835f2"
      : chain?.name === "Evmos Testnet" 
      ? "0x7bE0571a42bF0e4429d1fbcECA791575CFb73b4E"
      : "0x548325D23dD7FdcD3aC34daCfb51Ad10CeFd13fd";

  const { config, error: prepareError, isError: isPrepareError, } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: 'grantRoleEmployer',
  })

  const { isError: isErrorContractor, } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: 'grantRoleContractor',
  })
  
  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  useEffect(() => {
    if(isSuccess) {
      setTimeout(() => {
        Router.push('/bounties')
      }, 1000);
    }
  }, [isSuccess]);

  return (
    <div>
      <button className="btn btn-primary my-8 " disabled={!write || isLoading || isErrorContractor} onClick={() => write?.()}>
        {isLoading ? 'Setting Status...' : 'Become Employer'}
      </button>
      {isSuccess && (
        <>
          <div className="toast toast-end">
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
          </div>
        </>
      )}
      {(isError) && (
        
      <>
        <div className="toast toast-end">
          <div className="alert alert-error">
            <div>
              <span>{(prepareError || error)?.message}</span>
            </div>
          </div>
        </div>
      </>
      )}
    </div>
  )
}