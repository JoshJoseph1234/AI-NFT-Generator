import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide';
  direction?: 'left' | 'right';
}

const PageTransition = ({ children, type = 'fade', direction = 'right' }: PageTransitionProps) => {
  const slideVariants = {
    initial: { 
      x: direction === 'right' ? '100%' : '-100%',
      opacity: 0
    },
    animate: { 
      x: 0,
      opacity: 1
    },
    exit: { 
      x: direction === 'right' ? '-100%' : '100%',
      opacity: 0
    }
  };

  const fadeVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={type === 'slide' ? slideVariants : fadeVariants}
      transition={{ 
        type: "tween", 
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;