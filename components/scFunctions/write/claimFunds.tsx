import {
  usePrepareContractWrite,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
  useContractRead,
  useAccount,
} from "wagmi";
import Bountyscape from "../../../utils/Bountyscape.json";
import BountyscapeToken from "../../../utils/BountyscapeToken.json";

export function ClaimFunds({ ipfsId }: { ipfsId: any }) {
  const { chain } = useNetwork();
  const contractAddr =
    chain?.name === "Goerli"
      ? "0xb049977f9a53dc29aabbb67f9f9a72571a7835f2"
      : chain?.name === "Evmos Testnet"
      ? "0x7bE0571a42bF0e4429d1fbcECA791575CFb73b4E"
      : "0x548325D23dD7FdcD3aC34daCfb51Ad10CeFd13fd";

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Bountyscape.abi,
    functionName: "claimFunds",
    args: [ipfsId],
  });

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const tokenAddr =
    chain?.name === "Goerli"
      ? "0x68f7bd17bace86226ee5338a2f31d8337fd61261"
      : chain?.name === "Evmos Testnet"
      ? "0x68f7bd17bace86226ee5338a2f31d8337fd61261"
      : "0x69Ff0F3dA7DFb0b4dbB5548259284Fb88d586775";

  const { address } = useAccount();

  const { data: tBalancSelf } = useContractRead({
    addressOrName: tokenAddr,
    contractInterface: BountyscapeToken.abi,
    functionName: "balanceOf",
    args: [address],
  });

  return (
    <div>
      <div
        className="tooltip tooltip-primary tooltip-left"
        data-tip={
          Number(tBalancSelf?.toString()) / 1e18 >= 1000
            ? "1% withdraw fee"
            : Number(tBalancSelf?.toString()) / 1e18 >= 500 &&
              Number(tBalancSelf?.toString()) / 1e18 <= 1000
            ? "1.25% withdraw fee"
            : Number(tBalancSelf?.toString()) / 1e18 >= 300 &&
              Number(tBalancSelf?.toString()) / 1e18 <= 500
            ? "1.5% withdraw fee"
            : Number(tBalancSelf?.toString()) / 1e18 >= 100 &&
              Number(tBalancSelf?.toString()) / 1e18 <= 300
            ? "1.75% withdraw fee"
            : Number(tBalancSelf?.toString()) / 1e18 >= 25 &&
              Number(tBalancSelf?.toString()) / 1e18 <= 100
            ? "2% withdraw fee"
            : "2.5% withdraw fee"
        }
      >
        <button
          className="btn btn-primary "
          disabled={!write || isLoading}
          onClick={() => write?.()}
        >
          {isLoading ? "Claiming..." : "Claim Rewards"}
        </button>
      </div>
      {isSuccess && (
        <>
          <div className="toast toast-end">
            <div className="alert alert-success">
              <div>
                <div>
                  Rewards claimed!
                  {/* <div>
            <a href={`https://evm.evmos.dev/tx/${data?.hash}`}>Evmos Explorer</a>
          </div> */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {isError && (
        // <><div className="toast toast-end">
        //     <div className="alert alert-error">
        <div>
          <span>{(prepareError || error)?.message}</span>
        </div>
        //   </div>
        // </div></>
      )}
    </div>
  );
}
