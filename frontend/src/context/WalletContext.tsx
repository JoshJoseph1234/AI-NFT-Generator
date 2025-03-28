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
      console.group('🔄 Wallet Connection Process');
      console.log('1️⃣ Checking MetaMask...');
      
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask not installed');
      }

      console.log('2️⃣ Requesting accounts...');
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      console.log('3️⃣ Account found:', accounts[0]);
      
      console.log('4️⃣ Creating Web3Provider...');
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

      console.log('5️⃣ Getting network...');
      const network = await web3Provider.getNetwork();
      console.log('Current network:', network.chainId);

      if (network.chainId !== 11155111) {
        console.log('6️⃣ Switching to Sepolia...');
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }]
        }).catch(async (switchError: any) => {
          if (switchError.code === 4902) {
            console.log('Adding Sepolia network...');
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
            throw switchError;
          }
        });
      }

      console.log('7️⃣ Getting signer...');
      const web3Signer = web3Provider.getSigner();
      const userAddress = await web3Signer.getAddress();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAddress(userAddress);
      setError(null);

      console.log('✅ Wallet connection complete!');
      console.groupEnd();
      return true;

    } catch (err) {
      console.error('❌ Wallet connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      console.groupEnd();
      return false;
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAddress(null);
    setProvider(null);
    setSigner(null);
    setError(null);
  }, []);

  // Add persistence
  useEffect(() => {
    const checkPersistedConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const web3Signer = web3Provider.getSigner();
            const userAddress = await web3Signer.getAddress();

            setProvider(web3Provider);
            setSigner(web3Signer);
            setAddress(userAddress);
          }
        } catch (error) {
          console.error('Failed to restore connection:', error);
        }
      }
    };

    checkPersistedConnection();
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