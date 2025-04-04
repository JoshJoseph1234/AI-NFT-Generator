import React, { useState, useEffect } from 'react';
import { Hexagon, ArrowLeft, Wand2, Wallet, LogOut } from 'lucide-react';
import { generateImage } from '../api/generate';
import { getContract, CONTRACT_ADDRESS } from '../config/contract';
import { useWallet } from '../context/WalletContext';
import UserNFTs from './UserNFTs';
import { ethers } from 'ethers';

const NFTGenerator = () => {
  const { address, provider, signer, connectWallet, disconnectWallet, error: walletError } = useWallet();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [isMinting, setIsMinting] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [metadataUrl, setMetadataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const monitorTransaction = async (tx: ethers.providers.TransactionResponse) => {
    console.log('Monitoring transaction:', tx.hash);
    const receipt = await tx.wait(2);
    console.log('Events:', receipt.events?.map(e => ({
      event: e.event,
      args: e.args
    })));
    return receipt;
  };

  // Debug logging for state changes
  useEffect(() => {
    console.log('Component State:', {
      isConnected: !!address,
      walletAddress: address,
      walletError,
      hasProvider: !!provider,
      hasSigner: !!signer,
      hasGeneratedImage: !!generatedImage,
      hasMetadataUrl: !!metadataUrl
    });
  }, [address, walletError, provider, signer, generatedImage, metadataUrl]);

  // Handle network and account changes
  useEffect(() => {
    const handleChainChanged = () => window.location.reload();
    const handleAccountsChanged = () => window.location.reload();

    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  // Persist generated content
  useEffect(() => {
    const savedImage = localStorage.getItem('generatedImage');
    const savedMetadata = localStorage.getItem('metadataUrl');
    if (savedImage) setGeneratedImage(savedImage);
    if (savedMetadata) setMetadataUrl(savedMetadata);
  }, []);

  const saveToLocalStorage = (image: string, metadata: string) => {
    localStorage.setItem('generatedImage', image);
    localStorage.setItem('metadataUrl', metadata);
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('generatedImage');
    localStorage.removeItem('metadataUrl');
  };

  const handleError = (err: Error) => {
    if (err.message.includes('cannot estimate gas')) {
      return 'Gas estimation failed';
    } else if (err.message.includes('user rejected')) {
      return 'Transaction was rejected by user';
    } else if (err.message.includes('insufficient funds')) {
      return 'Insufficient funds for gas';
    }
    return `Minting failed: ${err.message}`;
  };

  const handleGenerate = async () => {
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }
    if (!prompt) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setError(null);
    setGeneratedImage(null);
    setMetadataUrl(null);

    try {
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 2, 95));
      }, 1000);

      const response = await generateImage(prompt);
      clearInterval(progressInterval);
      setGenerationProgress(100);
      setGeneratedImage(response.ipfs.imageUrl);
      setMetadataUrl(response.ipfs.metadataUrl);
      saveToLocalStorage(response.ipfs.imageUrl, response.ipfs.metadataUrl);
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate NFT');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMint = async () => {
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }
    if (!metadataUrl || !signer || !address) {
      setError('Please connect wallet and generate image first');
      return;
    }

    setIsMinting(true);
    setError(null);

    try {
      console.log('Starting mint process...', {
        contractAddress: CONTRACT_ADDRESS,
        userAddress: address,
        metadataUrl
      });

      const contract = getContract(signer);
      const gasPrice = await signer.getGasPrice();
      console.log('Current gas price:', ethers.utils.formatUnits(gasPrice, 'gwei'), 'gwei');

      const gasEstimate = await contract.estimateGas.mintNFT(address, metadataUrl);
      console.log('Estimated gas:', gasEstimate.toString());

      const tx = await contract.mintNFT(address, metadataUrl, {
        gasLimit: gasEstimate.mul(120).div(100),
        gasPrice: gasPrice.mul(120).div(100)
      });

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait(2);

      const mintEvent = receipt.events?.find(e => e.event === 'NFTMinted');
      const transferEvent = receipt.events?.find(e => e.event === 'Transfer');
      let tokenId;

      if (mintEvent && mintEvent.args) {
        tokenId = mintEvent.args.tokenId.toString();
      } else if (transferEvent && transferEvent.args) {
        tokenId = transferEvent.args.tokenId.toString();
      } else {
        throw new Error('No minting events found in transaction receipt');
      }

      console.log('NFT minted successfully! Token ID:', tokenId);
      alert(`NFT minted successfully! Token ID: ${tokenId}`);
      clearLocalStorage();
      setGeneratedImage(null);
      setMetadataUrl(null);
      setPrompt('');
    } catch (err) {
      console.error('Minting error:', err);
      setError(handleError(err as Error));
    } finally {
      setIsMinting(false);
    }
  };

  const handleConnectWallet = async () => {
    console.log('👆 Connect wallet clicked');
    try {
      const success = await connectWallet();
      console.log('🔌 Wallet connection result:', success);
      if (!success) {
        setLocalError('Failed to connect wallet');
        return;
      }
      if (!window.ethereum.selectedAddress) {
        throw new Error('No wallet address found after connection');
      }
      console.log('✅ Wallet connected:', window.ethereum.selectedAddress);
    } catch (err) {
      console.error('❌ Connection error:', err);
      setLocalError('Wallet connection failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Are you sure you want to go back? This will disconnect your wallet.')) {
      disconnectWallet();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative">
      {/* Background Patterns */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMxMTExMTEiLz48L3N2Zz4=')] opacity-20"></div>
      <div className="absolute inset-0 border border-[#1A1A1A] m-4 pointer-events-none"></div>

      {/* Navigation Bar */}
      <nav className="relative flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <Hexagon className="text-[#ADFF2F]" size={24} />
          <span className="text-xl font-mono tracking-wider">OPULENT NFTs</span>
        </div>
        <div className="flex items-center space-x-4">
          {!address ? (
            <button
              onClick={handleConnectWallet}
              className="px-4 py-2 bg-[#ADFF2F]/10 hover:bg-[#ADFF2F]/20 text-[#ADFF2F] rounded-lg font-mono flex items-center space-x-2 transition-colors"
            >
              <Wallet size={16} />
              <span>CONNECT WALLET</span>
            </button>
          ) : (
            <>
              <span className="font-mono text-sm">{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
              <button
                onClick={disconnectWallet}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-mono flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>DISCONNECT</span>
              </button>
            </>
          )}
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-mono bg-[#ADFF2F]/10 hover:bg-[#ADFF2F]/20 text-[#ADFF2F] rounded transition-colors"
          >
            <ArrowLeft size={16} />
            <span>BACK TO HOME</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Explanation Message for Wallet Connection */}
        {!address && (
          <div className="mb-8 p-4 bg-[#ADFF2F]/10 border border-[#ADFF2F]/30 rounded-lg text-center">
            Please connect your wallet to proceed with generating and minting NFTs.
          </div>
        )}

        {/* NFT Generation Interface */}
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
                  disabled={!address || isMinting || !metadataUrl}
                  title={!address ? 'Please connect your wallet first' : undefined}
                  className={`flex-1 py-4 rounded-lg font-mono flex items-center justify-center space-x-2 transition-all ${
                    !address || isMinting || !metadataUrl
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
            disabled={!address || !prompt || isGenerating}
            title={!address ? 'Please connect your wallet first' : undefined}
            className={`w-full py-4 rounded-lg font-mono flex items-center justify-center space-x-2 transition-all ${
              !address || !prompt || isGenerating
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-[#ADFF2F] text-black hover:bg-[#9AE62F]'
            }`}
          >
            <Wand2 size={20} />
            <span>{isGenerating ? 'GENERATING...' : 'GENERATE IMAGE'}</span>
          </button>
        </div>

        {/* Display User's NFTs */}
        {address && provider && (
          <div className="mt-12">
            <h2 className="text-2xl font-light mb-6 text-[#ADFF2F]">Your NFTs</h2>
            <UserNFTs userAddress={address} provider={provider} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTGenerator;