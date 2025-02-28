# AuditAI - Smart Audits for Smart Contracts

AuditAI is a decentralized AI-powered platform for auditing smart contracts. Our solution provides developers with automated security analysis, detecting vulnerabilities before deployment and helping to prevent potential exploits.

## 🚀 Features

- **AI-Powered Security Analysis**: Detects over 40 vulnerability types in seconds
- **Pay-Per-Use Model**: Affordable security based on contract complexity
- **Decentralized Approach**: Blockchain-based payments and verification
- **Comprehensive Reports**: Detailed vulnerability explanations with remediation suggestions
- **Simple 3-Step Process**: Connect wallet, upload files, get instant results

## 🛠️ Getting Started

### Prerequisites

- Node.js 16.x or later
- Metamask or compatible Web3 wallet

### Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/auditai.git
cd auditai
```

Install dependencies:

```bash
npm install
# or
yarn install
```

Configure environment variables:

```bash
cp .env.example .env.local
```
Then edit `.env.local` with your specific configuration.

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔍 How It Works

1. **Contract Selection**: Upload your `.sol` files or paste code directly
2. **Compilation**: System validates correct build and syntax
3. **Analysis**: AI examines code for security flaws and vulnerabilities
4. **Report Generation**: Detailed security report with actionable insights

## 🔒 Security Features

AuditAI detects critical vulnerabilities including:

- Reentrancy attacks
- Access control issues
- Logic errors
- Overflow/underflow problems
- Front-running vulnerabilities
- Flash loan attack vectors

## 💼 Business Model

- **Freemium**: Audit smaller contracts at no cost
- **Pay-Per-Use**: Pricing scales with contract complexity
- **Subscription Plans**: For teams requiring regular audits

## 🧑‍💻 Development

This project is built with:

- **Next.js** for the frontend
- **Solidity** for smart contracts
- **AI/ML** for vulnerability detection

### Folder Structure

```
/
├── app/              # Next.js application
├── components/       # React components
├── contracts/        # Smart contracts
├── lib/              # Utility functions
├── public/           # Static assets
└── styles/           # CSS styles
```


## 👥 Team

- **Otavio Vacari** - Blockchain Security (Poli USP)
- **Paola Queiroz** - Software Engineering (Poli USP)
- **Tiago Marinho** - Computer Engineering (Poli USP)

## 🔗 Contact

For more information, contact us at [otaviovacari@usp.br](mailto:otaviovacari@usp.br) or visit our website.

---

**AuditAI - Security for all, smart audits for smart contracts.**
