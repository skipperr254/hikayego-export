import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedVisual from '@/components/home/AnimatedVisual';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full h-auto md:h-auto min-h-[850px] lg:min-h-[800px] overflow-hidden flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-purple-100 dark:from-slate-900 dark:via-background dark:to-purple-900/30">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="text-center lg:text-left pt-20 lg:pt-0">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-slate-900 dark:text-white"
            >
              İngilizce Öğrenmenin
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                En Keyifli Yolu
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="mt-4 max-w-md mx-auto lg:mx-0 text-base md:text-lg text-slate-600 dark:text-slate-400"
            >
              Sıkıcı dersleri unutun. Sürükleyici hikayelerle İngilizce'yi keşfedin ve akıcı konuşmaya bir adım daha yaklaşın.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Button size="lg" className="hero-cta-button hero-cta-glow w-full sm:w-auto" onClick={handleGetStarted}>
                {user ? 'Okumaya Başla' : 'Kayıt Ol ve Başla'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="hero-secondary-button w-full sm:w-auto" onClick={scrollToHowItWorks}>
                <PlayCircle className="ml-0 mr-2 h-5 w-5" />
                Nasıl Çalışır?
              </Button>
            </motion.div>
          </div>
          <div className="relative h-[500px] lg:h-full flex items-center justify-center">
            <AnimatedVisual />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;