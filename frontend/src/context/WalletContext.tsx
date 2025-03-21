import React, { createContext, useContext, useState, useCallback } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  address: string | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  error: string | null;
}

export const WalletContext = createContext<WalletContextType>({
  address: null,
  provider: null,
  signer: null,
  connectWallet: async () => false,
  disconnectWallet: () => {},
  error: null
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    try {
      console.log('🔄 Starting wallet connection...');
      
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed! Please install MetaMask.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      console.log('📱 Connected accounts:', accounts);

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Initialize Web3Provider
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log('🔗 Provider initialized');

      // Get network and switch to Sepolia if needed
      const network = await web3Provider.getNetwork();
      console.log('🌐 Current network:', network.chainId);

      if (network.chainId !== 11155111) {
        await switchToSepolia(web3Provider);
      }

      const web3Signer = web3Provider.getSigner();
      const userAddress = await web3Signer.getAddress();

      setAddress(userAddress);
      setProvider(web3Provider);
      setSigner(web3Signer);
      setError(null);

      console.log('✅ Wallet connected:', userAddress);
      return true;
    } catch (err) {
      console.error('❌ Wallet connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      return false;
    }
  }, []);

  const switchToSepolia = async (provider: ethers.providers.Web3Provider) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }] // Sepolia chainId
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xaa36a7',
            chainName: 'Sepolia',
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: [`https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`],
            blockExplorerUrls: ['https://sepolia.etherscan.io']
          }]
        });
      } else {
        throw error;
      }
    }
  };

  const disconnectWallet = useCallback(() => {
    console.log('Disconnecting wallet');
    setAddress(null);
    setProvider(null);
    setSigner(null);
    setError(null);
  }, []);

  return (
    <WalletContext.Provider value={{
      address,
      provider,
      signer,
      connectWallet,
      disconnectWallet,
      error
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);