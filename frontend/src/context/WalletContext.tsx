import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  address: string | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  error: string | null;
}

export const WalletContext = createContext<WalletContextType>({} as WalletContextType);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask or use a compatible wallet.');
      }
  
      // Create Web3Provider instance
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
  
      // Request account access - this triggers the MetaMask popup
      const accounts = await web3Provider.send('eth_requestAccounts', []);
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet.');
      }
  
      // Get the signer
      const web3Signer = web3Provider.getSigner();
      const userAddress = await web3Signer.getAddress();
  
      // Check if we're on the Sepolia network
      const network = await web3Provider.getNetwork();
      if (network.chainId !== 11155111) { // Sepolia chain ID
        try {
          // Try to switch to Sepolia
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia chainId in hex
          });
        } catch (switchError: any) {
          // If Sepolia is not added to MetaMask, add it
          if (switchError.code === 4902) {
            const alchemyApiKey = import.meta.env.VITE_ALCHEMY_API_KEY;
            if (!alchemyApiKey) {
              throw new Error('Alchemy API key is missing. Please configure your environment variables.');
            }
  
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xaa36a7',
                chainName: 'Sepolia',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: [`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }]
            });
          } else {
            throw switchError; // Re-throw other errors
          }
        }
      }
  
      // Set the state
      setProvider(web3Provider);
      setSigner(web3Signer);
      setAddress(userAddress);
      setError(null);
      return true;
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      return false;
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAddress(null);
    setProvider(null);
    setSigner(null);
    setError(null);
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAddress(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, [disconnectWallet]);

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