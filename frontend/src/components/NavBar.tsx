import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, ChevronRight, ChevronLeft, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

// Internal ScanlineEffect component
const ScanlineEffect = () => (
  <div className="pointer-events-none fixed inset-0 z-40">
    {/* Static scanlines */}
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(173, 255, 47, 0.1) 2px, transparent 3px)',
        backgroundSize: '100% 4px'
      }}
    />
    
    {/* Moving scanline */}
    <motion.div
      className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#ADFF2F]/20 to-transparent"
      animate={{
        y: ['0%', '100%', '0%']
      }}
      transition={{
        duration: 3,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop'
      }}
    />
  </div>
);

// Internal DigitalNoiseOverlay component
const DigitalNoiseOverlay = () => {
  const [noise, setNoise] = useState<string[]>([]);

  useEffect(() => {
    const generateNoise = () => {
      const newNoise = [];
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2;
        const opacity = Math.random() * 0.03;
        newNoise.push(`${x}% ${y}% ${size}px rgba(173, 255, 47, ${opacity})`);
      }
      return newNoise;
    };

    setNoise(generateNoise());
    
    const interval = setInterval(() => {
      setNoise(generateNoise());
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: `${noise.map(n => `radial-gradient(circle at ${n})`).join(',')}`
      }}
    />
  );
};

interface NavBarProps {
  currentPage: string;
  activeSection?: string;
  onNavigate: (page: string) => void;
  scrolled: boolean;
  showBack?: boolean;
  onBack?: () => void;
  variant?: 'default' | 'learn'; // Add variant prop
  onSectionChange?: (section: string) => void; // Add section change handler
}

// Add section navigation items
const learnNavItems = [
  { name: 'FEATURES', section: 'features' },
  { name: 'TECHNOLOGY', section: 'technology' }
];

const NavBar = ({ 
  currentPage, 
  activeSection = 'hero', 
  onNavigate, 
  scrolled, 
  showBack, 
  onBack,
  variant = 'default',
  onSectionChange
}: NavBarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const defaultNavItems = [
    { name: 'EXPLORE', active: currentPage === 'home' },
    { name: 'CREATE', active: currentPage === 'generator' || activeSection === 'nft' },
    { name: 'MARKETPLACE', active: false },
    { name: 'ABOUT', active: false },
    { name: 'SUPPORT', active: false }
  ];

  const handleNavClick = (itemName: string) => {
    switch (itemName) {
      case 'EXPLORE':
        onNavigate('home');
        break;
      case 'CREATE':
        onNavigate('generator');
        break;
      default:
        break;
    }
    setMenuOpen(false);
  };

  return (
    <>
      <ScanlineEffect />
      <DigitalNoiseOverlay />
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/70 backdrop-blur-lg' : 'bg-transparent'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <nav className="flex justify-between items-center h-[80px] px-6 lg:px-12 max-w-screen-2xl mx-auto">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <Hexagon className="text-green-400 pulse-glow" size={24} />
            <span className="text-xl font-mono tracking-wider">
              OPULENT NFTs
            </span>
          </div>
          
          {/* Navigation Items - Conditional based on variant */}
          <div className="hidden lg:flex space-x-6">
            {variant === 'default' ? (
              // Default navigation items
              defaultNavItems.map((item) => (
                <motion.button
                  key={item.name}
                  className={`nav-button px-4 py-2 text-sm font-mono rounded-md relative focus:outline-none ${
                    item.active ? 'text-green-400' : 'text-gray-200 hover:text-green-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavClick(item.name)}
                >
                  {item.name}
                  {item.active && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-green-300"
                      layoutId="defaultNavTab"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))
            ) : (
              // Learn page navigation items
              learnNavItems.map((item) => (
                <motion.button
                  key={item.name}
                  className={`nav-button px-4 py-2 text-sm font-mono rounded-md relative focus:outline-none ${
                    activeSection === item.section.toLowerCase() ? 'text-green-400' : 'text-gray-200 hover:text-green-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSectionChange?.(item.section.toLowerCase())}
                >
                  {item.name}
                  {activeSection === item.section.toLowerCase() && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-green-300"
                      layoutId="learnNavTab"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))
            )}
          </div>

          {/* Back Button - Only show if showBack is true */}
          {showBack && onBack && (
            <motion.button
              onClick={onBack}
              className="px-4 py-2 bg-green-400/10 text-green-400 rounded-lg font-mono flex items-center space-x-2 hover:bg-green-400/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">BACK</span>
            </motion.button>
          )}
        </nav>
      </motion.header>

      {/* Mobile Menu - Only show for default variant */}
      <AnimatePresence>
        {menuOpen && variant === 'default' && (
          <motion.div
            className="lg:hidden fixed top-16 left-0 right-0 bg-black/95 backdrop-blur-xl z-40 border-b border-green-400/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col p-6 space-y-4">
              {defaultNavItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  className={`px-4 py-3 text-left font-mono border-b border-green-400/10 flex justify-between items-center ${
                    item.active ? 'text-green-400' : 'text-gray-200'
                  }`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleNavClick(item.name)}
                >
                  <span>{item.name}</span>
                  <ChevronRight size={16} className={item.active ? 'text-green-400' : 'text-gray-600'} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;