import { motion } from 'framer-motion';

const ParticleField = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(202)].map((_, index) => (
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
};

export default ParticleField;