import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold">
          Smart Contract Auditor
        </h1>
        
        <p className="text-xl text-muted-foreground">
          A powerful tool to audit, compile and deploy your smart contracts with ease. 
          Get instant feedback on potential vulnerabilities and deploy directly to your chosen network.
        </p>

        <Link 
          href="/demo"
          className="inline-block px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try it now
        </Link>
      </div>
    </div>
  );
}