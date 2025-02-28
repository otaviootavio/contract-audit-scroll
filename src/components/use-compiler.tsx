import { useState } from "react";
import { Solc } from "solc-browserify";
import { useDeployContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { type Abi, type Address, type Hash } from "viem";
import { config as rainbowKitConfig } from "@/app/rainbow-kit-config";

interface SmartContractProps {
  amountEthInWei: bigint;
  numersOfToken: number;
  toAddress: Address;
  tail: string;
  abi: Abi;
  bytecode: string;
}

interface CompileContractOptions {
  sourceCode: string;
  contractName: string;
}

export const useSmartContract = () => {
  const [isCompiling, setIsCompiling] = useState(false);
  const { deployContractAsync } = useDeployContract();

  const compileContract = async ({
    sourceCode,
    contractName,
  }: CompileContractOptions) => {
    setIsCompiling(true);
    try {
      const solc = new Solc();
      const compiledContracts = await solc.compile(sourceCode);

      // Extract the bytecode and ABI for the specified contract
      const outBytecode =
        compiledContracts.contracts.Compiled_Contracts[contractName].evm
          .bytecode.object;
      const outAbi: Abi = compiledContracts.contracts.Compiled_Contracts[
        contractName
      ].abi as Abi;

      return { abi: outAbi, bytecode: outBytecode };
    } catch (error) {
      console.error("Compilation failed:", error);
      throw error;
    } finally {
      setIsCompiling(false);
    }
  };

  const deployContract = async (props: SmartContractProps) => {
    const hash: Hash = await deployContractAsync({
      abi: props.abi,
      bytecode: `0x${props.bytecode}`,
      args: [props.toAddress, props.numersOfToken, props.tail],
      value: props.amountEthInWei,
    });

    const receipt = await waitForTransactionReceipt(rainbowKitConfig, {
      hash,
      confirmations: 1,
    });

    if (!receipt.contractAddress) throw new Error("Contract address not found");

    return receipt.contractAddress;
  };

  return {
    isCompiling,
    compileContract,
    deployContract,
  };
};
