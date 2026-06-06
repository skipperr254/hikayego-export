import React from 'react';
import { motion } from 'framer-motion';

const Shape = ({ className, initial, animate, transition }) => (
  <motion.div
    className={`absolute rounded-full ${className}`}
    initial={initial}
    animate={animate}
    transition={transition}
  />
);

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
      <Shape
        className="w-[400px] h-[400px] bg-primary/10 dark:bg-primary/5 blur-3xl"
        initial={{ y: '100vh', x: '0vw', scale: 1.5 }}
        animate={{ y: '-100vh', x: '20vw' }}
        transition={{ duration: 40, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
      />
      <Shape
        className="w-[350px] h-[350px] bg-purple-500/10 dark:bg-purple-500/5 blur-3xl"
        initial={{ y: '100vh', x: '80vw', scale: 1.2 }}
        animate={{ y: '-100vh', x: '50vw' }}
        transition={{ duration: 50, repeat: Infinity, repeatType: 'reverse', ease: 'linear', delay: 5 }}
      />
      <Shape
        className="w-[300px] h-[300px] bg-pink-500/10 dark:bg-pink-500/5 blur-3xl"
        initial={{ y: '-100vh', x: '90vw', scale: 1 }}
        animate={{ y: '100vh', x: '10vw' }}
        transition={{ duration: 45, repeat: Infinity, repeatType: 'reverse', ease: 'linear', delay: 10 }}
      />
       <Shape
        className="w-[300px] h-[300px] bg-sky-500/10 dark:bg-sky-500/5 blur-3xl"
        initial={{ y: '50vh', x: '-20vw', scale: 1.3 }}
        animate={{ y: '50vh', x: '120vw' }}
        transition={{ duration: 60, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
    </div>
  );
};

export default AnimatedBackground;