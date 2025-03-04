import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ethers } from 'ethers';
import NFTGenerator from '../components/NFTGenerator';
import { getContract } from '../config/contract';

// Mock ethers
jest.mock('ethers');

// Mock the contract config
jest.mock('../config/contract', () => ({
  getContract: jest.fn(),
  CONTRACT_ADDRESS: '0x123',
  CONTRACT_ABI: []
}));

// Mock the generate API
jest.mock('../api/generate', () => ({
  generateImage: jest.fn()
}));

describe('NFTGenerator', () => {
  let mockProvider;
  let mockSigner;
  let mockContract;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock MetaMask provider
    global.window.ethereum = {
      request: jest.fn().resolves(['0x123'])
    };

    // Mock ethers provider and signer
    mockSigner = {
      getAddress: jest.fn().resolves('0x123'),
    };
    
    mockProvider = {
      getSigner: jest.fn().returns(mockSigner)
    };

    // Mock contract
    mockContract = {
      mintNFT: jest.fn().resolves({
        wait: jest.fn().resolves({
          events: [{
            event: 'NFTMinted',
            args: { tokenId: '1', recipient: '0x123', tokenURI: 'ipfs://test' }
          }]
        })
      })
    };

    // Setup mocks
    (ethers.providers.Web3Provider as jest.Mock).mockReturnValue(mockProvider);
    (getContract as jest.Mock).mockReturnValue(mockContract);
  });

  it('should connect wallet and mint NFT', async () => {
    render(<NFTGenerator />);

    // Fill in prompt
    const promptInput = screen.getByPlaceholderText(/enter your prompt/i);
    fireEvent.change(promptInput, { target: { value: 'test prompt' } });

    // Click generate
    const generateButton = screen.getByText(/generate nft/i);
    fireEvent.click(generateButton);

    // Wait for image generation
    await waitFor(() => {
      expect(screen.getByAltText('Generated NFT')).toBeInTheDocument();
    });

    // Click mint
    const mintButton = screen.getByText(/mint nft/i);
    fireEvent.click(mintButton);

    // Verify wallet connection
    expect(window.ethereum.request).toHaveBeenCalledWith({
      method: 'eth_requestAccounts'
    });

    // Verify contract interaction
    await waitFor(() => {
      expect(mockContract.mintNFT).toHaveBeenCalled();
    });

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/NFT minted successfully/i)).toBeInTheDocument();
    });
  });

  it('should handle minting errors', async () => {
    mockContract.mintNFT.mockRejectedValueOnce(new Error('Minting failed'));
    render(<NFTGenerator />);

    // Simulate successful image generation
    const promptInput = screen.getByPlaceholderText(/enter your prompt/i);
    fireEvent.change(promptInput, { target: { value: 'test prompt' } });
    
    const generateButton = screen.getByText(/generate nft/i);
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByAltText('Generated NFT')).toBeInTheDocument();
    });

    // Try minting
    const mintButton = screen.getByText(/mint nft/i);
    fireEvent.click(mintButton);

    // Verify error handling
    await waitFor(() => {
      expect(screen.getByText(/Failed to mint NFT/i)).toBeInTheDocument();
    });
  });
});