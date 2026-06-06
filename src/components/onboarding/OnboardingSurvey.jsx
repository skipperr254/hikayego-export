import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Briefcase, GraduationCap, Plane, Brain, Compass, Wand2, Rocket, Fingerprint, Heart, ScrollText, PartyPopper, Drama, Swords, ArrowRight, ChevronLeft, Users, Trophy, Smile } from 'lucide-react';

const surveySteps = [
  {
    id: 'goal',
    title: 'İngilizce öğrenme hedefin nedir?',
    options: [
      { value: 'career', label: 'Kariyer', icon: Briefcase },
      { value: 'education', label: 'Eğitim', icon: GraduationCap },
      { value: 'travel', label: 'Seyahat', icon: Plane },
      { value: 'personal_growth', label: 'Kişisel Gelişim', icon: Brain },
      { value: 'social', label: 'Sosyal İletişim', icon: Users },
      { value: 'exam', label: 'Sınav Hazırlığı', icon: Trophy },
    ],
    maxSelection: 1,
    mascot: "https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/1c6e444e1d996ba0f4bc990b6fd236db.png"
  },
  {
    id: 'level',
    title: 'İngilizce seviyen nedir?',
    options: [
      { value: 'a1', label: 'A1 - Yeni Başlıyorum' },
      { value: 'a2', label: 'Temelleri Biliyorum' },
      { value: 'b1', label: 'Orta Düzeydeyim' },
      { value: 'b2', label: 'Rahatça İletişim Kurarım' },
      { value: 'c1', label: 'Akıcı Konuşurum' },
    ],
    maxSelection: 1,
    mascot: "https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/1c6e444e1d996ba0f4bc990b6fd236db.png"
  },
  {
    id: 'genre',
    title: 'Hangi tür hikayeleri seversin?',
    subtitle: 'En fazla 3 tane seçebilirsin.',
    options: [
      { value: 'adventure', label: 'Macera', icon: Compass },
      { value: 'fantasy', label: 'Fantastik', icon: Wand2 },
      { value: 'sci-fi', label: 'Bilim Kurgu', icon: Rocket },
      { value: 'mystery', label: 'Gizem', icon: Fingerprint },
      { value: 'romance', label: 'Romantizm', icon: Heart },
      { value: 'history', label: 'Tarihi', icon: ScrollText },
      { value: 'comedy', label: 'Komedi', icon: PartyPopper },
      { value: 'drama', label: 'Dram', icon: Drama },
      { value: 'thriller', label: 'Gerilim', icon: Swords },
    ],
    maxSelection: 3,
    mascot: "https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/1c6e444e1d996ba0f4bc990b6fd236db.png"
  },
  {
    id: 'forKids',
    title: 'Bu hesap çocuklar için mi kullanılacak?',
    subtitle: 'Çocuk modu, daha basit ve güvenli bir arayüz sunar.',
    options: [
      { value: 'yes', label: 'Evet, Çocuklar İçin', icon: Smile },
      { value: 'no', label: 'Hayır, Yetişkin İçin', icon: Briefcase },
    ],
    maxSelection: 1,
    mascot: "https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/1c6e444e1d996ba0f4bc990b6fd236db.png"
  },
];

const welcomeMessages = [
  "Merhaba Ben Higo! HikayeGO'ya hoş geldin! 👋",
  "Ben senin İngilizce öğrenme yolculuğunda rehberin olacağım! 🦊",
  "Sana en uygun hikayeleri önerebilmem için sadece bir kaç kısa soru sormam gerekiyor. Hazır mısın? ✨"
];

const allMascotUrls = [
  "https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/3615f2098099762eaf07d94c64c0e7ae.gif",
  "https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/1c6e444e1d996ba0f4bc990b6fd236db.png",
  "https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/1f5453e687f79d69f4e818be165611a3.png",
  "https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/96a9ef0496d4768b49c27ebe24e7161b.png",
];

const OnboardingSurvey = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(-1); // -1 for welcome screen
  const [answers, setAnswers] = useState({ goal: [], level: [], genre: [], forKids: [] });
  const [direction, setDirection] = useState(1);
  const [limitReached, setLimitReached] = useState(false);
  const [welcomeMessageIndex, setWelcomeMessageIndex] = useState(0);
  const [showStartButton, setShowStartButton] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const mainContentRef = useRef(null);
  const welcomeTimeoutRef = useRef(null);

  const stepData = currentStep >= 0 ? surveySteps[currentStep] : null;

  // Preload images to prevent flickering
  useEffect(() => {
    let loadedCount = 0;
    allMascotUrls.forEach(url => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === allMascotUrls.length) {
          setImagesLoaded(true);
        }
      };
      img.src = url;
    });

    // Fallback if images take too long
    const timeout = setTimeout(() => setImagesLoaded(true), 2000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
    
    return () => {
        document.documentElement.classList.remove('light');
        document.documentElement.style.colorScheme = '';
    };
  }, []);

  const handleNextWelcomeMessage = () => {
    if (welcomeTimeoutRef.current) {
      clearTimeout(welcomeTimeoutRef.current);
    }
    if (welcomeMessageIndex < welcomeMessages.length - 1) {
      setWelcomeMessageIndex(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (currentStep === -1 && imagesLoaded) {
      if (welcomeMessageIndex < welcomeMessages.length - 1) {
        welcomeTimeoutRef.current = setTimeout(() => {
          setWelcomeMessageIndex(prev => prev + 1);
        }, 3000);
      } else {
        setShowStartButton(true);
      }
    }
    return () => {
      if (welcomeTimeoutRef.current) {
        clearTimeout(welcomeTimeoutRef.current);
      }
    };
  }, [currentStep, welcomeMessageIndex, imagesLoaded]);

  useEffect(() => {
    if (limitReached) {
      const timer = setTimeout(() => setLimitReached(false), 500);
      return () => clearTimeout(timer);
    }
  }, [limitReached]);

  const handleSelect = (stepId, value) => {
    if (stepData.maxSelection > 1) {
      setAnswers(prev => {
        const currentSelection = prev[stepId] || [];
        if (currentSelection.includes(value)) {
          return { ...prev, [stepId]: currentSelection.filter(item => item !== value) };
        }
        if (currentSelection.length < stepData.maxSelection) {
          return { ...prev, [stepId]: [...currentSelection, value] };
        }
        setLimitReached(true);
        return prev;
      });
    } else {
       setAnswers(prev => ({ ...prev, [stepId]: [value] }));
    }
  };

  const startSurvey = () => {
    setDirection(1);
    setCurrentStep(0);
  };

  const nextStep = async () => {
    if (currentStep < surveySteps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleting(true);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const finalAnswers = {
        goal: answers.goal[0] || null,
        level: answers.level[0] || null,
        genre: answers.genre || [],
        is_kid_account: answers.forKids[0] === 'yes'
      };
      onComplete(finalAnswers);
    }
  };
  
  useEffect(() => {
    if (mainContentRef.current) {
        mainContentRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    } else if (currentStep === 0) {
      setDirection(-1);
      setCurrentStep(-1);
      setWelcomeMessageIndex(0);
      setShowStartButton(false);
    }
  };

  const progress = currentStep >= 0 ? ((currentStep + 1) / surveySteps.length) * 100 : 0;
  
  const selectedValue = stepData ? (answers[stepData.id] || []) : [];
  const isSelectionValid = selectedValue.length > 0;
  const isGenreLimitReached = stepData?.id === 'genre' && selectedValue.length >= stepData.maxSelection;

  const mascotSrc = useMemo(() => {
    if (currentStep === -1) {
        return allMascotUrls[0];
    }
    if (currentStep === surveySteps.length - 1 && isSelectionValid) {
        return allMascotUrls[3];
    }
    if (isSelectionValid && currentStep >= 0) {
      return allMascotUrls[2];
    }
    return stepData?.mascot || allMascotUrls[1];
  }, [currentStep, isSelectionValid, stepData]);

  const contentVariants = {
    enter: (direction) => ({
      y: direction > 0 ? '20px' : '-20px',
      opacity: 0,
      scale: 0.98
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      y: direction < 0 ? '20px' : '-20px',
      opacity: 0,
      scale: 0.98
    }),
  };
  
  const shakeVariants = {
    shake: {
      x: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.4 }
    }
  };

  if (!imagesLoaded) {
    return (
      <div className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (currentStep === -1) {
    return (
      <div className="fixed inset-0 bg-background z-[100] flex flex-col overflow-hidden">
        <div className="flex-1 w-full flex flex-col items-center justify-center px-4 sm:px-6">
          <div className="w-full max-w-md mx-auto flex flex-col items-center">
            
            <div 
              className="w-full h-28 flex items-center justify-center cursor-pointer mb-8"
              onClick={handleNextWelcomeMessage}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={welcomeMessageIndex}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="relative bg-card p-4 rounded-2xl border shadow-sm w-full"
                >
                  <p className="text-center text-base sm:text-lg font-medium text-card-foreground">
                    {welcomeMessages[welcomeMessageIndex]}
                  </p>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-card border-b border-r border-border rotate-45" />
                </motion.div>
              </AnimatePresence>
            </div>
            
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-48 h-48 sm:w-56 sm:h-56 relative"
            >
              <img
                src={mascotSrc}
                alt="Welcome Mascot"
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </motion.div>

            <AnimatePresence>
              {showStartButton && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
                  className="mt-8"
                >
                  <Button 
                    onClick={startSurvey}
                    size="lg"
                    className="h-14 px-8 text-base btn-duo"
                  >
                    Hadi Başlayalım
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleting) {
    return (
      <div className="fixed inset-0 bg-background z-[100] flex flex-col overflow-hidden">
        <div className="flex-1 w-full flex flex-col items-center justify-center px-4 sm:px-6">
          <div className="w-full max-w-md mx-auto flex flex-col items-center text-center">
            <motion.img
              src="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/96a9ef0496d4768b49c27ebe24e7161b.png"
              alt="Completing Mascot"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 15 }}
              className="h-32 w-32 sm:h-40 sm:w-40 mb-8 drop-shadow-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                Harika! 🎉
              </h2>
              <p className="text-lg text-muted-foreground">
                Seçimlerin ayarlanıyor...
              </p>
              <div className="flex justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col overflow-hidden">
        <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 flex-shrink-0">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={prevStep} className="transition-opacity">
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <Progress value={progress} className="h-3 flex-grow" />
                 <span className="text-sm font-bold text-muted-foreground w-12 text-center">{currentStep + 1}/{surveySteps.length}</span>
            </div>
        </header>

      <div ref={mainContentRef} className="flex-1 w-full flex flex-col overflow-y-auto custom-scrollbar px-4 sm:px-6 pt-4 pb-40">
        <div className="w-full flex-grow flex flex-col items-center">
          <div className="w-full max-w-2xl mx-auto flex justify-center mb-6">
            <motion.img
              key={mascotSrc}
              src={mascotSrc}
              alt="Mascot"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 15 }}
              className="h-28 w-28 sm:h-32 sm:w-32 drop-shadow-lg"
            />
          </div>

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
                key={currentStep}
                custom={direction}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-full flex flex-col flex-grow"
            >
                <div className="w-full max-w-2xl mx-auto mb-6">
                    <div className="relative bg-card p-4 rounded-xl border">
                        <h1 className="text-lg sm:text-xl font-bold text-center">{stepData.title}</h1>
                        {stepData.subtitle && <p className="text-muted-foreground text-sm sm:text-base mt-1 text-center">{stepData.subtitle}</p>}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-card border-t border-l border-border rotate-45" />
                    </div>
                </div>
                
                <motion.div 
                    variants={shakeVariants}
                    animate={limitReached ? "shake" : ""}
                    className={cn(
                    "grid gap-3 sm:gap-4 flex-grow",
                     stepData.id === 'level' ? "grid-cols-1 max-w-md mx-auto w-full" : "grid-cols-2",
                     stepData.id === 'goal' && "grid-cols-2 sm:grid-cols-3 max-w-2xl mx-auto w-full",
                     stepData.id === 'genre' && "grid-cols-2 md:grid-cols-3 max-w-2xl mx-auto w-full",
                     stepData.id === 'forKids' && "grid-cols-1 sm:grid-cols-2 max-w-md mx-auto w-full"
                )}>
                {stepData.options.map(option => {
                    const Icon = option.icon;
                    const isSelected = selectedValue.includes(option.value);
                    const isDisabled = !isSelected && isGenreLimitReached;
                    
                    const isLevelStep = stepData.id === 'level';

                    return (
                    <motion.button
                        key={option.value}
                        onClick={() => handleSelect(stepData.id, option.value)}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className={cn(
                           "w-full p-3 rounded-2xl border-2 text-center transition-all duration-200 relative font-medium text-sm sm:text-base",
                           isSelected
                            ? 'bg-primary/10 border-primary text-primary shadow-lg scale-105'
                            : 'bg-card border-border hover:border-primary/50 hover:shadow-md',
                           isDisabled && 'cursor-not-allowed opacity-60',
                           isDisabled && limitReached && 'border-destructive',
                           isLevelStep || stepData.id === 'forKids'
                            ? "flex items-center justify-start gap-4 h-16 sm:h-18"
                            : "flex flex-col items-center gap-2 min-h-[100px] justify-center sm:p-4"
                        )}
                        disabled={isDisabled}
                    >
                        {Icon && <Icon className={cn("h-6 w-6 sm:h-8 sm:w-8", isSelected ? 'text-primary' : 'text-muted-foreground')} />}
                        <span className={cn("leading-tight", isSelected ? 'text-primary' : 'text-card-foreground', (isLevelStep || stepData.id === 'forKids') && "flex-1 text-left")}>{option.label}</span>
                    </motion.button>
                    );
                })}
                </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 z-10 flex-shrink-0">
          <div
            className="bg-background/80 backdrop-blur-sm border-t border-border pb-[env(safe-area-inset-bottom)]"
            >
                <div className="w-full max-w-4xl mx-auto p-4 sm:p-5">
                        <Button 
                            onClick={nextStep} 
                            size="lg" 
                            disabled={!isSelectionValid}
                            className={cn(
                                "w-full h-14 text-base transition-all duration-300 btn-duo",
                            )}
                        >
                            {currentStep === surveySteps.length - 1 ? 'Bitir ve Başla' : 'Devam Et'}
                            {!isSelectionValid && <ArrowRight className="ml-2 h-5 w-5 opacity-0" />}
                            {isSelectionValid && <motion.span initial={{x: -5, opacity: 0}} animate={{x: 0, opacity: 1}}><ArrowRight className="ml-2 h-5 w-5" /></motion.span>}
                        </Button>
                </div>
            </div>
      </footer>
    </div>
  );
};

export default OnboardingSurvey;