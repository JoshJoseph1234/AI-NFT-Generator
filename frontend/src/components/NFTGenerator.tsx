import React, { useState } from 'react';
import { Hexagon, ArrowLeft, Wand2, Wallet } from 'lucide-react';
import { generateImage } from '../api/generate';
import { getContract } from '../config/contract';
import { ethers } from 'ethers';

const NFTGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [metadataUrl, setMetadataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is required!");
      }
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return true;
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError('Failed to connect wallet. Please install MetaMask.');
      return false;
    }
  };

  const setupNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
      });
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
        }
      }
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    setMetadataUrl(null);

    try {
      const response = await generateImage(prompt);
      setGeneratedImage(response.ipfs.imageUrl);
      setMetadataUrl(response.ipfs.metadataUrl);
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate NFT');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMint = async () => {
    if (!metadataUrl) return;
    
    setIsMinting(true);
    setError(null);

    try {
      const connected = await connectWallet();
      if (!connected) return;

      // Setup network
      await setupNetwork();

      // Initialize provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request account access
      
      const signer = provider.getSigner();
      const address = await signer.getAddress(); // Get the connected wallet address
      
      console.log("Connected wallet address:", address);
      console.log("Metadata URL:", metadataUrl);
      
      const contract = getContract(signer);
      console.log("Contract address:", contract.address);

      // Mint NFT
      const tx = await contract.mintNFT(address, metadataUrl);
      console.log("Transaction hash:", tx.hash);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);

      // Find the NFTMinted event
      const event = receipt.events?.find(e => e.event === 'NFTMinted');
      const tokenId = event?.args?.tokenId?.toString();

      setError(null);
      alert(`NFT minted successfully! Token ID: ${tokenId}`);
    } catch (err) {
      console.error('Minting error:', err);
      setError(err instanceof Error ? err.message : 'Failed to mint NFT');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMxMTExMTEiLz48L3N2Zz4=')] opacity-20"></div>
      <div className="absolute inset-0 border border-[#1A1A1A] m-4 pointer-events-none"></div>

      <nav className="relative flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <Hexagon className="text-[#ADFF2F]" size={24} />
          <span className="text-xl font-mono tracking-wider">NFTCONNECT</span>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-mono bg-[#ADFF2F]/10 hover:bg-[#ADFF2F]/20 text-[#ADFF2F] rounded transition-colors"
        >
          <ArrowLeft size={16} />
          <span>BACK TO HOME</span>
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-light mb-8 text-[#ADFF2F]">Create Your NFT</h1>
        
        <div className="bg-black/40 backdrop-blur-sm border border-[#ADFF2F]/30 p-8 rounded-lg">
          <div className="mb-6">
            <label className="block text-sm font-mono text-gray-400 mb-2">
              DESCRIBE YOUR NFT
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 bg-black/40 text-white border border-[#ADFF2F]/30 rounded-lg p-4 focus:outline-none focus:border-[#ADFF2F] transition-colors resize-none"
              placeholder="Enter a detailed description of the NFT you want to generate..."
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {generatedImage && (
            <div className="mb-6">
              <div className="relative aspect-[3/2] rounded-lg overflow-hidden">
                <img 
                  src={generatedImage} 
                  alt="Generated NFT"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="mt-4 flex gap-4">
                <button
                  onClick={handleMint}
                  disabled={isMinting || !metadataUrl}
                  className={`flex-1 py-4 rounded-lg font-mono flex items-center justify-center space-x-2 transition-all ${
                    isMinting || !metadataUrl
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-[#ADFF2F] text-black hover:bg-[#9AE62F]'
                  }`}
                >
                  <Wallet size={20} />
                  <span>{isMinting ? 'MINTING...' : 'MINT NFT'}</span>
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!prompt || isGenerating}
            className={`w-full py-4 rounded-lg font-mono flex items-center justify-center space-x-2 transition-all ${
              !prompt || isGenerating
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-[#ADFF2F] text-black hover:bg-[#9AE62F]'
            }`}
          >
            <Wand2 size={20} />
            <span>{isGenerating ? 'GENERATING...' : 'GENERATE NFT'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTGenerator;