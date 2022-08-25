import styled from 'styled-components';
import type { NextPage } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import { JsonRpcSigner, TransactionResponse, Web3Provider } from '@ethersproject/providers';
import { BigNumber, ethers } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import {
    Page,
    ErrorType,
    PageError,
    QuadPassportMintParams,
    QUADRATA_GOVERNANCE_ABI,
    QUADRATA_PASSPORT_ABI,
    KycForm
} from '@quadrata/kyc-react';
import { faFan } from '@fortawesome/free-solid-svg-icons/faFan';
import { KybForm } from '@quadrata/kyb-react';

import  Container from '../../pages/account';

// Constants
// Contact SpringLabs.com to request a testnet API key and backend URL.
const API_KEY = "6768938e6e8ac3c6969903341b63adfa212cbe0213b628f0ed7132b6fbaa2372";
const BACKEND_URL =  "https://prod-testnet-ky0x-processor-api.springlabs.network/v1";
const KYB_ID = "xgeqwrwk";

// Addresses (should be the correct ones based on the network, these are production Goerli)
const QUADRATA_PASSPORT_ADDRESS = '0x671692b2156312214b20F65b81c438234ac1d6D9';
const QUADRATA_GOVERNANCE_ADDRESS = '0xa470B40B8A9639f5a868Cb87f02456d9556419d4';

// etherscan URL should change based on the user network, this is Goerli's etherscan
const ETHERSCAN_URL = 'https://goerli.etherscan.io';

// Creating a custom loader (optional)
// This component will be shown during various loading states in the onboarding flow, otherwise, a "Loading..." text will be shown
const CustomLoaderContainer = styled.div`
    margin: 0 auto;
    padding: 3rem;
    text-align: center;
    font-family: sans-serif;
    letter-spacing: 0.05rem;
`;

// Creating an enum to manage user types
enum UserType {
    INDIVIDUAL = 'INDIVIDUAL',
    BUSINESS = 'BUSINESS',
}

const CustomLoader = () => (
    <CustomLoaderContainer>
        <FontAwesomeIcon icon={faFan} size="3x" color="#0c63e4" spin />
        <h5>PLEASE WAIT...</h5>
    </CustomLoaderContainer>
);

const DemoApp: NextPage = () => {
    // State
    const [error, setError] = useState<ErrorType>();
    const [signer, setSigner] = useState<JsonRpcSigner>();
    const [account, setAccount] = useState<string>();
    const [provider, setProvider] = useState<Web3Provider>();
    const [signature, setSignature] = useState<string>();
    const [mintPrice, setMintPrice] = useState<string>();
    const [mintComplete, setMintComplete] = useState<boolean>(false);
    const [transactionHash, setTransactionHash] = useState<string>();
    const [userType, setUserType] = useState<UserType>();

    // Getting the mint price from the governance contract to pass to the kyc component (required)
    const getMintPrice = useCallback((): Promise<BigNumber> => {
        const quadGovernanceContract = new ethers.Contract(
            QUADRATA_GOVERNANCE_ADDRESS,
            QUADRATA_GOVERNANCE_ABI,
            provider,
        );
        return quadGovernanceContract.mintPrice();
    }, [provider]);

    useEffect(() => {
        if (account) {
            getMintPrice().then((mintPrice) => {
                setMintPrice(formatUnits(mintPrice));
            });
        }
    }, [account, getMintPrice]);

    // Listening to account changes
    useEffect(() => {
        if (window?.ethereum?.on) {
            window.ethereum.on('accountsChanged', function (accounts: string[]) {
                setAccount(accounts[0]);
            });
        }
    }, []);

    // Handlers
    const handleConnectWalletClick = () => {
        // Connecting ethereum injected provider (you may use any other provider)
        // Account (wallet address) is required and being passed to the kyc component.
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        setProvider(provider);
        provider.send('eth_requestAccounts', []).then(() => {
            const signer = provider.getSigner();
            setSigner(signer);
            signer.getAddress().then((address) => {
                setAccount(address);
            });
        });
    };

    const handlePageChange = (page: Page | PageError) => {
        if (page === Page.INTRO && signature) {
            // Intro page navigation will get triggered when a different wallet is detected,
            // Resetting previous signature if present
            setSignature(undefined);
        }
    };

    const handleSign = async (hash: Uint8Array) => {
        // User clicked the initial sign button
        // Signing the hash and updating state.
        // kyc form will automatically navigate to the next step upon signature update
        if (signer && account) {
            const signature = await signer.signMessage(hash);
            setSignature(signature);
        }
    };

    const handleMintClick = async (
        params: QuadPassportMintParams,
        issuerSignature: string,
        ledgerSupportedSignature: string,
    ) => {
        // User clicked Approve & Mint Passport button
        // the parameters that are being passed to this function is all you need to mint the passport on chain

        // Resetting errors in case it's a retry
        setError(undefined);
        // QuadPassport contract interface (you may use any provider or library to interact with the blockchain)
        const quadPassportContract = new ethers.Contract(QUADRATA_PASSPORT_ADDRESS, QUADRATA_PASSPORT_ABI, provider);

        if (signer && params && mintPrice && ledgerSupportedSignature) {
            try {
                // Minting passport
                const transaction: TransactionResponse = await quadPassportContract
                    .connect(signer)
                    .mintPassport(params, issuerSignature, ledgerSupportedSignature, { value: parseUnits(mintPrice) });
                // Setting the transaction hash prop (required)
                // When defined, the from will automatically navigate to the "minting in progress" page
                // the tx hash will be added to the "View in Etherscan" link
                setTransactionHash(transaction.hash);
                transaction
                    .wait()
                    .then((receipt) => {
                        // Setting the mintComplete prop to true (required)
                        // The form will automatically navigate to the last page.
                        console.log('Passport minted successfully...', receipt);
                        setError(undefined);
                        setMintComplete(true);
                    })
                    .catch((error) => {
                        // Setting the mintComplete prop to false
                        // You may handle errors here
                        console.error('Passport minting failed, ', error);
                        setError(ErrorType.OTHER);
                        setMintComplete(false);
                    });
            } catch (e: any) {
                // Caching any other errors here
                if (e && e.code === ErrorType.INSUFFICIENT_FUNDS) {
                    setError(ErrorType.INSUFFICIENT_FUNDS);
                }
            }
        } else {
            setError(ErrorType.OTHER);
            console.error('Missing required params to mint: ', { signer, params, mintPrice, ledgerSupportedSignature });
        }
    };

    return userType ? (
        <>
            {userType === UserType.INDIVIDUAL ? (
                <>
                    {account ? (
                        <KycForm
                            error={error}
                            apiKey={API_KEY}
                            onSign={handleSign}
                            account={account}
                            mintPrice={mintPrice}
                            signature={signature}
                            backendUrl={BACKEND_URL}
                            onMintClick={handleMintClick}
                            etherscanUrl={ETHERSCAN_URL}
                            mintComplete={mintComplete}
                            onPageChange={handlePageChange}
                            transactionHash={transactionHash}
                        >
                            <CustomLoader />
                        </KycForm>
                    ) : (
                        
                            <><h1>Please connect your wallet</h1><button onClick={handleConnectWalletClick}>Connect wallet</button></>
                        
                    )}
                </>
            ) : (
                <KybForm kybId={KYB_ID} />
            )}
        </>
    ) : (
        
            <><h1>Please select the desired Quadrata Passport type</h1><button onClick={() => setUserType(UserType.INDIVIDUAL)}>Individual Passport</button><button onClick={() => setUserType(UserType.BUSINESS)}>Business Passport</button></>
       
    );
};

export default DemoApp;
