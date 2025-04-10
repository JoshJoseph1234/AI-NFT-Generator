import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import NFTGenerator from './components/NFTGenerator';
import { WalletProvider } from './context/WalletContext';
import LearnMore from './components/LearnMore';
import ParticleField from './components/ParticleField';
import NavBar from './components/NavBar';
import PageTransition from './components/PageTransition';
import ComingSoon from './components/ComingSoon';

// Shuffle Text Animation Component with improved performance
function ShuffleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState('');
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  const shuffleCount = 8; // Reduced for better performance
  const characterChangeInterval = 30; // Slightly slower for better readability

  useEffect(() => {
    let currentIndex = 0;
    let shufflesRemaining = shuffleCount;
    let intervalId: string | number | NodeJS.Timeout | undefined;
    
    const timeout = setTimeout(() => {
      intervalId = setInterval(() => {
        if (shufflesRemaining > 0) {
          setDisplayText(
            text
              .split('')
              .map((char: string, i: number) =>
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

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [transitionDirection, setTransitionDirection] = useState('left');
  const [previousPage, setPreviousPage] = useState('home');
  
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

  // Helper function to handle navigation with proper transitions
  const navigateTo = (page: string) => {
    setPreviousPage(currentPage);
    
    // Determine transition direction based on navigation flow
    if (page === 'home') {
      setTransitionDirection('left');
    } else {
      setTransitionDirection('right');
    }
    
    setCurrentPage(page);
  };

  const handleGetStarted = () => {
    navigateTo('generator');
  };

  return (
    <AnimatePresence mode="wait">
      <>
        {/* Only show NavBar when not on learn page */}
        {currentPage !== 'learn' && (
          <NavBar 
            currentPage={currentPage}
            activeSection={activeSection}
            onNavigate={(page) => {
              navigateTo(page);
            }}
            scrolled={scrolled}

            onBack={() => {
              setActiveSection('hero'); // Reset section when going back
              navigateTo('home');
            }}
          />
        )}
        
        {currentPage === 'generator' ? (
          <PageTransition type="slide" direction={transitionDirection}>
            <WalletProvider>
              <NFTGenerator onBack={() => {
                setActiveSection('hero'); // Reset section when going back
                navigateTo('home');
              }} />
            </WalletProvider>
          </PageTransition>
        ) : currentPage === 'learn' ? (
          <PageTransition type="slide" direction={transitionDirection}>
            <LearnMore onBack={() => navigateTo('home')} />
          </PageTransition>
        ) : currentPage === 'coming-soon' ? (
          <PageTransition type="slide" direction={transitionDirection}>
            <ComingSoon 
              onBack={() => navigateTo('home')} 
              currentPage={currentPage}
            />
          </PageTransition>
        ) : (
          <PageTransition type="slide" direction={transitionDirection}>
            <WalletProvider>
              <div className="min-h-screen bg-black text-white relative overflow-hidden font-mono">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-radial from-black to-gray-900 z-0" />
                <div className="absolute inset-0 bg-grid-pattern opacity-20 z-0" />
                <ParticleField />

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
                          className="text-green-400 text-4xl sm:text-5xl lg:text-6xl font-gantari font-bold leading-tight tracking-wide mb-6"
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
                              <ChevronRight size={16} className="ml-1 group-hover:translate-x-1" />
                            </span>
                            <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                          </motion.button>
                          <motion.button
                            className="px-6 py-4 bg-transparent border-2 border-green-400/30 text-green-400 font-mono 
                                      font-medium rounded-lg hover:bg-green-400/10 transition-all duration-300"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigateTo('learn')}
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
                                x: [0, -100 * nftImages.length * 16],
                              }}
                              transition={{
                                x: {
                                  duration: 180,
                                  repeat: Infinity,
                                  ease: "linear",
                                },
                              }}
                              style={{ willChange: 'transform' }}
                            >
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
                                    <div className="relative w-full h-full bg-gradient-to-br from-green-400/20 to-transparent p-[1px] rounded-xl">
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
                                          <h3 className="text-lg font-gantari font-semibold text-green-400 mb-2">
                                            {nft.title}
                                          </h3>
                                          <div className="flex items-center">
                                            <div className="h-1 w-12 bg-gradient-to-r from-green-500 to-green-300 rounded-full"></div>
                                            <span className="ml-3 text-sm text-gray-300 font-gantari">
                                              OPULENT NFT
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
                                x: [100 * nftImages.length * 16, 0],
                              }}
                              transition={{
                                x: {
                                  duration: 180,
                                  repeat: Infinity,
                                  ease: "linear",
                                },
                              }}
                              style={{ willChange: 'transform' }}
                            >
                              {[...nftImages, ...nftImages, ...nftImages, ...nftImages].map((nft, index) => (
                                <motion.div
                                  key={`nft-clone-${index}`}
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
                                              OPULENT NFT
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
          </PageTransition>
        )}
      </>
    </AnimatePresence>
  );
}

export default App;