import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.VITE_REPLICATE_API_TOKEN,
});

export async function generateImage(prompt: string): Promise<string> {
  try {
    console.log('Sending request with prompt:', prompt);
    
    const response = await fetch('http://localhost:5000/api/generate', {
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

    if (!data.imageUrl) {
      throw new Error('No image URL in response');
    }

    const imageUrl = Array.isArray(data.imageUrl) ? data.imageUrl[0] : data.imageUrl;

    if (typeof imageUrl !== 'string') {
      throw new Error('Invalid image URL format');
    }

    console.log('Received valid image URL:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error in generateImage:', error);
    throw error;
  }
}