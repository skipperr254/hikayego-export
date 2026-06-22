import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Star, Languages, Volume2, Bookmark, Bot, Sparkles, BarChart, LifeBuoy, Info, Loader2, BookOpenCheck, ListPlus, Video, Check, Zap, CalendarCheck } from 'lucide-react';
import AnimatedBackground from '@/components/subscription/AnimatedBackground';
import Seo from '@/components/Seo';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import TrustBadges from '@/components/subscription/TrustBadges';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import IyzicoForm from '@/components/subscription/IyzicoForm';

const PACKAGES = [
  {
    id: '1_month',
    months: 1,
    label: '1 Aylık',
    price: '₺149',
    perMonth: '₺149/ay',
    badge: null,
    description: 'Esnek, taahhütsüz',
  },
  {
    id: '3_months',
    months: 3,
    label: '3 Aylık',
    price: '₺249',
    perMonth: '₺83/ay',
    badge: null,
    savings: '%44 tasarruf',
    description: 'Başlangıç için ideal',
  },
  {
    id: '6_months',
    months: 6,
    label: '6 Aylık',
    price: '₺399',
    perMonth: '₺66/ay',
    badge: 'En Popüler',
    savings: '%56 tasarruf',
    description: 'Çoğunlukla tercih edilen',
  },
  {
    id: '12_months',
    months: 12,
    label: '12 Aylık',
    price: '₺699',
    perMonth: '₺58/ay',
    badge: 'En Avantajlı',
    savings: '%61 tasarruf',
    description: 'Tam yıl boyunca öğren',
  },
];

const SubscriptionPage = () => {
  const { canAccessPremiumFeatures, loading: authLoading, user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(PACKAGES[2]);

  const premiumExpiresAt = user?.premium_expires_at ? new Date(user.premium_expires_at) : null;

  const features = [
    { icon: BookOpenCheck, text: 'Tüm seviyelerde sınırsız hikaye erişimi' },
    { icon: Video, text: "A1'den C1'e tüm video dersler ve konu anlatımları" },
    { icon: Bot, text: 'Gelişmiş kelime asistanı (örnek cümle, eş/zıt anlam)' },
    { icon: Volume2, text: 'Hikayeleri sesli dinleyerek telaffuzunu geliştir' },
    { icon: ListPlus, text: 'Kişisel kelime listesi oluşturma' },
    { icon: Bookmark, text: 'Kaldığın yeri kaydet, öğrenmeye ara verme' },
    { icon: Languages, text: 'Anında çeviri ile anlamadığın kelime kalmasın' },
    { icon: Shield, text: 'Reklamsız ve kesintisiz bir öğrenme deneyimi' },
    { icon: Sparkles, text: 'Yeni içeriklere ve özelliklere herkesten önce eriş' },
    { icon: BarChart, text: 'Detaylı ilerleme takibi ve kişisel raporlar' },
    { icon: LifeBuoy, text: 'Öncelikli müşteri desteği' },
  ];

  const pageVariants = { initial: { opacity: 0 }, in: { opacity: 1 }, out: { opacity: 0 } };
  const cardVariants = { initial: { opacity: 0, y: 30 }, in: { opacity: 1, y: 0 } };

  if (authLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <>
      <Seo
        title="Premium Üyelik"
        description="HikayeGO Premium'a geçerek tüm özelliklerin kilidini açın. Banka kartı ile ödeme desteklenir."
        url="/subscription"
        keywords="İngilizce premium, dil öğrenme paketi, İngilizce kursu, online İngilizce"
      />

      <div className="relative min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 overflow-hidden">
        <AnimatedBackground />

        {canAccessPremiumFeatures && premiumExpiresAt && (
          <div className="relative z-10 container mx-auto max-w-3xl px-4 pt-8">
            <div className="flex items-start gap-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm">
              <CalendarCheck className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 dark:text-amber-200">
                <span className="font-semibold">Premium üyeliğin aktif</span> —{' '}
                {premiumExpiresAt.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })} tarihine kadar geçerli.
                Yeni bir paket satın alarak bu süreye ekleyebilirsin.
              </p>
            </div>
          </div>
        )}

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
              Dil Öğreniminde{' '}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Sınırları Kaldır
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Bir paket seç, öde ve hemen başla. Kredi kartı veya banka kartı ile güvenli ödeme.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Feature list */}
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

            {/* Package selection + CTA */}
            <motion.div
              variants={cardVariants}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="order-1 lg:order-2 space-y-4"
            >
              {/* Package cards */}
              {PACKAGES.map((pkg) => {
                const isSelected = selectedPackage.id === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`w-full text-left rounded-xl border-2 p-4 transition-all duration-200 relative ${
                      isSelected
                        ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-primary/50'
                    }`}
                  >
                    {pkg.badge && (
                      <span className={`absolute -top-2.5 left-4 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        pkg.id === '12_months'
                          ? 'bg-amber-500 text-white'
                          : 'bg-primary text-white'
                      }`}>
                        {pkg.badge}
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-primary bg-primary' : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{pkg.label} Premium</p>
                          <p className="text-xs text-muted-foreground">{pkg.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-extrabold text-slate-900 dark:text-white">{pkg.price}</p>
                        <p className="text-xs text-muted-foreground">{pkg.perMonth}</p>
                        {pkg.savings && (
                          <p className="text-xs font-medium text-green-600 dark:text-green-400">{pkg.savings}</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* CTA card */}
              <Card className="bg-white dark:bg-slate-800/80 shadow-xl border-2 border-primary/40 backdrop-blur-sm">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Seçilen paket:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {selectedPackage.label} — {selectedPackage.price}
                    </span>
                  </div>

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full text-base sm:text-lg cta-glow-button py-5 sm:py-6" size="lg">
                        <Zap className="w-5 h-5 mr-2" />
                        Güvenli Ödeme Yap
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Fatura Bilgileri</DialogTitle>
                        <DialogDescription>
                          {selectedPackage.label} Premium — {selectedPackage.price}
                        </DialogDescription>
                      </DialogHeader>
                      <IyzicoForm selectedPackage={selectedPackage} onSuccess={() => setIsDialogOpen(false)} />
                    </DialogContent>
                  </Dialog>

                  <p className="text-xs text-muted-foreground text-center">
                    Tek seferlik ödeme. Otomatik yenileme yok.
                  </p>

                  <TrustBadges />

                  <div className="text-center text-xs text-muted-foreground p-3 bg-secondary/50 rounded-lg flex items-start space-x-2">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                    <span>
                      Paket süren dolduğunda erişimin sona erer. Devam etmek istersen yeni bir paket satın alabilirsin.
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
