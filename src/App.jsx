import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { AnimatePresence, motion } from 'framer-motion';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import SecurityHeaders from '@/components/SecurityHeaders';
import ContentSecurityLayer from '@/components/ContentSecurityLayer';
import { HelmetProvider } from 'react-helmet-async';
import { TooltipProvider } from '@/components/ui/tooltip';
import TopLoader from '@/components/TopLoader';
import AppLayout from '@/components/layout/AppLayout';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/customSupabaseClient';
import { storyKeys } from '@/lib/queryKeys';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Loader2 } from 'lucide-react';
import { CartProvider } from '@/hooks/useCart';

import HomePage from '@/pages/HomePage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import DashboardPage from '@/pages/DashboardPage.jsx';
import StoryPage from '@/pages/StoryPage.jsx';
import StoryDetailPage from '@/pages/StoryDetailPage.jsx';
import ActivitiesPage from '@/pages/ActivitiesPage.jsx';
import AdminPage from '@/pages/AdminPage.jsx';
import SubscriptionPage from '@/pages/SubscriptionPage.jsx';
import SubscriptionCallbackPage from '@/pages/SubscriptionCallbackPage.jsx';
import IyzicoCheckoutPage from '@/pages/IyzicoCheckoutPage.jsx';
import AboutPage from '@/pages/AboutPage.jsx';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage.jsx';
import SettingsPage from '@/pages/SettingsPage.jsx';
import QuizPage from '@/pages/QuizPage.jsx';
import QuizSetupPage from '@/pages/QuizSetupPage.jsx';
import LibraryPage from '@/pages/LibraryPage.jsx';
import HelpCenterPage from '@/pages/HelpCenterPage.jsx';
import ContactPage from '@/pages/ContactPage.jsx';
import CareerPage from '@/pages/CareerPage.jsx';
import TermsOfServicePage from '@/pages/TermsOfServicePage.jsx';
import BlogPage from '@/pages/BlogPage.jsx';
import BlogPostPage from '@/pages/BlogPostPage.jsx';
import CommunityPage from '@/pages/CommunityPage.jsx';
import CookiePolicyPage from '@/pages/CookiePolicyPage.jsx';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from '@/pages/ResetPasswordPage.jsx';
import AuthCallbackPage from '@/pages/AuthCallbackPage.jsx';
import LessonsPage from '@/pages/LessonsPage.jsx';
import SitemapPage from '@/pages/SitemapPage.jsx';
import CategoryPage from '@/pages/CategoryPage.jsx';
import OtpVerificationPage from '@/pages/OtpVerificationPage.jsx';
import FlashcardGamePage from '@/pages/FlashcardGamePage.jsx';
import MatchingGamePage from '@/pages/MatchingGamePage.jsx';
import WordleGamePage from '@/pages/WordleGamePage.jsx';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -10 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.2,
};

const MotionWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

const MobileRedirectGuard = ({ children }) => {
  const { user, initialized } = useAuth();
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const location = useLocation();

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isMobile) {
    if (location.pathname === '/') {
      return <Navigate to={user ? "/dashboard" : "/login"} replace />;
    }
    if (location.pathname === '/subscription') {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

const AppRoutes = () => {
  const location = useLocation();

  const appRoutes = [
    { path: "/dashboard", component: DashboardPage, requiredAuth: true },
    { path: "/read/:slug", component: StoryPage, requiredAuth: true },
    { path: "/story/:slug", component: StoryDetailPage, requiredAuth: true },
    { path: "/activities", component: ActivitiesPage, requiredAuth: true },
    { path: "/activities/flashcards", component: FlashcardGamePage, requiredAuth: true },
    { path: "/activities/matching-game", component: MatchingGamePage, requiredAuth: true },
    { path: "/wordle", component: WordleGamePage, requiredAuth: true },
    { path: "/quiz/setup", component: QuizSetupPage, requiredAuth: true },
    { path: "/quiz", component: QuizPage, requiredAuth: true },
    { path: "/library", component: LibraryPage, requiredAuth: true },
    { path: "/lessons", component: LessonsPage, requiredAuth: true },
    { path: "/subscription", component: SubscriptionPage, requiredAuth: true },
    { path: "/subscription/callback", component: SubscriptionCallbackPage, requiredAuth: true },
    { path: "/subscription/iyzico-checkout", component: IyzicoCheckoutPage, requiredAuth: true },
    { path: "/settings/*", component: SettingsPage, requiredAuth: true },
    { path: "/admin/*", component: AdminPage, requiredAuth: true, requiredRole: ["admin", "content_creator"] },
    { path: "/community", component: CommunityPage, requiredAuth: true },
    { path: "/category/:categoryName", component: CategoryPage, requiredAuth: true },
  ];

  const externalRoutes = [
    { path: "/", component: HomePage },
    { path: "/login", component: LoginPage },
    { path: "/register", component: LoginPage },
    { path: "/forgot-password", component: ForgotPasswordPage },
    { path: "/reset-password", component: ResetPasswordPage },
    { path: "/auth/callback", component: AuthCallbackPage },
    { path: "/verify-otp", component: OtpVerificationPage },
    { path: "/about", component: AboutPage },
    { path: "/privacy-policy", component: PrivacyPolicyPage },
    { path: "/terms-of-service", component: TermsOfServicePage },
    { path: "/help-center", component: HelpCenterPage },
    { path: "/contact", component: ContactPage },
    { path: "/career", component: CareerPage },
    { path: "/blog", component: BlogPage },
    { path: "/blog/:slug", component: BlogPostPage },
    { path: "/cookie-policy", component: CookiePolicyPage },
    { path: "/sitemap.xml", component: SitemapPage },
  ];
  
  const noLayoutRoutes = ['/read', '/story', '/quiz', '/quiz/setup', '/subscription/iyzico-checkout', '/sitemap.xml', '/activities/flashcards', '/activities/matching-game', '/wordle'];
  const routesWithLayout = appRoutes.filter(route => !noLayoutRoutes.some(path => route.path.startsWith(path)));
  const routesWithoutLayout = appRoutes.filter(route => noLayoutRoutes.some(path => route.path.startsWith(path)));

  return (
    <MobileRedirectGuard>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
            {routesWithoutLayout.map(({ path, component: Component, ...rest }) => (
              <Route key={path} path={path} element={
                <ProtectedRoute {...rest}>
                  <MotionWrapper><Component /></MotionWrapper>
                </ProtectedRoute>
              } />
            ))}

            <Route element={<AppLayout />}>
              {routesWithLayout.map(({ path, component: Component, ...rest }) => (
                <Route key={path} path={path} element={
                  <ProtectedRoute {...rest}>
                    <MotionWrapper><Component /></MotionWrapper>
                  </ProtectedRoute>
                } />
              ))}
            </Route>
          
          {externalRoutes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={path === '/sitemap.xml' ? <Component /> : <MotionWrapper><Component /></MotionWrapper>} />
          ))}
        </Routes>
      </AnimatePresence>
    </MobileRedirectGuard>
  );
};

const RealtimeSubscriptionManager = () => {
  const { user, initialized } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!initialized || !user) {
      return;
    }

    const channelIdentifier = `realtime:stories:${user.id}`;
    let channel = supabase.channel(channelIdentifier, {
      config: {
        broadcast: {
          self: true,
        },
      },
    });

    const handleDataChange = () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.dashboard(user.id) });
    };

    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_read_stories', filter: `user_id=eq.${user.id}` }, handleDataChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_saved_stories', filter: `user_id=eq.${user.id}` }, handleDataChange)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'stories' }, handleDataChange)
      .subscribe();
      
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user, initialized, queryClient]);

  return null;
};

function App() {
  useEffect(() => {
    if (window.location.protocol === 'http:') {
      window.location.href = 'https:' + window.location.href.substring(5);
    }
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <SecurityHeaders />
        <Router>
          <AuthProvider>
            <CartProvider>
              <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <TooltipProvider>
                  <ContentSecurityLayer>
                    <div className="min-h-screen bg-background font-sans antialiased overflow-x-hidden">
                      <RealtimeSubscriptionManager />
                      <AppRoutes />
                      <Toaster />
                    </div>
                  </ContentSecurityLayer>
                </TooltipProvider>
              </ThemeProvider>
            </CartProvider>
          </AuthProvider>
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;