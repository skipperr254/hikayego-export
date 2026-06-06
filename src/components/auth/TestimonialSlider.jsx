import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const StarRating = ({ rating }) => {
    if (!rating || rating < 1) return null;
    return (
        <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={cn(
                        "h-5 w-5",
                        i < rating ? "text-yellow-400 fill-yellow-400" : "text-white/30"
                    )}
                />
            ))}
        </div>
    );
};

const TestimonialSlider = ({ slides, loading }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % (slides?.length || 1));
    }, [slides]);

    useEffect(() => {
        if (!slides || slides.length <= 1) return;

        const slideDuration = slides[currentIndex]?.duration || 7000;
        const timer = setTimeout(nextSlide, slideDuration);

        return () => clearTimeout(timer);
    }, [currentIndex, slides, nextSlide]);


    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black">
                <Loader2 className="h-12 w-12 text-white animate-spin" />
            </div>
        );
    }

    if (!slides || slides.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-900 p-8">
                <Card className="bg-gray-800/50 border-gray-700 text-white text-center p-8 rounded-2xl">
                    <h3 className="text-xl font-bold">Slaytlar Yüklenemedi</h3>
                    <p className="text-muted-foreground mt-2">Görseller şu anda mevcut değil. Lütfen yönetici panelinden slayt ekleyin.</p>
                </Card>
            </div>
        );
    }

    const currentSlide = slides[currentIndex];
    const slideDuration = (currentSlide.duration || 7000) / 1000;

    const contentVariants = {
        enter: { opacity: 0, y: 30 },
        center: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.15, delayChildren: 0.3 } },
        exit: { opacity: 0, y: -30, transition: { duration: 0.6, ease: [0.64, 0, 0.78, 0] } },
    };

    const itemVariants = {
        enter: { opacity: 0, y: 20 },
        center: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
    };

    return (
        <div className="relative w-full h-full overflow-hidden bg-black">
            <AnimatePresence initial={false} mode="wait">
                <motion.div
                    key={currentIndex}
                    className="absolute inset-0"
                >
                    <motion.div
                        className="absolute inset-0 w-full h-full"
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <img
                            src={currentSlide.image_url}
                            alt={currentSlide.title || 'Authentication background'}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <motion.div
                            className={`absolute inset-0 bg-gradient-to-t ${currentSlide.gradient_colors || 'from-black/90 via-black/60 to-transparent'}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                        />
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            <div className="relative z-10 flex flex-col justify-end h-full p-10 md:p-16">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        variants={contentVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="text-white"
                    >
                        <motion.div variants={itemVariants}>
                            <StarRating rating={currentSlide.rating} />
                        </motion.div>
                        <motion.div variants={itemVariants} className="mb-8">
                            <p className="text-xl md:text-2xl font-medium text-white/90 leading-relaxed [text-shadow:0_2px_10px_rgba(0,0,0,0.5)] italic">
                                “{currentSlide.subtitle}”
                            </p>
                        </motion.div>
                        <motion.div variants={itemVariants} className="flex items-center">
                            <Avatar className="h-16 w-16 border-4 border-white/20 flex-shrink-0 shadow-lg">
                                <AvatarImage src={currentSlide.avatar_url} alt={currentSlide.title} className="object-cover" />
                                <AvatarFallback className="bg-primary/20 text-white font-bold text-2xl">
                                    {currentSlide.title ? currentSlide.title.charAt(0) : 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-5">
                                <p className="font-bold text-lg text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                                    {currentSlide.title}
                                </p>
                                <p className="text-md text-white/70">
                                    {currentSlide.user_title}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {slides.length > 1 && (
                    <div className="absolute bottom-8 left-0 right-0 px-10 md:px-16">
                        <div className="flex space-x-2">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className="relative flex-1 h-1.5 rounded-full bg-white/20"
                                >
                                    {index === currentIndex && (
                                        <motion.div
                                            className="absolute top-0 left-0 h-full rounded-full bg-white"
                                            initial={{ width: '0%' }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: slideDuration, ease: 'linear' }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestimonialSlider;