import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Star, Zap, Sparkles, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const premiumFeatures = [
    { text: "Tüm seviyelerde sınırsız hikaye erişimi" },
    { text: "Gelişmiş sesli okuma ve telaffuz pratiği" },
    { text: "Yapay zeka destekli kişisel öğrenme asistanı" },
    { text: "Sınırsız kelime kaydetme ve özel listeler" },
    { text: "Reklamsız ve kesintisiz öğrenme deneyimi" },
    { text: "Yeni içeriklere ve özelliklere erken erişim" },
];

const badgeTexts = ["En Popüler"];

const FloatingIcon = ({ icon: Icon, className, animate, transition }) => (
    <motion.div
        className={`absolute text-primary/20 dark:text-primary/10 ${className}`}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, ...animate }}
        transition={{ duration: 2, ...transition }}
    >
        <Icon className="w-full h-full" />
    </motion.div>
);

const PremiumPlanSection = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentBadge, setCurrentBadge] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBadge((prev) => (prev + 1) % badgeTexts.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleCtaClick = () => {
        navigate(user ? '/subscription' : '/register');
    };

    return (
        <section id="pricing" className="relative py-20 sm:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-purple-50 to-pink-50 dark:from-slate-900/50 dark:via-background dark:to-purple-900/20 -z-10"></div>
            
            <FloatingIcon 
                icon={Star} 
                className="w-16 h-16 top-[15%] left-[10%] opacity-50 hidden md:block"
                animate={{ y: [0, -20, 0], rotate: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
            />
            <FloatingIcon 
                icon={Crown} 
                className="w-24 h-24 top-[25%] right-[8%] opacity-50 hidden md:block"
                animate={{ y: [0, 30, 0], x: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
            />
            <FloatingIcon 
                icon={Zap} 
                className="w-12 h-12 bottom-[20%] left-[18%] opacity-50 hidden lg:block"
                animate={{ y: [0, -10, 0], rotate: [0, -30, 0] }}
                transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
            />
            <FloatingIcon 
                icon={Sparkles} 
                className="w-20 h-20 bottom-[15%] right-[15%] opacity-50 hidden md:block"
                animate={{ y: [0, 25, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
            />
            
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 sm:mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white tracking-tighter"
                    >
                        Öğrenme{' '}
                        <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Yolculuğuna
                        </span>
                        {' '}Başla
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
                    >
                        Tüm premium özelliklere erişmek ve dil öğrenimini bir üst seviyeye taşımak için şimdi başla.
                    </motion.p>
                </div>

                <div className="max-w-md md:max-w-lg lg:max-w-xl mx-auto relative">
                    <motion.div
                        className="absolute -inset-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-3xl opacity-20 blur-3xl"
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 8, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 50 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Card className="relative z-10 w-full rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl shadow-primary/10 border-2 border-white/50 dark:border-slate-800/80 overflow-hidden">
                            <CardHeader className="text-center p-8 pb-4">
                                <div className="h-8 mb-4">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={currentBadge}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                                            className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-purple-600 text-sm font-semibold text-white"
                                        >
                                            {badgeTexts[currentBadge]}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                                
                                <CardTitle className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Premium Plan</CardTitle>
                                
                                <div className="mt-4">
                                    <span className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                        ₺149,99
                                    </span>
                                    <span className="text-lg text-muted-foreground">/aylık</span>
                                </div>
                            </CardHeader>

                            <CardContent className="p-8 pt-6">
                                <ul className="space-y-4 mb-8">
                                    {premiumFeatures.map((feature, index) => (
                                        <li key={index} className="flex items-center space-x-3">
                                            <div className="w-5 h-5 flex items-center justify-center bg-green-100 dark:bg-green-900/50 rounded-full">
                                                <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <span className="text-slate-600 dark:text-slate-300">{feature.text}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button onClick={handleCtaClick} size="lg" className="w-full text-lg cta-glow-button py-6">
                                    <Crown className="mr-2 h-5 w-5" />
                                    {user ? "Premium'a Geç" : 'Hesap Oluştur ve Başla'}
                                </Button>
                                <div className="mt-4 text-center text-xs text-muted-foreground p-3 bg-secondary/50 rounded-lg flex items-start space-x-2">
                                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                                    <span>
                                      İstediğin zaman iptal edebilirsin. İptal ettiğinde, mevcut fatura döneminin sonuna kadar tüm premium özelliklerden yararlanmaya devam edersin.
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PremiumPlanSection;