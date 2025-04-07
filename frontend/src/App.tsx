import { useState, useEffect, useRef } from 'react';
import { Hexagon, ChevronRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import NFTGenerator from './components/NFTGenerator';
import { WalletProvider } from './context/WalletContext';
import { useWallet } from './context/WalletContext';

// Shuffle Text Animation Component with improved performance
function ShuffleText({ text, delay = 0 }) {
  const [displayText, setDisplayText] = useState('');
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  const shuffleCount = 8; // Reduced for better performance
  const characterChangeInterval = 30; // Slightly slower for better readability

  useEffect(() => {
    let currentIndex = 0;
    let shufflesRemaining = shuffleCount;
    let intervalId;
    
    const timeout = setTimeout(() => {
      intervalId = setInterval(() => {
        if (shufflesRemaining > 0) {
          setDisplayText(
            text
              .split('')
              .map((char, i) =>
                i < currentIndex || char === ' '
                  ? char
                  : characters[Math.floor(Math.random() * characters.length)]
              )
              .join('')
          );
          shufflesRemaining--;
        } else {
          if (currentIndex < text.length) {
            currentIndex++;
            shufflesRemaining = shuffleCount;
          } else {
            clearInterval(intervalId);
          }
        }
      }, characterChangeInterval);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(intervalId);
    };
  }, [text, delay]);

  return <span>{displayText || text.replace(/[A-Za-z0-9]/g, '*')}</span>;
}

// Enhanced Particle Field Component with better performance and visual appeal
function ParticleField() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(12)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            width: `${Math.max(2, Math.random() * 4)}px`,
            height: `${Math.max(2, Math.random() * 4)}px`,
            background: `radial-gradient(circle, rgba(74, 222, 128, ${
              0.4 + Math.random() * 0.5
            }) 0%, rgba(74, 222, 128, 0) 70%)`,
            top: `${Math.random() * 100}vh`,
            left: `${Math.random() * 100}vw`,
            filter: `blur(${Math.random() * 1.5}px)`,
          }}
          animate={{
            x: [0, Math.random() * 80 - 40],
            y: [0, Math.random() * 80 - 40],
            opacity: [0.7, 0.9, 0.7],
          }}
          transition={{
            repeat: Infinity,
            duration: 5 + Math.random() * 10,
            ease: 'easeInOut',
            repeatType: 'reverse',
          }}
        />
      ))}
    </div>
  );
}

// New component for digital noise overlay
function DigitalNoiseOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-5 mix-blend-overlay">
      <svg width="100%" height="100%" className="noise-svg">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}

// New component: Scanline effect for retro-futuristic feel
function ScanlineEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 scanline-effect opacity-10"></div>
  );
}

// New NFT Card Component for improved carousel
function NFTCard({ imageSrc, title, delay }) {
  return (
    <motion.div
      className="nft-card rounded-xl overflow-hidden relative glassmorphism-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: delay }}
      whileHover={{ scale: 1.05, rotateY: 5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent opacity-40 z-0"></div>
      <img 
        src={imageSrc} 
        alt={title} 
        className="w-full h-full object-cover mix-blend-luminosity"
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-sm font-medium text-green-400 truncate font-mono">{title}</h3>
        <div className="flex items-center mt-2">
          <div className="h-1 w-12 bg-green-400/50 rounded-full"></div>
          <span className="text-xs text-gray-300 ml-2 font-mono">OPULENT NFT</span>
        </div>
      </div>
    </motion.div>
  );
}

function App() {
  const { address, connectWallet, disconnectWallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  
  // NFT Images
  const nftImages = [
    {
      src: "https://img.freepik.com/free-photo/3d-rendering-financial-neon-bull_23-2151691919.jpg",
      title: "Neon Bull #104"
    },
    {
      src: "https://img.freepik.com/free-photo/anime-character-using-virtual-reality-glasses-metaverse_23-2151568829.jpg",
      title: "Metaverse Explorer #33"
    },
    {
      src: "https://img.freepik.com/free-photo/cyberpunk-bitcoin-illustration_23-2151611169.jpg",
      title: "Crypto Punk #777"
    }
  ];

  // Handle scroll events for nav effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Determine active section based on scroll position (for future sections)
      if (window.scrollY < 300) {
        setActiveSection('hero');
      } else {
        setActiveSection('nft');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentPage('generator');
    }, 2000); // Reduced loading time for better UX
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  const handleCreateClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentPage('generator');
    }, 1500);
  };

  if (isLoading) return <LoadingScreen />;

  if (currentPage === 'generator')
    return (
      <WalletProvider>
        <NFTGenerator onBack={() => setCurrentPage('home')} />
      </WalletProvider>
    );

  const navItems = [
    { name: 'EXPLORE', active: activeSection === 'hero' },
    { name: 'CREATE', active: activeSection === 'nft' },
    { name: 'MARKETPLACE', active: false },
    { name: 'ABOUT', active: false },
    { name: 'SUPPORT', active: false }
  ];

  return (
    <WalletProvider>
      <div className="min-h-screen bg-black text-white relative overflow-hidden font-mono">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 bg-gradient-radial from-black to-gray-900 z-0" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20 z-0" />
        <ParticleField />
        <DigitalNoiseOverlay />
        <ScanlineEffect />

        {/* Improved Navigation Bar */}
        <motion.header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            scrolled ? 'py-3 backdrop-blur-lg bg-black/70' : 'py-4 bg-transparent'
          }`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <nav className="flex justify-between items-center py-4 px-6 lg:px-12 max-w-screen-2xl mx-auto">
            <div className="flex items-center space-x-2">
              <Hexagon className="text-green-400 pulse-glow" size={24} />
              <span className="text-xl font-mono tracking-wider">
                OPULENT NFTs
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-6">
              {navItems.map((item) => (
                <motion.button
                  key={item.name}
                  className={`px-4 py-2 text-sm font-mono rounded-md relative ${
                    item.active ? 'text-green-400' : 'text-gray-200 hover:text-green-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (item.name === 'CREATE') {
                      handleCreateClick();
                    }
                  }}
                >
                  {item.name}
                  {item.active && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400"
                      layoutId="activeTab"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden flex items-center"
              onClick={() => setMenuOpen(!menuOpen)}
              whileTap={{ scale: 0.95 }}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? (
                <X size={24} className="text-green-400" />
              ) : (
                <Menu size={24} className="text-green-400" />
              )}
            </motion.button>
          </nav>
        </motion.header>

        {/* Mobile Menu - Improved */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="lg:hidden fixed top-16 left-0 right-0 bg-black/95 backdrop-blur-xl z-40 border-b border-green-400/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col p-6 space-y-4">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    className={`px-4 py-3 text-left font-mono border-b border-green-400/10 flex justify-between items-center ${
                      item.active ? 'text-green-400' : 'text-gray-200'
                    }`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{item.name}</span>
                    <ChevronRight size={16} className={item.active ? 'text-green-400' : 'text-gray-600'} />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="relative z-10">
          {/* Hero Section - Enhanced and Optimized for Mobile */}
          <section className="min-h-screen pt-8 px-4 lg:px-12 max-w-screen-2xl mx-auto flex flex-col justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Side: Text Content */}
              <motion.div
                className="flex-1 max-w-2xl z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <motion.h1
                  className="text-green-400 text-4xl sm:text-5xl lg:text-6xl font-mono font-bold leading-tight tracking-wide mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  <ShuffleText text="DECENTRALIZED" delay={0} />
                  <br />
                  <ShuffleText text="NFT EXCHANGE" delay={300} />
                  <br />
                  <ShuffleText text="PLATFORM" delay={600} />
                </motion.h1>
                <motion.p
                  className="text-gray-200 font-mono text-sm sm:text-base lg:text-lg mb-8 tracking-wide leading-relaxed max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  Dive into the world of digital art. Easily create, sell, and buy NFTs with the security 
                  and transparency of blockchain technology.
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.4 }}
                >
                  <motion.button
                    onClick={handleGetStarted}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-300 text-black font-mono font-semibold 
                              rounded-lg shadow-lg shadow-green-400/20 relative overflow-hidden group transition-all duration-300"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      GET STARTED
                      <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  </motion.button>
                  <motion.button
                    className="px-6 py-4 bg-transparent border-2 border-green-400/30 text-green-400 font-mono 
                              font-medium rounded-lg hover:bg-green-400/10 transition-all duration-300"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center">
                      LEARN MORE
                      <ChevronRight size={16} className="ml-1" />
                    </span>
                  </motion.button>
                </motion.div>
              </motion.div>
              
              {/* Right Side: NFT Gallery */}
              <motion.div 
                className="flex-1 relative w-full h-[500px] lg:h-[600px] mt-8 lg:mt-0 z-10 overflow-hidden nft-carousel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                {/* Carousel Container */}
                <div className="absolute inset-0">
                  <div className="relative flex space-x-8 px-4 items-center h-full">
                    {/* First Set */}
                    <motion.div
                      className="flex space-x-8 items-center"
                      animate={{
                        x: [0, -100 * nftImages.length * 16], // Adjust based on card width + gap
                      }}
                      transition={{
                        x: {
                          duration: 30,
                          repeat: Infinity,
                          ease: "linear",
                        },
                      }}
                      style={{ willChange: 'transform' }}
                    >
                      {/* Triple the array for seamless loop */}
                      {[...nftImages, ...nftImages, ...nftImages, ...nftImages].map((nft, index) => (
                        <motion.div
                          key={`nft-${index}`}
                          className="w-72 h-96 flex-shrink-0"
                          style={{ 
                            translateX: '0%',
                            willChange: 'transform'
                          }}
                        >
                          <div className="relative w-full h-full rounded-xl overflow-hidden nft-card group">
                            <div className="relative w-full h-full bg-gradient-to-br from-[#ADFF2F]/20 to-transparent p-[1px] rounded-xl">
                              <img 
                                src={nft.src}
                                alt={nft.title}
                                className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 
                                            group-hover:opacity-100 transition-all duration-500">
                                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 
                                              transition-transform duration-500">
                                  <h3 className="text-lg font-['Poppins'] font-semibold gradient-text mb-2">
                                    {nft.title}
                                  </h3>
                                  <div className="flex items-center">
                                    <div className="h-1 w-12 bg-gradient-to-r from-[#ADFF2F] to-white rounded-full"></div>
                                    <span className="ml-3 text-sm text-gray-300 font-['Inter']">
                                      GENESIS NFT
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Clone for seamless loop */}
                    <motion.div
                      className="flex space-x-8 items-center absolute left-0"
                      animate={{
                        x: [100 * nftImages.length * 16, 0], // Start from right edge
                      }}
                      transition={{
                        x: {
                          duration: 30,
                          repeat: Infinity,
                          ease: "linear",
                        },
                      }}
                      style={{ willChange: 'transform' }}
                    >
                      {[...nftImages, ...nftImages, ...nftImages, ...nftImages].map((nft, index) => (
                        // Same card component as above
                        <motion.div
                          key={`nft-clone-${index}`}
                          className="w-72 h-96 flex-shrink-0"
                          style={{ 
                            translateX: '0%',
                            willChange: 'transform'
                          }}
                        >
                          {/* Same card content as above */}
                          <div className="relative w-full h-full rounded-xl overflow-hidden nft-card group">
                            <div className="relative w-full h-full bg-gradient-to-br from-[#ADFF2F]/20 to-transparent p-[1px] rounded-xl">
                              <img 
                                src={nft.src}
                                alt={nft.title}
                                className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 
                                            group-hover:opacity-100 transition-all duration-500">
                                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 
                                              transition-transform duration-500">
                                  <h3 className="text-lg font-['Poppins'] font-semibold gradient-text mb-2">
                                    {nft.title}
                                  </h3>
                                  <div className="flex items-center">
                                    <div className="h-1 w-12 bg-gradient-to-r from-[#ADFF2F] to-white rounded-full"></div>
                                    <span className="ml-3 text-sm text-gray-300 font-['Inter']">
                                      GENESIS NFT
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>

                {/* Enhanced Edge Gradients */}
                <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black via-black/95 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black via-black/95 to-transparent z-10"></div>
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    </WalletProvider>
  );
}

export default App;