"use client";

import { useState } from "react";
import { analyzeContract } from "@/actions/analyseContract";
import { useSmartContract } from "@/components/use-compiler";
import { useDeployContract } from "wagmi";
import { useAccount } from "wagmi";
import { Abi } from "viem";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="w-full bg-[#272822] rounded-lg shadow-lg font-mono">
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
        className={`w-full h-[500px] p-4 bg-[#272822] text-white text-sm focus:outline-none rounded-b-lg`}
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
}: {
  onClick: () => void;
  isLoading: boolean;
  loadingText: string;
  buttonText: string;
  disabled?: boolean;
}) => {
  return (
    <Button onClick={onClick} disabled={isLoading || disabled}>
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
    </Button>
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
    <>
      <LoadingButton
        onClick={onAudit}
        isLoading={isAuditing}
        loadingText="Analyzing..."
        buttonText="Audit Contract"
      />

      <LoadingButton
        onClick={onCompile}
        isLoading={isCompiling}
        loadingText="Compiling..."
        buttonText="Compile Contract"
      />

      <LoadingButton
        onClick={onDeploy}
        isLoading={isDeploying}
        loadingText="Deploying..."
        buttonText="Deploy Contract"
        disabled={!compiledContract || !isConnected}
      />
    </>
  );
};

// Result dialog components
const ErrorDialog = ({
  message,
  isOpen,
  onClose,
}: {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle className="text-destructive">Error</DialogTitle>
      </DialogHeader>
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const CompilationDialog = ({
  abi,
  bytecode,
  isOpen,
  onClose,
}: {
  abi: Abi;
  bytecode: string;
  isOpen: boolean;
  onClose: () => void;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-full">
      <DialogHeader>
        <DialogTitle>Compilation Successful!</DialogTitle>
        <DialogDescription>
          Your smart contract has been successfully compiled.
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="max-h-[60vh]">
        <div className="space-y-4 p-2">
          <div className="overflow-x-auto">
            <h3 className="font-bold">ABI:</h3>
            <pre className="text-sm break-all whitespace-pre-wrap max-w-xl bg-muted p-2 rounded">
              {JSON.stringify(abi, null, 2)}
            </pre>
          </div>
          <div className="overflow-x-auto">
            <h3 className="font-bold">Bytecode:</h3>
            <pre className="text-sm break-all whitespace-pre-wrap max-w-xl bg-muted p-2 rounded">
              {bytecode}
            </pre>
          </div>
        </div>
      </ScrollArea>
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const DeploymentDialog = ({
  txid,
  explorerUrl,
  explorerName,
  isOpen,
  onClose,
}: {
  txid: string;
  explorerUrl: string;
  explorerName: string;
  isOpen: boolean;
  onClose: () => void;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="min-w-4xl">
      <DialogHeader>
        <DialogTitle className="text-green-500">
          Contract Deployed Successfully!
        </DialogTitle>
        <DialogDescription>
          Your smart contract has been successfully deployed to the blockchain.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 p-2">
        <p className="font-medium">Transaction ID:</p>
        <pre className="text-sm bg-muted p-2 rounded">
          {txid}
        </pre>
        <a
          href={`${explorerUrl}/tx/${txid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline p-2 rounded-md inline-block"
        >
          View on {explorerName}
        </a>
      </div>
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const AuditDialog = ({
  result,
  isOpen,
  onClose,
}: {
  result: string;
  isOpen: boolean;
  onClose: () => void;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="min-w-full">
      <DialogHeader>
        <DialogTitle>Audit Result</DialogTitle>
        <DialogDescription>
          This is the result of the smart contract audit.
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="min-w-full">
        <div className="p-2" dangerouslySetInnerHTML={{ __html: result }} />
      </ScrollArea>
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
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
  const [errorMessage, setErrorMessage] = useState("");
  const [txid, setTxid] = useState("");

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<
    "none" | "audit" | "compilation" | "deployment" | "error"
  >("none");

  // Hooks
  const { deployContractAsync } = useDeployContract();
  const { chain } = useAccount();
  const { isCompiling, compileContract } = useSmartContract();

  // Helper to close dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  // Action handlers
  const handleAudit = async () => {
    setIsAuditing(true);
    try {
      const result = await analyzeContract(code);
      setAuditResult(result);
      setDialogType("audit");
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error during audit:", error);
      setErrorMessage("An error occurred during the audit. Please try again.");
      setDialogType("error");
      setIsDialogOpen(true);
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
      setDialogType("compilation");
      setIsDialogOpen(true);
    } catch (err) {
      console.error("Error during compilation:", err);
      setCompiledContract(null);
      setErrorMessage(
        "An error occurred during compilation. Please try again."
      );
      setDialogType("error");
      setIsDialogOpen(true);
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
      setDialogType("deployment");
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error deploying contract:", error);
      setErrorMessage("An error occurred during deployment. Please try again.");
      setDialogType("error");
      setIsDialogOpen(true);
    } finally {
      setIsDeploying(false);
    }
  };

  // No renderDialog function - we'll directly include dialog components

  // Render
  return (
    <div className="mb-10 mt-20">
      <div className="flex flex-row gap-4 w-full">
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-4">
            <ActionButtons
              onAudit={handleAudit}
              onCompile={handleCompile}
              onDeploy={handleDeploy}
              isAuditing={isAuditing}
              isCompiling={isCompiling}
              isDeploying={isDeploying}
              compiledContract={compiledContract}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <CodeEditor code={code} setCode={setCode} />
        </div>
      </div>

      {/* Direct dialog components with conditional rendering */}
      <AuditDialog
        result={auditResult}
        isOpen={isDialogOpen && dialogType === "audit"}
        onClose={closeDialog}
      />

      {compiledContract && (
        <CompilationDialog
          abi={compiledContract.abi}
          bytecode={compiledContract.bytecode}
          isOpen={isDialogOpen && dialogType === "compilation"}
          onClose={closeDialog}
        />
      )}

      {chain?.blockExplorers?.default && (
        <DeploymentDialog
          txid={txid}
          explorerUrl={chain.blockExplorers.default.url}
          explorerName={chain.blockExplorers.default.name}
          isOpen={isDialogOpen && dialogType === "deployment"}
          onClose={closeDialog}
        />
      )}

      <ErrorDialog
        message={errorMessage}
        isOpen={isDialogOpen && dialogType === "error"}
        onClose={closeDialog}
      />
    </div>
  );
}
