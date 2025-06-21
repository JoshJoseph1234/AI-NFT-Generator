
# Opulent NFTs – AI NFT Generator

Opulent NFTs is a full-stack platform that enables users to generate unique AI-powered NFT artwork, mint them on the blockchain, and manage their NFT collections. The project combines a modern React frontend, an Express backend with AI image generation and IPFS integration, and Ethereum smart contracts.

---

## Features

- **AI-Powered NFT Generation**: Create unique digital art using advanced AI models (Stable Diffusion via Replicate).
- **Mint on Blockchain**: Mint your generated art as NFTs on the Ethereum Sepolia testnet.
- **IPFS Storage**: Store images and metadata securely on IPFS via Pinata.
- **Wallet Integration**: Connect and manage your wallet with MetaMask.
- **Personal NFT Gallery**: View and manage your minted NFTs.
- **Modern UI**: Responsive, animated interface built with React, TailwindCSS, and Framer Motion.

---

## Project Structure

```
AI-NFT-Generator/
│
├── frontend/      # React + Vite app (TypeScript, TailwindCSS)
├── backend/       # Express API server (Node.js)
├── contracts/     # Solidity smart contracts (Hardhat)
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- MetaMask browser extension
- [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/) account for Sepolia RPC
- [Pinata](https://pinata.cloud/) account for IPFS
- [Replicate](https://replicate.com/) account for AI image generation

---

### 1. Clone the Repository

```sh
git clone https://github.com/JoshJoseph1234/AI-NFT-Generator.git
cd AI-NFT-Generator
```

---

### 2. Setup Smart Contracts

```sh
cd contracts
npm install
cp .env.example .env
# Fill in PRIVATE_KEY, ALCHEMY_API_KEY, ETHERSCAN_API_KEY in .env
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

---

### 3. Setup Backend

```sh
cd ../backend
npm install
cp .env.example .env
# Fill in REPLICATE_API_TOKEN, PINATA_API_KEY, PINATA_SECRET_KEY, CONTRACT_ADDRESS, PRIVATE_KEY, SEPOLIA_RPC_URL
npm run dev
```

---

### 4. Setup Frontend

```sh
cd ../frontend
npm install
cp .env.example .env
# Fill in VITE_CONTRACT_ADDRESS, VITE_ALCHEMY_API_KEY, VITE_REPLICATE_API_TOKEN
npm run dev
```

---

## Usage

1. Open [http://localhost:5173](http://localhost:5173) in your browser.
2. Connect your MetaMask wallet (Sepolia testnet).
3. Enter a prompt to generate AI art.
4. Mint the generated image as an NFT.
5. View your NFT collection.

---

## Environment Variables

Each package (`frontend`, `backend`, `contracts`) uses its own `.env` file. See `.env.example` in each folder for required variables.

---

## Scripts

- **Frontend**
  - `npm run dev` – Start React app
  - `npm run build` – Build for production
  - `npm run test` – Run frontend tests

- **Backend**
  - `npm run dev` – Start Express server with nodemon
  - `npm start` – Start Express server

- **Contracts**
  - `npx hardhat compile` – Compile contracts
  - `npx hardhat test` – Run contract tests
  - `npx hardhat run scripts/deploy.js --network sepolia` – Deploy to Sepolia

---

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, Framer Motion, ethers.js
- **Backend**: Node.js, Express, Replicate API, Pinata SDK, dotenv
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin
- **Storage**: IPFS (via Pinata)
- **Blockchain**: Ethereum Sepolia Testnet

---

## License

[ISC](LICENSE)

---

## Acknowledgements

- [Replicate](https://replicate.com/) for AI image generation
- [Pinata](https://pinata.cloud/) for IPFS storage
- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract libraries

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## Contact

For support or questions, open an issue or contact [JoshJoseph1234](https://github.com/JoshJoseph1234)