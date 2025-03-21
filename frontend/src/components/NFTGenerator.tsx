import React, { useState, useEffect } from 'react';
import { Hexagon, ArrowLeft, Wand2, Wallet, LogOut } from 'lucide-react';
import { generateImage } from '../api/generate';
import { getContract } from '../config/contract';
import { useWallet } from '../context/WalletContext';
import UserNFTs from './UserNFTs';

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

  // Debug: Log wallet state changes
  useEffect(() => {
    console.log('Wallet State Changed:', {
      isConnected: !!address,
      address,
      error: walletError
    });
  }, [address, walletError]);

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);
    setError(null);
    setGeneratedImage(null);
    setMetadataUrl(null);

    try {
      // Start progress simulation
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 2, 95));
      }, 1000);

      const response = await generateImage(prompt);
      
      // Complete progress
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
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
    if (!metadataUrl || !signer || !address) {
      setError('Please connect wallet and generate image first');
      return;
    }

    setIsMinting(true);
    setError(null);

    try {
      console.log('🔄 Starting mint process...', {
        metadataUrl,
        address,
        hasSigner: !!signer
      });

      const contract = getContract(signer);
      console.log('📝 Contract instance created:', await contract.getAddress());

      // Estimate gas with error handling
      let gasEstimate;
      try {
        gasEstimate = await contract.estimateGas.mintNFT(address, metadataUrl);
        console.log('⛽ Gas estimate:', gasEstimate.toString());
      } catch (gasError) {
        console.error('Gas estimation failed:', gasError);
        throw new Error('Failed to estimate gas. Please check your wallet balance.');
      }

      // Send transaction
      const tx = await contract.mintNFT(address, metadataUrl, {
        gasLimit: gasEstimate.mul(120).div(100) // Add 20% buffer
      });

      console.log('📤 Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed:', receipt);

      const event = receipt.events?.find(e => e.event === 'NFTMinted');
      if (!event) {
        throw new Error('NFTMinted event not found in transaction receipt');
      }

      const tokenId = event.args?.tokenId.toString();
      alert(`NFT minted successfully! Token ID: ${tokenId}`);

    } catch (err) {
      console.error('❌ Minting error:', err);
      setError(`Minting failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsMinting(false);
    }
  };

  const handleConnectWallet = async () => {
    console.log('🔄 Connect wallet button clicked');
    try {
      const success = await connectWallet();
      console.log('Connection attempt result:', success);
      
      if (!success) {
        setLocalError('Wallet connection failed');
        console.error('❌ Connection failed');
      } else {
        console.log('✅ Wallet connected successfully');
        setLocalError(null);
      }
    } catch (err) {
      console.error('❌ Connection error:', err);
      setLocalError('Failed to connect wallet');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMxMTExMTEiLz48L3N2Zz4=')] opacity-20"></div>
      <div className="absolute inset-0 border border-[#1A1A1A] m-4 pointer-events-none"></div>

      <nav className="relative flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <Hexagon className="text-[#ADFF2F]" size={24} />
          <span className="text-xl font-mono tracking-wider">OPULENT NFTs</span>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-light text-[#ADFF2F]">Create Your NFT</h1>
          
          {!address ? (
            <button
              onClick={handleConnectWallet}
              className="px-6 py-2 bg-[#ADFF2F] hover:bg-[#9AE62F] text-black rounded-lg font-mono flex items-center space-x-2 transition-colors cursor-pointer"
              type="button"
            >
              <Wallet size={20} />
              <span>CONNECT WALLET</span>
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="font-mono text-sm">
                {`${address.slice(0, 6)}...${address.slice(-4)}`}
              </span>
              <button
                onClick={disconnectWallet}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-mono flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>DISCONNECT</span>
              </button>
            </div>
          )}
        </div>

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
            <span>{isGenerating ? 'GENERATING...' : 'GENERATE IMAGE'}</span>
          </button>
        </div>

        {(localError || walletError) && (
          <div className="mt-4 p-4 bg-red-500/20 text-red-400 rounded-lg">
            {localError || walletError}
          </div>
        )}

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