"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { analyzeContract } from "@/actions/analyseContract";
import { useSmartContract } from "@/components/use-compiler";
import { useDeployContract } from "wagmi";
import { useAccount } from "wagmi";
import { Abi } from "viem";

// Constants
const mockSmartContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;
    
    function set(uint256 x) public {
        storedData = x;
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
}`;

// Reusable Components
const CodeEditor = ({
  code,
  setCode,
}: {
  code: string;
  setCode: (code: string) => void;
}) => {
  return (
    <div className="w-full max-w-4xl bg-[#272822] rounded-lg shadow-lg">
      <div className="flex items-center px-4 py-2 bg-[#1e1f1c] rounded-t-lg">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-64 p-4 bg-[#272822] text-white font-mono text-sm focus:outline-none rounded-b-lg"
        placeholder="Type your code here..."
        spellCheck="false"
      />
    </div>
  );
};

const LoadingButton = ({
  onClick,
  isLoading,
  loadingText,
  buttonText,
  disabled = false,
  className = "",
}: {
  onClick: () => void;
  isLoading: boolean;
  loadingText: string;
  buttonText: string;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <button
      className={`rounded-full flex items-center justify-center text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {loadingText}
        </>
      ) : (
        buttonText
      )}
    </button>
  );
};

const ActionButtons = ({
  onAudit,
  onCompile,
  onDeploy,
  isAuditing,
  isCompiling,
  isDeploying,
  compiledContract,
}: {
  onAudit: () => void;
  onCompile: () => void;
  onDeploy: () => void;
  isAuditing: boolean;
  isCompiling: boolean;
  isDeploying: boolean;
  compiledContract: { abi: Abi; bytecode: string } | null;
}) => {
  const { isConnected } = useAccount();
  return (
    <div className="flex gap-4 items-center flex-col sm:flex-row">
      <LoadingButton
        onClick={onAudit}
        isLoading={isAuditing}
        loadingText="Analyzing..."
        buttonText="Audit Contract"
        className="border border-solid border-transparent bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
      />

      <LoadingButton
        onClick={onCompile}
        isLoading={isCompiling}
        loadingText="Compiling..."
        buttonText="Compile Contract"
        className="border border-solid border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent"
      />

      <LoadingButton
        onClick={onDeploy}
        isLoading={isDeploying}
        loadingText="Deploying..."
        buttonText="Deploy Contract"
        disabled={!compiledContract || !isConnected}
        className={`border border-solid ${
          !compiledContract || !isConnected
            ? "border-gray-300 text-gray-300 cursor-not-allowed"
            : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
        }`}
      />

      <ConnectButton />
    </div>
  );
};

// Result display components
const ErrorResult = ({ message }: { message: string }) => (
  <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
    <div className="text-red-500">{message}</div>
  </div>
);

const CompilationResult = ({
  abi,
  bytecode,
}: {
  abi: Abi;
  bytecode: string;
}) => (
  <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8 space-y-4">
    <h2 className="text-xl font-bold">Compilation Successful!</h2>
    <div className="overflow-x-auto">
      <h3 className="font-bold">ABI:</h3>
      <pre className="text-sm">{JSON.stringify(abi, null, 2)}</pre>
    </div>
    <div className="overflow-x-auto">
      <h3 className="font-bold">Bytecode:</h3>
      <pre className="text-sm break-all">{bytecode}</pre>
    </div>
  </div>
);

const DeploymentResult = ({
  txid,
  explorerUrl,
  explorerName,
}: {
  txid: string;
  explorerUrl: string;
  explorerName: string;
}) => (
  <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8 space-y-4">
    <h2 className="text-xl font-bold text-green-500">
      Contract Deployed Successfully!
    </h2>
    <p>Txid: {txid}</p>
    <a
      href={explorerUrl + "/tx/" + txid}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 underline p-2 rounded-md "
    >
      View on {explorerName}
    </a>
  </div>
);

const AuditResultDisplay = ({ result }: { result: string }) => (
  <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
    <div dangerouslySetInnerHTML={{ __html: result }} />
  </div>
);

// Main application component
export default function Home() {
  // State management
  const [code, setCode] = useState(mockSmartContract);
  const [auditResult, setAuditResult] = useState<string>("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [compiledContract, setCompiledContract] = useState<{
    abi: Abi;
    bytecode: string;
  } | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [resultType, setResultType] = useState<
    "none" | "audit" | "compilation" | "deployment" | "error"
  >("none");
  const [errorMessage, setErrorMessage] = useState("");
  const [txid, setTxid] = useState("");

  // Hooks
  const { deployContractAsync } = useDeployContract();
  const { chain } = useAccount();
  const { isCompiling, compileContract } = useSmartContract();

  // Action handlers
  const handleAudit = async () => {
    setIsAuditing(true);
    try {
      const result = await analyzeContract(code);
      setAuditResult(result);
      setResultType("audit");
    } catch (error) {
      console.error("Error during audit:", error);
      setErrorMessage("An error occurred during the audit. Please try again.");
      setResultType("error");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCompile = async () => {
    try {
      // Extract contract name from the code (assuming it's SimpleStorage in this case)
      const contractName = "SimpleStorage";

      const { abi, bytecode } = await compileContract({
        sourceCode: code,
        contractName: contractName,
      });

      setCompiledContract({ abi, bytecode });
      setResultType("compilation");
    } catch (err) {
      console.error("Error during compilation:", err);
      setCompiledContract(null);
      setErrorMessage(
        "An error occurred during compilation. Please try again."
      );
      setResultType("error");
    }
  };

  const handleDeploy = async () => {
    if (!compiledContract) return;

    setIsDeploying(true);
    try {
      // Mock deployment delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const abi = compiledContract.abi;
      const bytecode = compiledContract.bytecode;

      const deployTxid = await deployContractAsync({
        abi,
        bytecode: bytecode as `0x${string}`,
        args: [],
      });

      setTxid(deployTxid);
      setResultType("deployment");
    } catch (error) {
      console.error("Error deploying contract:", error);
      setErrorMessage("An error occurred during deployment. Please try again.");
      setResultType("error");
    } finally {
      setIsDeploying(false);
    }
  };

  // Render results based on type
  const renderResult = () => {
    switch (resultType) {
      case "audit":
        return <AuditResultDisplay result={auditResult} />;
      case "compilation":
        return compiledContract ? (
          <CompilationResult
            abi={compiledContract.abi}
            bytecode={compiledContract.bytecode}
          />
        ) : null;
      case "deployment":
        return chain?.blockExplorers?.default ? (
          <DeploymentResult
            txid={txid}
            explorerUrl={chain.blockExplorers.default.url}
            explorerName={chain.blockExplorers.default.name}
          />
        ) : null;
      case "error":
        return <ErrorResult message={errorMessage} />;
      default:
        return null;
    }
  };

  // Render
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-4xl">
        <h1 className="text-3xl font-bold">Smart Contract Auditor</h1>

        <CodeEditor code={code} setCode={setCode} />

        <ActionButtons
          onAudit={handleAudit}
          onCompile={handleCompile}
          onDeploy={handleDeploy}
          isAuditing={isAuditing}
          isCompiling={isCompiling}
          isDeploying={isDeploying}
          compiledContract={compiledContract}
        />

        {resultType !== "none" && renderResult()}
      </main>
      <footer className="row-start-3 text-sm text-gray-500">
        Smart Contract Auditor - Built with Next.js
      </footer>
    </div>
  );
}
