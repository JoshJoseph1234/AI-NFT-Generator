import React, { useState } from 'react';
import { Hexagon, ArrowLeft, Wand2, Download } from 'lucide-react';
import { generateImage } from '../api/generate';

const NFTGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      console.log('Generating image with prompt:', prompt);
      const imageUrl = await generateImage(prompt);
      console.log('Received image URL:', imageUrl);

      // Pre-load the image
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageUrl;
      });

      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate NFT. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMxMTExMTEiLz48L3N2Zz4=')] opacity-20"></div>
      <div className="absolute inset-0 border border-[#1A1A1A] m-4 pointer-events-none"></div>

      <nav className="relative flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <Hexagon className="text-[#ADFF2F]" size={24} />
          <span className="text-xl font-mono tracking-wider">NFTCONNECT</span>
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
        <h1 className="text-4xl font-light mb-8 text-[#ADFF2F]">Create Your NFT</h1>
        
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
                  onError={(e) => {
                    console.error('Image failed to load:', generatedImage);
                    setError('Failed to load generated image.');
                    // Optionally retry loading the image
                    const img = e.target as HTMLImageElement;
                    if (!img.dataset.retried) {
                      img.dataset.retried = 'true';
                      setTimeout(() => {
                        img.src = generatedImage!;
                      }, 1000);
                    }
                  }}
                />
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
            <span>{isGenerating ? 'GENERATING...' : 'GENERATE NFT'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTGenerator;