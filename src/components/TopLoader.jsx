import React from 'react';
import { motion } from 'framer-motion';

const TopLoader = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[9999] pointer-events-none">
      <motion.div
        className="h-full bg-primary shadow-lg shadow-primary/50"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        exit={{ width: '100%', opacity: 0 }}
        transition={{
          width: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
          opacity: { duration: 0.2, delay: 0.8 }
        }}
      />
    </div>
  );
};

export default TopLoader;