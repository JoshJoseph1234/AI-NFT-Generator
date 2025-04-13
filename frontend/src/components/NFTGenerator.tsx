import React, { useState, useEffect, useRef } from 'react';
import { Wand2, Wallet, LogOut, AlertCircle, Eye } from 'lucide-react';
import { generateImage } from '../api/generate';
import { getContract } from '../config/contract';
import { useWallet } from '../context/WalletContext';
import UserNFTs from './UserNFTs';
import { ethers } from 'ethers';
import ParticleField from './ParticleField';

const NFTGenerator = ({ onBack }) => {
  const { address, provider, signer, connectWallet, disconnectWallet, error: walletError } = useWallet();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isMinting, setIsMinting] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [metadataUrl, setMetadataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  // Track scroll position for header transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const monitorTransaction = async (tx: ethers.ContractTransaction) => {
    console.log('Monitoring transaction:', tx.hash);
    const receipt = await tx.wait(2);
    return receipt;
  };

  // Persist generated content
  useEffect(() => {
    const savedImage = localStorage.getItem('generatedImage');
    const savedMetadata = localStorage.getItem('metadataUrl');
    const savedPrompt = localStorage.getItem('lastPrompt');
    if (savedImage) setGeneratedImage(savedImage);
    if (savedMetadata) setMetadataUrl(savedMetadata);
    if (savedPrompt) setPrompt(savedPrompt);
  }, []);

  const saveToLocalStorage = (image: string, metadata: string) => {
    localStorage.setItem('generatedImage', image);
    localStorage.setItem('metadataUrl', metadata);
    localStorage.setItem('lastPrompt', prompt);
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('generatedImage');
    localStorage.removeItem('metadataUrl');
    localStorage.removeItem('lastPrompt');
  };

  const handleError = (err: Error) => {
    if (err.message.includes('cannot estimate gas')) {
      return 'Gas estimation failed';
    } else if (err.message.includes('user rejected')) {
      return 'Transaction was rejected by user';
    } else if (err.message.includes('insufficient funds')) {
      return 'Insufficient funds for gas';
    }
    return `Minting failed: ${err.message.slice(0, 100)}${err.message.length > 100 ? '...' : ''}`;
  };

  const handleGenerate = async () => {
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }
    if (!prompt) {
      promptRef.current?.focus();
      return;
    }

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
      const contract = getContract(signer);
      const gasPrice = await signer.getGasPrice();
      const gasEstimate = await contract.estimateGas.mintNFT(address, metadataUrl);

      const tx = await contract.mintNFT(address, metadataUrl, {
        gasLimit: gasEstimate.mul(120).div(100),
        gasPrice: gasPrice.mul(120).div(100),
      });

      const receipt = await monitorTransaction(tx);
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

      // Clear all generated content after successful minting
      clearLocalStorage();
      setGeneratedImage(null);
      setMetadataUrl(null);
      setPrompt('');
      
      // Show success message
      alert(`NFT minted successfully! Token ID: ${tokenId}`);

    } catch (err) {
      console.error('Minting error:', err);
      setError(handleError(err as Error));
    } finally {
      setIsMinting(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      const success = await connectWallet();
      if (!success) {
        setError('Failed to connect wallet');
        return;
      }
    } catch (err) {
      setError('Wallet connection failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleBackClick = (e: React.MouseEvent | null) => {
    if (e) e.preventDefault();
    disconnectWallet();
    onBack();
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-black to-gray-900 z-0" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 z-0" />
      <ParticleField />
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-24 md:py-32">
        {!address && (
          <div className="mb-8 p-4 bg-green-400/5 border border-green-400/20 rounded-lg text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertCircle size={20} className="text-green-400 mr-2" />
              <h3 className="font-medium">Wallet Required</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Connect your wallet to generate and mint unique AI-powered NFTs
            </p>
          </div>
        )}

        {/* NFT Generation Interface */}
        <div className="bg-black/40 backdrop-blur-sm border border-green-400/20 p-4 md:p-8 rounded-xl shadow-xl mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-1 py-2 mb-6">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-4 md:mb-0">
              Create Your <span className="text-green-400">NFT</span>
            </h2>

            <div className="flex items-center space-x-3">
              {!address ? (
                <button
                  onClick={handleConnectWallet}
                  className="px-4 py-2 bg-green-400/10 hover:bg-green-400/20 text-green-400 
                            rounded-lg font-mono flex items-center space-x-2 transition-colors 
                            text-sm md:text-base"
                >
                  <Wallet size={16} />
                  <span className="hidden sm:inline">CONNECT WALLET</span>
                </button>
              ) : (
                <>
                  <span className="font-mono text-xs md:text-sm bg-gray-800/50 py-1 px-2 rounded">
                    {`${address.slice(0, 4)}...${address.slice(-4)}`}
                  </span>
                  <button
                    onClick={disconnectWallet}
                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 
                              rounded-lg font-mono flex items-center space-x-2 transition-colors 
                              text-xs md:text-sm"
                  >
                    <LogOut size={14} />
                    <span className="hidden sm:inline">DISCONNECT</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-mono text-gray-400 mb-2 flex items-center">
              <Eye size={14} className="mr-2" />
              DESCRIBE YOUR VISION
            </label>
            <textarea
              ref={promptRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 bg-black/60 text-white border border-green-400/20 rounded-lg p-4 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/30 transition-colors resize-none"
              placeholder="Enter a detailed description of the NFT you want to generate..."
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">{prompt.length} characters</span>
              <span className="text-xs text-gray-500">
                {prompt.length > 0 ? 'Pro tip: Be specific about style and details' : ''}
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-start">
              <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isGenerating && (
            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-mono text-green-400">GENERATING</span>
                <span className="text-green-400 font-mono">{generationProgress}%</span>
              </div>
              <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-300 transition-all duration-300 ease-out"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {generatedImage && (
            <div className="mb-6">
              <div className="relative rounded-lg overflow-hidden border border-green-400/30 shadow-lg shadow-green-400/5">
                <img
                  src={generatedImage}
                  alt="Generated NFT"
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-white text-sm font-medium mb-1 line-clamp-1">
                    {prompt.split(' ').slice(0, 5).join(' ')}
                    {prompt.split(' ').length > 5 ? '...' : ''}
                  </div>
                  <div className="text-xs text-gray-300 line-clamp-2 opacity-80">
                    {prompt}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleMint}
                  disabled={!address || isMinting || !metadataUrl}
                  title={!address ? 'Please connect your wallet first' : undefined}
                  className={`w-full py-4 rounded-lg font-mono flex items-center justify-center space-x-2 transition-all ${
                    !address || isMinting || !metadataUrl
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-green-400 text-black hover:bg-green-300'
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
                : 'bg-green-400 text-black hover:bg-green-300'
            }`}
          >
            <Wand2 size={20} />
            <span>{isGenerating ? 'GENERATING...' : 'GENERATE IMAGE'}</span>
          </button>
        </div>

        {/* Display User's NFTs */}
        {address && provider && (
          <div className="mt-12">
            <h2 className="text-2xl font-light mb-6 flex items-center">
              <span className="mr-2 text-white">Your</span>
              <span className="text-green-400">Collection</span>
            </h2>
            <UserNFTs userAddress={address} provider={provider} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTGenerator;