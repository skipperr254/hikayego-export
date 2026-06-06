import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Star, Languages, Volume2, Bookmark, Bot, Sparkles, BarChart, LifeBuoy, Info, Loader2, BookOpenCheck, ListPlus, Video } from 'lucide-react';
import AnimatedBackground from '@/components/subscription/AnimatedBackground';
import Seo from '@/components/Seo';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import TrustBadges from '@/components/subscription/TrustBadges';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import IyzicoForm from '@/components/subscription/IyzicoForm';

const SubscriptionPage = () => {
  const { canAccessPremiumFeatures, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && canAccessPremiumFeatures) {
      navigate('/dashboard');
    }
  }, [canAccessPremiumFeatures, authLoading, navigate]);

  const features = [
    { icon: BookOpenCheck, text: "Tüm seviyelerde sınırsız hikaye erişimi" },
    { icon: Video, text: "A1'den C1'e tüm video dersler ve konu anlatımları" },
    { icon: Bot, text: "Gelişmiş kelime asistanı (örnek cümle, eş/zıt anlam)" },
    { icon: Volume2, text: "Hikayeleri sesli dinleyerek telaffuzunu geliştir" },
    { icon: ListPlus, text: "Kişisel kelime listesi oluşturma" },
    { icon: Bookmark, text: "Kaldığın yeri kaydet, öğrenmeye ara verme" },
    { icon: Languages, text: "Anında çeviri ile anlamadığın kelime kalmasın" },
    { icon: Shield, text: "Reklamsız ve kesintisiz bir öğrenme deneyimi" },
    { icon: Sparkles, text: "Yeni içeriklere ve özelliklere herkesten önce eriş" },
    { icon: BarChart, text: "Detaylı ilerleme takibi ve kişisel raporlar" },
    { icon: LifeBuoy, text: "Öncelikli müşteri desteği" },
  ];

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    in: { opacity: 1, y: 0 },
  };

  if (authLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (canAccessPremiumFeatures) {
    return null;
  }

  return (
    <>
      <Seo
        title="Premium Abonelik"
        description="HikayeGO Premium'a abone olarak tüm özelliklerin kilidini açın. Sınırsız hikaye, sesli okuma, kelime asistanı ve daha fazlası sizi bekliyor."
        url="/subscription"
        keywords="İngilizce premium, dil öğrenme aboneliği, İngilizce kursu, online İngilizce"
      />

      <div className="relative min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 overflow-hidden">
        <AnimatedBackground />
        
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={{ duration: 0.5 }}
          className="relative container mx-auto max-w-7xl py-12 px-4 sm:py-16 sm:px-6 lg:px-8"
        >
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-12 p-4 sm:p-6 md:p-8 glass-box"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Dil Öğreniminde <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">Sınırları Kaldır</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Premium'a geçerek tüm özelliklerin kilidini açın. Güvenli ödeme altyapısıyla hemen başlayın.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <motion.div
              variants={cardVariants}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="order-2 lg:order-1"
            >
              <Card className="bg-white/80 dark:bg-slate-800/50 shadow-lg border border-slate-200 dark:border-slate-700/50 h-full backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Premium İle Gelenler</CardTitle>
                  <CardDescription>Tüm bu özellikler ve daha fazlası sizi bekliyor.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    {features.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <li key={index} className="flex items-start space-x-3">
                          <Icon className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                          <span className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">{feature.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={cardVariants}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="order-1 lg:order-2"
            >
              <Card className="relative bg-white dark:bg-slate-800/80 shadow-2xl border-2 border-primary/50 backdrop-blur-sm">
                <div className="absolute top-0 right-0 -mt-3 -mr-3">
                  <div className="flex items-center text-sm font-semibold bg-gradient-to-r from-primary to-purple-600 text-white py-2 px-4 rounded-full shadow-lg">
                    <Star className="w-4 h-4 mr-1.5 fill-white" />
                    En Popüler Seçim
                  </div>
                </div>
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Premium Plan</CardTitle>
                  <CardDescription className="text-base">Tüm özellikler tek pakette.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center my-4 sm:my-6">
                    <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
                      ₺149,99
                    </span>
                    <span className="text-base sm:text-lg font-medium text-muted-foreground">/ay</span>
                  </div>
                  
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full text-base sm:text-lg cta-glow-button py-5 sm:py-6" size="lg">
                        Güvenli Ödeme Yap
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Fatura Bilgileri</DialogTitle>
                        <DialogDescription>
                          Lütfen ödeme için fatura bilgilerinizi girin.
                        </DialogDescription>
                      </DialogHeader>
                      <IyzicoForm />
                    </DialogContent>
                  </Dialog>

                  <p className="text-xs text-muted-foreground text-center pt-2">
                    Taahhüt yok, istediğiniz zaman iptal edebilirsiniz.
                  </p>

                  <TrustBadges />

                  <div className="mt-6 text-center text-xs text-muted-foreground p-3 bg-secondary/50 rounded-lg flex items-start space-x-2">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                    <span>
                      İstediğin zaman iptal edebilirsin. İptal ettiğinde, mevcut fatura döneminin sonuna kadar tüm premium özelliklerden yararlanmaya devam edersin.
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.main>
      </div>
    </>
  );
};

export default SubscriptionPage;