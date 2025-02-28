import "./globals.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <Card className="max-w-2xl text-center space-y-8">
        <CardHeader>
          <CardTitle className="text-5xl font-bold text-primary">
            🔍 Smart Contract Auditor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl text-foreground">
            A powerful tool to audit, compile and deploy your smart contracts
            with ease. Get instant feedback on potential vulnerabilities and
            deploy directly to your chosen network.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/demo">
            <Button>🚀 Try it now</Button>
          </Link>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary">
              🤖 AI-Powered Auditing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">
              Leveraging advanced AI technology to analyze your smart contracts, providing 
              comprehensive security assessments and identifying potential vulnerabilities 
              in real-time.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary">
              📋 OWASP Security Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">
              Following <a href="https://swcregistry.io/docs/" className="text-blue-500 hover:underline">OWASP smart contract security principles</a> to systematically check for:
            </p>
            <ul className="text-left mt-2 list-disc list-inside">
              <li>🔄 Reentrancy vulnerabilities</li>
              <li>🔒 Access control issues</li>
              <li>🔢 Integer overflow/underflow</li>
              <li>⛽ Gas optimization problems</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
