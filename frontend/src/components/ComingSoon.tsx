import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import ParticleField from './ParticleField';

interface ComingSoonProps {
  onBack: () => void;
  currentPage: string;
}

const ComingSoon = ({ onBack, currentPage }: ComingSoonProps) => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-mono">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-black to-gray-900 z-0" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 z-0" />
      <ParticleField />

      {/* Content */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="mb-6"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="p-8 bg-green-400/10 rounded-full inline-block">
              <Lock size={48} className="text-green-400" />
            </div>
          </motion.div>
          
          <motion.h1
            className="text-4xl md:text-5xl font-gantari font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Coming Soon
          </motion.h1>
          
          <motion.p
            className="text-gray-400 max-w-md mx-auto font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            This feature is currently under development. Stay tuned for updates!
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoon;