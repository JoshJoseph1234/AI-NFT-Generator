import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import ParticleField from './ParticleField';
import NavBar from './NavBar';

function LearnMore({ onBack }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('features');
  
  // Add ref for features section
  const featuresSectionRef = useRef(null);
  const techSectionRef = useRef(null);

  // Handle scroll events for nav effects and section tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Update active section based on scroll position
      if (techSectionRef.current && featuresSectionRef.current) {
        const techRect = techSectionRef.current.getBoundingClientRect();
        const featuresRect = featuresSectionRef.current.getBoundingClientRect();
        const viewportMiddle = window.innerHeight / 2;

        if (techRect.top <= viewportMiddle) {
          setActiveSection('technology');
        } else if (featuresRect.top <= viewportMiddle) {
          setActiveSection('features');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll handler functions
  const scrollToFeatures = () => {
    featuresSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTech = () => {
    techSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSectionChange = (section: string) => {
    if (section === 'features') {
      scrollToFeatures();
    } else if (section === 'technology') {
      scrollToTech();
    }
  };

  const features = [
    {
      title: "Create Unique NFTs",
      description: "Generate one-of-a-kind digital art pieces using advanced AI algorithms",
      icon: "🎨"
    },
    {
      title: "Secure Minting",
      description: "Mint your NFTs directly to the blockchain with automated smart contracts",
      icon: "🔐"
    },
    {
      title: "Easy Trading",
      description: "Buy and sell NFTs in our marketplace using cryptocurrency",
      icon: "💱"
    },
    {
      title: "Community Driven",
      description: "Join a thriving community of artists and collectors",
      icon: "👥"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-mono">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-black to-gray-900 z-0" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 z-0" />
      <ParticleField />
      
      {/* Use shared NavBar with learn variant */}
      <NavBar 
        currentPage="learn"
        activeSection={activeSection}
        onNavigate={() => {}}
        scrolled={scrolled}
        showBack={true}
        onBack={onBack}
        variant="learn"
        onSectionChange={handleSectionChange}
      />

      <div className="relative z-10 container mx-auto px-4 pt-[120px]">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl md:text-5xl font-gantari font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            About OPULENT NFTs
          </motion.h1>

          <motion.p
            className="text-gray-200 text-lg mb-16 font-mono"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            OPULENT NFTs is a cutting-edge platform that combines artificial intelligence with blockchain 
            technology to create unique, valuable digital art pieces. Our platform makes it easy for artists 
            and collectors to participate in the NFT revolution.
          </motion.p>

          {/* Features Grid */}
          <div 
            ref={featuresSectionRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 scroll-mt-32"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 rounded-lg bg-black/60 border border-green-400/20 shadow-lg shadow-green-400/5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.02, 
                  borderColor: "rgba(74, 222, 128, 0.3)",
                  boxShadow: "0 8px 16px rgba(74, 222, 128, 0.1)",
                  transition: { duration: 0.2 } 
                }}
              >
                <div className="text-3xl mb-4 bg-green-400/10 w-16 h-16 flex items-center justify-center rounded-lg">{feature.icon}</div>
                <h3 className="text-xl font-gantari font-semibold text-green-400 mb-2 tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-gray-300 font-mono text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Technology Stack */}
          <motion.div
            ref={techSectionRef}
            className="mt-16 p-8 rounded-lg bg-black/60 border border-green-400/20 shadow-lg shadow-green-400/5 scroll-mt-32"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl font-gantari font-bold text-green-400 mb-6 tracking-wide">
              Our Technology Stack
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "React.js", "TypeScript", "Framer Motion", "TailwindCSS",
                "Web3.js", "Smart Contracts", "IPFS", "Stable Diffusion"
              ].map((tech) => (
                <motion.div
                  key={tech}
                  className="px-4 py-3 rounded-lg bg-black/60 border border-green-400/10 text-center"
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: "rgba(74, 222, 128, 0.1)",
                    borderColor: "rgba(74, 222, 128, 0.3)" 
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <span className="text-gray-200 font-mono text-xs tracking-wider">{tech}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Footer/CTA */}
          <motion.div
            className="mt-16 mb-24 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LearnMore;