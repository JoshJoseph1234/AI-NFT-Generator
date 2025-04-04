import React, { useState, useEffect } from 'react';
import { Hexagon } from 'lucide-react';
import LoadingScreen from './components/LoadingScreen';
import NFTGenerator from './components/NFTGenerator';
import { WalletProvider } from './context/WalletContext';

// Shuffle Text Animation Component
function ShuffleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState('');
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  const shuffleCount = 10;
  const characterChangeInterval = 30;

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
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const handleGetStarted = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentPage('generator');
    }, 3000);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (currentPage === 'generator') {
    return (
      <WalletProvider>
        <NFTGenerator onBack={() => setCurrentPage('home')} />
      </WalletProvider>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMxMTExMTEiLz48L3N2Zz4=')] opacity-20"></div>
      <div className="absolute inset-0 border border-[#1A1A1A] m-4 pointer-events-none"></div>

      <div className="relative">
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

        <div className="flex justify-between px-16 py-20">
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
              <button 
                onClick={handleGetStarted}
                className="px-8 py-3 bg-[#ADFF2F] text-black font-bold rounded hover:bg-[#9AE62F] transition-colors transform hover:scale-105"
              >
                GET STARTED
              </button>
              <button className="px-8 py-3 border border-[#ADFF2F]/30 text-[#ADFF2F] rounded hover:bg-[#ADFF2F]/10 transition-colors transform hover:scale-105">
                LEARN MORE
              </button>
            </div>
          </div>

          <div className="relative w-[500px] h-[500px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 bg-gradient-to-br from-[#ADFF2F]/20 to-transparent border border-[#ADFF2F]/30 rounded-lg overflow-hidden animate-float">
              <img 
                src="https://img.freepik.com/free-photo/3d-rendering-financial-neon-bull_23-2151691919.jpg?t=st=1738762234~exp=1738765834~hmac=9fb50eb8e93bcf7fb5da6f1a187000fb0bde41cad4e1b828fc98f9f25c44b543&w=740" 
                alt="NFT Art"
                className="w-full h-full object-cover mix-blend-screen"
              />
            </div>
            <div className="absolute top-0 right-0 w-48 h-60 bg-gradient-to-br from-[#ADFF2F]/20 to-transparent border border-[#ADFF2F]/30 rounded-lg overflow-hidden rotate-12 animate-float-delayed-1">
              <img 
                src="https://img.freepik.com/free-photo/anime-character-using-virtual-reality-glasses-metaverse_23-2151568829.jpg?t=st=1738762333~exp=1738765933~hmac=caafb23630a0e449b3836f777488a47585944639124cf1760865c78785e1ed4f&w=740" 
                alt="NFT Art"
                className="w-full h-full object-cover mix-blend-screen"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-48 h-60 bg-gradient-to-br from-[#ADFF2F]/20 to-transparent border border-[#ADFF2F]/30 rounded-lg overflow-hidden -rotate-12 animate-float-delayed-2">
              <img 
                src="https://img.freepik.com/free-photo/cyberpunk-bitcoin-illustration_23-2151611169.jpg?t=st=1738761756~exp=1738765356~hmac=256f1007860b251f3aa0447718408d96b34c68f889553e6647894ca68f0be771&w=740" 
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