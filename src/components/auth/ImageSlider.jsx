import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slideImages = images || [];
  const slideCount = slideImages.length;

  useEffect(() => {
    if (!isAutoPlaying || slideCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, 6000);
    return () => clearInterval(interval);
  }, [slideCount, isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000);
  };
  
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
  };

  if (slideCount === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-l-2xl">
      <AnimatePresence initial={false} custom={currentIndex}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${slideImages[currentIndex].gradient} z-10`}></div>
          <motion.img
            src={slideImages[currentIndex].url}
            alt={slideImages[currentIndex].title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: 'easeOut' }}
          />
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 md:p-16 bg-black/20">
        <motion.div 
          className="text-white"
          initial="hidden"
          animate="visible"
          key={currentIndex}
        >
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
            custom={0}
            variants={textVariants}
          >
            {slideImages[currentIndex].title}
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-2xl"
            custom={1}
            variants={textVariants}
          >
            {slideImages[currentIndex].subtitle}
          </motion.p>
        </motion.div>
      </div>

      {slideCount > 1 && (
        <div className="absolute bottom-8 right-8 z-30 flex items-center space-x-3">
          {slideImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className="w-3 h-3 rounded-full transition-all duration-300 hover:scale-125"
              style={{
                backgroundColor: index === currentIndex ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.4)',
                transform: index === currentIndex ? 'scale(1.3)' : 'scale(1)',
              }}
              whileHover={{ scale: 1.4 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;