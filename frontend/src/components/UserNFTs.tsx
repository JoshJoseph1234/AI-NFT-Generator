import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../config/contract';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';

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
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);

  useEffect(() => {
    loadUserNFTs();
  }, [userAddress]);

  const loadUserNFTs = async () => {
    if (!userAddress || !provider) return;

    try {
      setIsLoading(true);
      setError(null);

      const signer = provider.getSigner();
      const contract = getContract(signer);
      const tokenIds = await contract.getUserTokens(userAddress);
      
      const nftPromises = tokenIds.map(async (tokenId: number) => {
        try {
          const tokenURI = await contract.tokenURI(tokenId);
          const metadata = await fetch(tokenURI).then(res => res.json());
          
          return {
            tokenId: tokenId.toString(),
            imageUrl: metadata.image,
            name: metadata.name || `NFT #${tokenId}`,
            description: metadata.description || 'No description available'
          };
        } catch (err) {
          console.error(`Error loading NFT #${tokenId}:`, err);
          return {
            tokenId: tokenId.toString(),
            imageUrl: '',
            name: `NFT #${tokenId}`,
            description: 'Failed to load metadata'
          };
        }
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

  const handleNftClick = (nft: NFT) => {
    setSelectedNft(nft);
  };

  const closeModal = () => {
    setSelectedNft(null);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 bg-black/20 rounded-xl border border-gray-800">
        <div className="animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400 font-mono tracking-wider">LOADING COLLECTION</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400 bg-red-500/10 rounded-xl border border-red-500/30">
        <ImageIcon size={32} className="mx-auto mb-4 opacity-50" />
        <p>{error}</p>
        <button 
          onClick={loadUserNFTs} 
          className="mt-4 px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 bg-black/20 rounded-xl border border-gray-800">
        <ImageIcon size={32} className="mx-auto mb-4 opacity-50" />
        <p className="mb-2">You haven't minted any NFTs yet</p>
        <p className="text-sm text-gray-500">Create your first NFT by generating an image above</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {nfts.map((nft) => (
          <div 
            key={nft.tokenId} 
            className="bg-black/40 border border-gray-800 hover:border-green-400/30 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer group"
            onClick={() => handleNftClick(nft)}
          >
            <div className="aspect-square relative overflow-hidden">
              {nft.imageUrl ? (
                <img 
                  src={nft.imageUrl} 
                  alt={nft.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <ImageIcon size={32} className="text-gray-700" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <button className="bg-green-400 text-black px-4 py-2 rounded-lg text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-mono text-green-400 mb-1 truncate group-hover:text-green-300 transition-colors">{nft.name}</h3>
              <p className="text-xs text-gray-400 mb-2 line-clamp-2 h-8">{nft.description}</p>
              <div className="flex justify-between items-center">
                <p className="font-mono text-xs text-gray-500">#{nft.tokenId}</p>
                <div className="h-6 w-6 rounded-full bg-green-400/10 flex items-center justify-center">
                  <ExternalLink size={12} className="text-green-400" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NFT Detail Modal */}
      {selectedNft && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div 
            className="relative max-w-2xl w-full bg-gray-900 rounded-xl border border-green-400/20 shadow-xl max-h-[90vh] overflow-y-auto" 
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="sticky top-4 right-4 z-10 float-right">
              <button 
                className="h-8 w-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                onClick={closeModal}
              >
                <span className="text-gray-400">✕</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 md:p-6">
              {/* Image Container with fixed aspect ratio */}
              <div className="relative w-full rounded-lg overflow-hidden mb-6 border border-gray-800">
                <div className="aspect-w-1 aspect-h-1">
                  {selectedNft.imageUrl ? (
                    <img 
                      src={selectedNft.imageUrl} 
                      alt={selectedNft.name}
                      className="w-full h-full object-contain bg-black/40"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <ImageIcon size={48} className="text-gray-700" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* NFT Details */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <h2 className="text-xl md:text-2xl font-mono text-green-400 break-all">{selectedNft.name}</h2>
                  <div className="bg-gray-800 px-3 py-1 rounded-full text-xs font-mono flex-shrink-0">
                    Token #{selectedNft.tokenId}
                  </div>
                </div>

                <p className="text-sm text-gray-400 break-words whitespace-pre-wrap">
                  {selectedNft.description}
                </p>

                <div className="flex justify-end mt-2">
                  <button 
                    className="px-6 py-2 bg-green-400 text-black rounded-lg text-sm font-medium hover:bg-green-500 transition-colors"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserNFTs;