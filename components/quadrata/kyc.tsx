import { ErrorType, KycForm, QuadPassportMintParams, QUADRATA_GOVERNANCE_ABI, QUADRATA_PASSPORT_ABI } from '@quadrata/kyc-react';
import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { useContract, useContractRead, useContractWrite, usePrepareContractWrite, useSignMessage, useWaitForTransaction } from 'wagmi'

    const QUADRATA_PASSPORT_ADDRESS = '0x671692b2156312214b20F65b81c438234ac1d6D9';
    const QUADRATA_GOVERNANCE_ADDRESS = '0xa470B40B8A9639f5a868Cb87f02456d9556419d4';

    const API_KEY = '6768938e6e8ac3c6969903341b63adfa212cbe0213b628f0ed7132b6fbaa2372';
    const BACKEND_URL = 'https://prod-testnet-ky0x-processor-api.springlabs.network/v1';

    const ETHERSCAN_URL = 'https://goerli.etherscan.io';

    

const Qkyc = () => {

    const [error, setError] = useState<ErrorType>();
    
    const [account, setAccount] = useState<string>();


    
    const [signature, setSignature] = useState<string>();
    const [mintPrice, setMintPrice] = useState<string>();
    const [mintComplete, setMintComplete] = useState<boolean>(false);
    const [transactionHash, setTransactionHash] = useState<string>();


    const { data:mP, isSuccess:isSuccessMintPrice } = useContractRead({
      addressOrName: QUADRATA_GOVERNANCE_ADDRESS,
      contractInterface: QUADRATA_GOVERNANCE_ABI,
      functionName: 'getMintPrice',
    })
    

     useEffect (() => {
        if (isSuccessMintPrice) {
            setMintPrice(mP?.toString())
        }
        } , [isSuccessMintPrice, mP])
    

    
    
    const { data, isError, isSuccess, signMessage } = useSignMessage({
        })
          if (isSuccess) {
            setSignature(data);
          }
        

    // const HandleMintClick = async (
    //     params: QuadPassportMintParams,
    //     issuerSignature: string,
    //     ledgerSupportedSignature: string,
    // ) => {
    //     // User clicked Approve & Mint Passport button
    //     // the parameters that are being passed to this function is all you need to mint the passport on chain

    //     // Resetting errors in case it's a retry
    //     setError(undefined);
    //     // QuadPassport contract interface (you may use any provider or library to interact with the blockchain)
    

    //     const { config } = usePrepareContractWrite({
    //         addressOrName:  QUADRATA_PASSPORT_ADDRESS,
    //         contractInterface: QUADRATA_PASSPORT_ABI,
    //         functionName: 'mintPassport',
    //         overrides: {
    //             value: ethers.utils.parseEther('mintPrice'),
    //           },
    //         args: [
    //             params,
    //             issuerSignature,
    //             ledgerSupportedSignature
    //         ]
    //       })
    //       const { data, write } = useContractWrite(config)

    //       const { isLoading, isSuccess } = useWaitForTransaction({
    //         hash: data?.hash,
    //       })
    //       if (isSuccess) {
    //         setMintComplete(true);
    //         setTransactionHash(data?.hash);
    //         }
    

    return (
    <><KycForm
            error={error}
            apiKey={API_KEY}
            onSign={(e) => console.log(e)}
            account={account}
            mintPrice={mintPrice}
            signature={signature}
            backendUrl={BACKEND_URL}
            onMintClick={(e) => console.log(e)}
            etherscanUrl={ETHERSCAN_URL}
            mintComplete={mintComplete}
            transactionHash={transactionHash}><p>Loading...</p>
    </KycForm></>)

}


export default Qkyc;