import React, { useState, useEffect } from 'react';
import { Hexagon } from 'lucide-react';

function ShuffleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState('');
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  const shuffleCount = 10; // Reduced for faster animation
  const characterChangeInterval = 30; // Faster interval

  useEffect(() => {
    let currentIndex = 0;
    let shufflesRemaining = shuffleCount;

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (shufflesRemaining > 0) {
          setDisplayText(prev => {
            const shuffled = text.split('').map((char, i) => {
              if (i < currentIndex) return char;
              if (char === ' ') return ' ';
              return characters[Math.floor(Math.random() * characters.length)];
            }).join('');
            return shuffled;
          });
          shufflesRemaining--;
        } else {
          if (currentIndex < text.length) {
            currentIndex++;
            shufflesRemaining = shuffleCount;
          } else {
            clearInterval(interval);
          }
        }
      }, characterChangeInterval);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span>{displayText || text.replace(/[A-Z]/g, '*')}</span>;
}

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMxMTExMTEiLz48L3N2Zz4=')] opacity-20"></div>

      {/* Border Effect */}
      <div className="absolute inset-0 border border-[#1A1A1A] m-4 pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-6">
          <div className="flex items-center space-x-2">
            <Hexagon className="text-[#ADFF2F]" size={24} />
            <span className="text-xl font-mono tracking-wider">NFTCONNECT</span>
          </div>
          <div className="flex space-x-6">
            {['EXPLORE NFTS', 'CREATE NFT', 'MARKETPLACE', 'ABOUT US', 'SUPPORT'].map((item) => (
              <button
                key={item}
                className="px-4 py-2 text-sm font-mono bg-[#ADFF2F]/10 hover:bg-[#ADFF2F]/20 text-[#ADFF2F] rounded transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex justify-between px-16 py-20">
          {/* Left Content */}
          <div className="max-w-2xl">
            <h1 className="text-[#ADFF2F] text-7xl font-light leading-tight tracking-tight mb-8 font-['Helvetica'] letter-spacing-[-0.05em]">
              <ShuffleText text="DECENTRALIZED" delay={0} />
              <br />
              <ShuffleText text="NFT EXCHANGE" delay={300} />
              <br />
              <ShuffleText text="PLATFORM" delay={600} />
            </h1>
            <p className="text-gray-400 font-mono mb-8 tracking-wide leading-relaxed opacity-0 animate-fade-in">
              DIVE INTO THE WORLD OF DIGITAL ART. EASILY CREATE, SELL, AND BUY NFTS WITH THE SECURITY AND TRANSPARENCY OF BLOCKCHAIN TECHNOLOGY.
            </p>
            <div className="flex space-x-4">
              <button className="px-8 py-3 bg-[#ADFF2F] text-black font-bold rounded hover:bg-[#9AE62F] transition-colors transform hover:scale-105">
                GET STARTED
              </button>
              <button className="px-8 py-3 border border-[#ADFF2F]/30 text-[#ADFF2F] rounded hover:bg-[#ADFF2F]/10 transition-colors transform hover:scale-105">
                LEARN MORE
              </button>
            </div>
          </div>

          {/* Right Content - NFT Cards */}
          <div className="relative w-[500px] h-[500px]">
            {/* Main NFT Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 bg-gradient-to-br from-[#ADFF2F]/20 to-transparent border border-[#ADFF2F]/30 rounded-lg overflow-hidden animate-float">
              <img 
                src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1000" 
                alt="NFT Art"
                className="w-full h-full object-cover mix-blend-screen"
              />
            </div>
            {/* Smaller NFT Cards */}
            <div className="absolute top-0 right-0 w-48 h-60 bg-gradient-to-br from-[#ADFF2F]/20 to-transparent border border-[#ADFF2F]/30 rounded-lg overflow-hidden rotate-12 animate-float-delayed-1">
              <img 
                src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1000" 
                alt="NFT Art"
                className="w-full h-full object-cover mix-blend-screen"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-48 h-60 bg-gradient-to-br from-[#ADFF2F]/20 to-transparent border border-[#ADFF2F]/30 rounded-lg overflow-hidden -rotate-12 animate-float-delayed-2">
              <img 
                src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1000" 
                alt="NFT Art"
                className="w-full h-full object-cover mix-blend-screen"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;