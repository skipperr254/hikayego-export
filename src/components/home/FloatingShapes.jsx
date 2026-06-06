import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, BookOpen, Cloud, Star } from 'lucide-react';

const icons = [
  { Icon: MessageSquare, style: 'text-blue-400/50 dark:text-blue-600/40', top: '20%', left: '15%', size: 'w-12 h-12', duration: 30, delay: 0.2 },
  { Icon: BookOpen, style: 'text-purple-400/50 dark:text-purple-600/40', top: '30%', left: '80%', size: 'w-16 h-16', duration: 35, delay: 2.2 },
  { Icon: Cloud, style: 'text-sky-400/50 dark:text-sky-600/40', top: '75%', left: '10%', size: 'w-20 h-20', duration: 40, delay: 1.2 },
  { Icon: Star, style: 'text-pink-400/50 dark:text-pink-600/40', top: '85%', left: '85%', size: 'w-10 h-10', duration: 25, delay: 3.2 },
  { Icon: MessageSquare, style: 'text-emerald-400/50 dark:text-emerald-600/40', top: '10%', left: '50%', size: 'w-8 h-8', duration: 28, delay: 4.7 },
];

const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
      {icons.map(({ Icon, style, top, left, size, duration, delay }, index) => (
        <motion.div
          key={index}
          initial={{ y: 50, scale: 0, opacity: 0 }}
          animate={{
            y: [50, -30, 50],
            x: [0, 25, -25, 0],
            rotate: [0, 90, -90, 0],
            scale: [0, 1, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: duration,
            ease: 'linear',
            repeat: Infinity,
            delay: delay,
          }}
          className={`absolute ${size}`}
          style={{ top, left }}
        >
          <Icon className={`w-full h-full ${style}`} strokeWidth={1} />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingShapes;