import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LibraryBanner = () => {
    const { profile } = useAuth();
    const displayName = profile?.name?.split(' ')[0] || 'Gezgin';

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground"
        >
            <div className="absolute inset-0 z-0">
                <Sparkles className="absolute -left-4 -top-4 h-24 w-24 text-white/10" />
                <Sparkles className="absolute -right-8 -bottom-8 h-32 w-32 text-white/10" />
            </div>
            <div className="relative z-10">
                <h2 className="text-3xl font-bold">Yeteneklerini Geliştir, {displayName}!</h2>
                <p className="mt-2 max-w-2xl text-lg text-primary-foreground/80">Profesyonel online kurslarımızla İngilizce öğrenme maceranı bir üst seviyeye taşı.</p>
                <Button variant="secondary" className="mt-6 group">
                    Şimdi Başla
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
            </div>
        </motion.div>
    );
};

export default LibraryBanner;