# VoteMeMaybe - Decentralized Voting Platform

![VoteMeMaybe Banner](https://via.placeholder.com/1200x400/3a0647/ffffff?text=VoteMeMaybe)

A secure blockchain-based voting platform for transparent and tamper-proof decision making built with Next.js, Tailwind CSS, shadcn/ui, and Ethereum smart contracts.

## 📋 Table of Contents

- [Features](#-features)
- [Project Overview](#-project-overview)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Smart Contract Development](#-smart-contract-development)
- [Frontend Development](#-frontend-development)
- [Component Architecture](#-component-architecture)
- [Customization](#-customization)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Features

- **Blockchain Voting System**: Secure, transparent, and tamper-proof voting through Ethereum smart contracts
- **Wallet Integration**: Connect with MetaMask and other popular Web3 wallets
- **Modern UI**: Beautiful interface built with Tailwind CSS and shadcn/ui components
- **Create Proposals**: User-friendly proposal creation with preview functionality
- **Vote on Proposals**: Simple approve/reject voting mechanism with real-time results
- **Help Center**: Comprehensive help documentation with animations and interactive elements
- **Analytics Dashboard**: Track proposal metrics and voting patterns
- **Dark/Light Mode**: Full theme support with seamless transitions
- **Responsive Design**: Works perfectly on all devices from mobile to desktop
- **Animation Effects**: Smooth animations using Framer Motion

## 📖 Project Overview

VoteMeMaybe is a decentralized application (dApp) that enables communities to make decisions transparently. The platform allows users to:

1. Connect their cryptocurrency wallets
2. Create new proposals with detailed descriptions
3. Vote on active proposals
4. Track voting results in real-time
5. View proposal history and analytics

All votes and proposals are stored on the Ethereum blockchain, ensuring transparency and preventing tampering, while the frontend delivers a smooth user experience.

## 💻 Technology Stack

- **Frontend Framework**: [Next.js 14](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Blockchain**: [Ethereum](https://ethereum.org/)
- **Smart Contract Development**: [Truffle](https://trufflesuite.com/)
- **Wallet Connection**: [wagmi](https://wagmi.sh/)
- **Ethereum Interaction**: [ethers.js](https://docs.ethers.org/)
- **Database**: [Convex](https://www.convex.dev/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)

## 🏗️ Project Structure

```
votememaybe/
├── contracts/                # Solidity smart contracts
│   └── ProposalManager.sol   # Main voting contract
├── migrations/               # Truffle migration scripts
├── public/                   # Static assets
├── src/
│   ├── app/                  # Next.js app router pages
│   │   ├── create/           # Proposal creation page
│   │   ├── dashboard/        # User dashboard
│   │   ├── help/             # Help center
│   │   ├── profile/          # User profile
│   │   └── proposals/        # Proposals listing & details
│   ├── components/           # Reusable components
│   │   ├── help/             # Help center components
│   │   ├── layout/           # Layout components (header, footer)
│   │   ├── proposals/        # Proposal-related components
│   │   ├── ui/               # shadcn/ui components
│   │   └── wallet/           # Wallet connection components
│   ├── contexts/             # React contexts
│   ├── data/                 # Static data
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── providers/            # Provider components
│   └── types/                # TypeScript types
├── test/                     # Smart contract tests
├── truffle-config.js         # Truffle configuration
└── ...                       # Configuration files
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- [MetaMask](https://metamask.io/) or another Web3 wallet

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/votememaybe.git
cd votememaybe
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Install required UI components**

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Install required components
npx shadcn-ui@latest add button card input textarea label toast tooltip tabs badge avatar dialog select progress sheet
```

4. **Set up environment variables**

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_BLOCKCHAIN_PROVIDER=http://localhost:9545
NEXT_PUBLIC_CHAIN_ID=5777
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

5. **Start the development server**

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 💼 Smart Contract Development

The project uses [Truffle](https://trufflesuite.com/) for smart contract development.

### Key Smart Contracts

- **ProposalManager.sol**: Manages the creation of proposals and voting process

### Setting Up Truffle

1. **Install Truffle globally (if not already installed)**

```bash
npm install -g truffle
```

2. **Start the local blockchain**

```bash
npx truffle develop
```

This will start a local blockchain at `http://localhost:9545`.

3. **Compile and deploy contracts**

In a separate terminal:

```bash
# Compile contracts
npx truffle compile

# Deploy contracts
npx truffle migrate

# For a specific network
npx truffle migrate --network development
```

### Contract Testing

```bash
# Run all tests
npx truffle test

# Run specific test
npx truffle test ./test/ProposalManager.test.js
```

### Interacting with Contracts

You can interact with your deployed contracts through the Truffle console:

```bash
npx truffle console

# Example: Create a new proposal
const pm = await ProposalManager.deployed()
await pm.createProposal("Test Proposal", "This is a test proposal", { from: accounts[0] })
```

## 🎨 Frontend Development

### Key Pages

- **Home (/)**: Introduction to the platform
- **Proposals (/proposals)**: List of all proposals
- **Proposal Detail (/proposals/[id])**: Individual proposal with voting options
- **Create Proposal (/create)**: Form to create new proposals
- **Dashboard (/dashboard)**: User-specific dashboard
- **Profile (/profile)**: User profile and voting history
- **Help (/help)**: Interactive help center

### Component Architecture

The project uses a modular component architecture for better maintainability:

1. **Base Components**: Small, reusable UI components from shadcn/ui
2. **Feature Components**: Functionality-specific components 
3. **Page Components**: Assembled from multiple feature components
4. **Layout Components**: Shared layouts like header and footer

### State Management

The application uses React Context API for state management:

- **AppContext**: Main application state with wallet connection, proposals, and voting

### Animations

Animations are implemented with Framer Motion:

- **Page Transitions**: Smooth transitions between pages
- **Component Animations**: Entrance animations for components
- **Interactive Elements**: Hover and click animations

## 🔧 Component Architecture

### Enhanced Create Proposal Page

The Create Proposal page is built using several modular components:

1. **WalletRequired**: Shown when wallet is not connected
2. **FormCompletion**: Progress indicator for form completion
3. **ProposalForm**: Main form with write/preview tabs
4. **ProposalGuidelines**: Guidelines sidebar
5. **ImportantInformation**: Important notes sidebar

### Enhanced Help Center

The Help Center page consists of:

1. **FAQItem**: Expandable FAQ component
2. **StepItem**: Step-by-step guide component
3. **ArticleCard**: Resource link card component
4. **Tab Content Components**: 
   - GettingStartedTab
   - VotingGuideTab
   - ProposalsTab
   - FAQTab
   - ResourcesTab

## 🎨 Customization

### Theme Customization

The application uses Tailwind CSS with shadcn/ui theming. Modify colors in:

- `src/app/globals.css`: Theme variables
- `tailwind.config.js`: Tailwind configuration

### UI Component Customization

All UI components from shadcn/ui can be found in `src/components/ui/` and can be customized as needed.

### Adding New Pages

To add a new page:

1. Create a new directory in `src/app/`
2. Add a `page.tsx` file with your page content
3. Use existing components or create new ones as needed

## 🚀 Deployment

### Frontend Deployment

Deploy the frontend to Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy!

### Smart Contract Deployment

Deploy smart contracts to Ethereum networks:

1. Configure `truffle-config.js` with your network settings
2. Create a `.env` file with your wallet mnemonic and Infura API key
3. Run the migration:

```bash
npx truffle migrate --network goerli
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Ethereum](https://ethereum.org/)
- [Truffle Suite](https://trufflesuite.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [wagmi](https://wagmi.sh/)
- [ethers.js](https://docs.ethers.org/)
- [Convex](https://www.convex.dev/)

---

## 📚 Additional Documentation

For more detailed information, please check these documents:

- [Installation Guide](./INSTALLATION.md) - Detailed installation instructions
- [Technical Documentation](./TECHNICAL_DOCS.md) - Technical details for developers