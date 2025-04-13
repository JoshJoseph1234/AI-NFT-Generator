import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.VITE_REPLICATE_API_TOKEN,
});

export interface IPFSData {
  imageUrl: string;
  metadataUrl: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface GenerationResponse {
  imageUrl: string;
  ipfs: IPFSData;
  metadata: NFTMetadata;
}

export async function generateImage(prompt: string): Promise<GenerationResponse> {
  try {
    console.log('Sending request with prompt:', prompt);
    
    // Use the proxied URL instead of direct localhost
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    console.log('Raw server response:', data);

    if (!response.ok) {
      throw new Error(data.error || data.details || 'Failed to generate image');
    }

    if (!data.imageUrl || !data.ipfs) {
      throw new Error('Invalid response format');
    }

    return data;
  } catch (error) {
    console.error('Error in generateImage:', error);
    throw error;
  }
}