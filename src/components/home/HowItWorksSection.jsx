import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, BookOpenText, Crown, TrendingUp } from 'lucide-react';
import SectionHeader from '@/components/home/SectionHeader';

const steps = [
  {
    icon: UserPlus,
    title: 'Hesap Oluşturun',
    description: 'Saniyeler içinde ücretsiz kaydolarak HikayeGO dünyasına ilk adımı atın.',
  },
  {
    icon: BookOpenText,
    title: 'Keşfedin ve Okuyun',
    description: "Seviyenize uygun yüzlerce hikayeden dilediğinizi seçin ve anında okumaya başlayın.",
  },
  {
    icon: Crown,
    title: "Premium'a Geçin",
    description: "Tüm hikayelere, sesli okumaya ve özel özelliklere sınırsız erişim kazanın.",
  },
  {
    icon: TrendingUp,
    title: 'Öğrenin ve Gelişin',
    description: "Her gün yeni bir hikaye okuyun ve kelime dağarcığınızı geliştirerek akıcı olun.",
  },
];

const cardVariants = {
  offscreen: {
    y: 100,
    opacity: 0,
  },
  onscreen: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 40,
      damping: 15,
      delay: i * 0.15,
    },
  }),
};

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-24 overflow-hidden bg-white dark:bg-background">
      <div className="absolute inset-0 bg-[url('https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/de5e933f789d2d46e30b134a6c4293ef.svg')] opacity-5 dark:opacity-[0.02]"></div>
      
      <div className="container mx-auto px-4 relative">
        <SectionHeader 
          title="Nasıl Çalışır?" 
          subtitle="Öğrenme yolculuğunuz sadece 4 basit adımdan oluşuyor."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
              className="group"
            >
              <div className="relative p-6 h-full rounded-3xl overflow-hidden bg-background/50 dark:bg-slate-900/50 backdrop-blur-2xl shadow-lg transition-all duration-300 border border-border/10 hover:border-primary/30 hover:shadow-primary/10 hover:-translate-y-2">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-4">
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-primary/80 to-primary text-primary-foreground shadow-lg">
                      <step.icon className="h-6 w-6" />
                    </div>
                     <span className="text-6xl font-black text-slate-200/70 dark:text-slate-700/60 -mr-2 transition-colors duration-300 group-hover:text-primary/20">
                      {`0${index + 1}`}
                    </span>
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;