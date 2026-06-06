import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import HeroSection from '@/components/home/HeroSection';
import Seo from '@/components/Seo';
import { Skeleton } from '@/components/ui/skeleton';

const WhyHikayeGOSection = React.lazy(() => import('@/components/home/WhyHikayeGOSection'));
const HowItWorksSection = React.lazy(() => import('@/components/home/HowItWorksSection'));
const MobileDownloadSection = React.lazy(() => import('@/components/home/MobileDownloadSection'));
const PremiumPlanSection = React.lazy(() => import('@/components/home/PremiumPlanSection'));
const RecommendedBlogs = React.lazy(() => import('@/components/home/RecommendedBlogs'));

const SectionSkeleton = () => (
  <div className="container mx-auto px-4 py-20 sm:py-24">
    <Skeleton className="h-12 w-1/2 mx-auto mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Skeleton className="h-80 rounded-2xl" />
      <Skeleton className="h-80 rounded-2xl" />
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  </div>
);

const HomePage = () => {
  const { canAccessPremiumFeatures } = useAuth();

  const preloadImages = [
    'https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/47f710aa80676b1d20d4c237d6675a23.png'
  ];

  return (
    <>
      <Seo
        title="İngilizce Öğrenmenin En Keyifli Yolu"
        description="Hikayelerle İngilizce öğrenin. Her seviyeye uygun sürükleyici hikayeler, akıllı kelime asistanı ve etkileşimli etkinliklerle dil becerilerinizi geliştirin."
        url="/"
        keywords="İngilizce öğren, İngilizce hikayeler, dil öğrenimi, kelime öğrenme, İngilizce pratik"
      >
        {preloadImages.map((src, index) => (
          <link key={index} rel="preload" as="image" href={src} />
        ))}
      </Seo>
      <div className="flex flex-col min-h-screen bg-white dark:bg-background">
        <Navbar />
        <main className="flex-grow">
          <HeroSection />
          <Suspense fallback={<SectionSkeleton />}>
            <WhyHikayeGOSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <HowItWorksSection />
          </Suspense>
          
          <Suspense fallback={<div className="h-64" />}>
            <MobileDownloadSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <RecommendedBlogs />
          </Suspense>
          {!canAccessPremiumFeatures && (
            <Suspense fallback={<SectionSkeleton />}>
              <PremiumPlanSection />
            </Suspense>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;