import { usePrepareContractWrite, useContractWrite, useNetwork } from 'wagmi'
import Bountyscape from '../../../utils/Bountyscape.json'

export function SafeTransferFrom() {

  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Goerli' ? '0xDFDc2E99A1De4ea9DAf44591fd4d8a1C555F8472' : '0x5A7973aF52BE3A8590b6252F069A1e8502B0a975'

  const { config } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: 'safeTransferFrom',
  })
  
  const { data, isLoading, isSuccess, write } = useContractWrite(config)

  return (
    <div>
      <button className="btn btn-primary" onClick={() => write?.()}>Revoke Employer</button>
    </div>
  )
}