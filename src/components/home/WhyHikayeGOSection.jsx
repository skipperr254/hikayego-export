import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Bot, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SectionHeader from '@/components/home/SectionHeader';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    className="flex items-start space-x-4"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.6, delay: delay, ease: 'easeOut' }}
  >
    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      <p className="mt-1 text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  </motion.div>
);

const WhyHikayeGOSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleStartLearning = () => {
    navigate(user ? '/dashboard' : '/register');
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Eğlenceli ve Sürükleyici Hikayeler',
      description: 'Dilbilgisi kurallarını ezberlemek yerine, sizi içine çeken hikayelerle doğal bir şekilde öğrenin. Her seviyeye uygun zengin kütüphanemizle sıkılmaya vaktiniz olmayacak.',
    },
    {
      icon: Bot,
      title: 'Yardımcı Asistan',
      description: 'Anında kelime çevirisi, gramer açıklamaları ve kişiselleştirilmiş quizlerle öğrenme sürecinizi hızlandırın. Yardımcı asistanınız her an yanınızda.',
    },
    {
      icon: TrendingUp,
      title: 'Gerçek ve Ölçülebilir İlerleme',
      description: 'Etkileşimli aktiviteler ve detaylı ilerleme raporları ile gelişiminizi takip edin. Okuma, anlama ve kelime dağarcığınızdaki farkı hissedin.',
    },
  ];

  const renderFeatures = () => {
    if (isMobile) {
      return (
        <Accordion type="single" collapsible className="w-full">
          {features.map((feature, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center space-x-4 text-left">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{feature.title}</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="pl-16 text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );
    }
    
    return features.map((feature, index) => (
      <FeatureCard key={index} {...feature} delay={0.4 + index * 0.2} />
    ));
  };


  return (
    <section id="why-hikayego" className="py-20 lg:py-32 bg-slate-50 dark:bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          <motion.div
            className="relative h-[350px] sm:h-[450px] md:h-[500px] lg:h-full flex items-center justify-center order-last lg:order-first"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-purple-500/10 rounded-full blur-3xl opacity-50"></div>
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img 
                  className="relative z-10 w-full h-auto drop-shadow-2xl object-contain"
                  alt="HikayeGO ile öğrenen bir kişi"
                  src="https://storage.googleapis.com/hostinger-horizons-assets-prod/47ed419b-a823-468d-9e6e-80c8442792f0/f1fe27e436601ce4fad0a106aafcd1d9.png" 
                />
              </motion.div>
            </div>
          </motion.div>
          <div className="text-center lg:text-left order-first lg:order-last">
             <SectionHeader 
                title="Neden HikayeGO?"
                titleHighlight="HikayeGO"
                subtitle="HikayeGO ile dil öğrenimi bir görevden keyifli bir maceraya dönüşür. Sıkıcı ders kitaplarını bir kenara bırakın ve İngilizceyi yaşayarak öğrenin."
              />
            
            <div className="mt-10 space-y-8">
              {renderFeatures()}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              className="mt-12 flex justify-center lg:justify-start"
            >
              <Button size="lg" className="cta-glow-button w-full sm:w-auto" onClick={handleStartLearning}>
                Bugün Öğrenmeye Başla
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyHikayeGOSection;