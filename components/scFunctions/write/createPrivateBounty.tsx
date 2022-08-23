import { usePrepareContractWrite, useContractWrite, useNetwork } from 'wagmi'
import Bountyscape from '../../../utils/Bountyscape.json'

export function CreatePrivateBounty() {
  const { chain } = useNetwork()
  const contractAddr = chain?.name === "Goerli"
      ? "0xb049977f9a53dc29aabbb67f9f9a72571a7835f2"
      : chain?.name === "Evmos Testnet" 
      ? "0x7bE0571a42bF0e4429d1fbcECA791575CFb73b4E"
      : "0x548325D23dD7FdcD3aC34daCfb51Ad10CeFd13fd";

  const { config } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: 'createPrivateBounty',
  })
  
  const { data, isLoading, isSuccess, write } = useContractWrite(config)

  return (
    <div>
      <button className="btn btn-primary" onClick={() => write?.()}>Revoke Employer</button>
    </div>
  )
}