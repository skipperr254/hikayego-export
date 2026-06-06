import React from 'react';
import { motion } from 'framer-motion';
import FloatingShapes from './FloatingShapes';

const AnimatedVisual = () => {
  const imageUrl = 'https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/47f710aa80676b1d20d4c237d6675a23.png';

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <FloatingShapes />
      <motion.div
        className="relative z-10 w-full max-w-3xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src={imageUrl}
          alt="HikayeGO on laptop, tablet, and phone"
          className="w-full h-auto object-contain drop-shadow-2xl"
          animate={{
            y: ["0%", "-2%", "0%"],
            rotate: [-0.5, 0.5, -0.5]
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      </motion.div>
    </div>
  );
};

export default AnimatedVisual;