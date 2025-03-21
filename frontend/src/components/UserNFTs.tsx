import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../config/contract';

interface NFT {
  tokenId: string;
  imageUrl: string;
  name: string;
  description: string;
}

const UserNFTs = ({ userAddress, provider }: { userAddress: string, provider: ethers.providers.Web3Provider }) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserNFTs();
  }, [userAddress]);

  const loadUserNFTs = async () => {
    if (!userAddress || !provider) return;

    try {
      setIsLoading(true);
      setError(null);

      const contract = getContract(provider);
      const tokenIds = await contract.getUserTokens(userAddress);
      
      const nftPromises = tokenIds.map(async (tokenId: number) => {
        const tokenURI = await contract.tokenURI(tokenId);
        const metadata = await fetch(tokenURI).then(res => res.json());
        
        return {
          tokenId: tokenId.toString(),
          imageUrl: metadata.image,
          name: metadata.name,
          description: metadata.description
        };
      });

      const loadedNfts = await Promise.all(nftPromises);
      setNfts(loadedNfts);
    } catch (err) {
      console.error('Error loading NFTs:', err);
      setError('Failed to load your NFTs');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-[#ADFF2F] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">Loading your NFTs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        {error}
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        You haven't minted any NFTs yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft) => (
        <div key={nft.tokenId} className="bg-black/40 border border-[#ADFF2F]/30 rounded-lg overflow-hidden">
          <img 
            src={nft.imageUrl} 
            alt={nft.name}
            className="w-full aspect-square object-cover"
          />
          <div className="p-4">
            <h3 className="font-mono text-[#ADFF2F] mb-2">{nft.name}</h3>
            <p className="text-sm text-gray-400 mb-2">{nft.description}</p>
            <p className="font-mono text-xs text-gray-500">Token ID: {nft.tokenId}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserNFTs;