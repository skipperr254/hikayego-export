import React, { useState, useEffect } from 'react';
import Seo from '@/components/Seo';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import AuthToggle from '@/components/auth/AuthToggle';
import AuthForm from '@/components/auth/AuthForm';
import AuthHeader from '@/components/auth/AuthHeader';
import TestimonialSlider from '@/components/auth/TestimonialSlider';
import { supabase } from '@/lib/customSupabaseClient';
import { testimonials as staticTestimonials } from '@/data/testimonials.js';
import { handleLoginError, handleRegistrationError } from '@/utils/authUtils';
import { ToastAction } from "@/components/ui/toast";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [slides, setSlides] = useState([]);
  const [slidesLoading, setSlidesLoading] = useState(true);
  const [resending, setResending] = useState(false);

  const { login, register, user, initialized } = useAuth();
  const { toast } = useToast();
  
  const { errors, setErrors, validateAllFields, submitted, setSubmitted } = useFormValidation(formData, acceptTerms, isLogin);
  const { emailWarning, checkEmailAvailability } = useEmailValidation();

  useEffect(() => {
    const fetchSlides = async () => {
      setSlidesLoading(true);
      const { data, error } = await supabase
        .from('auth_slide_images')
        .select('title, subtitle, image_url, gradient_colors, avatar_url, user_title, rating')
        .order('id', { ascending: true });

      if (error || !data || data.length === 0) {
        if (error) {
            console.error('Error fetching auth slides, using fallback:', error);
        }
        const formattedStaticData = staticTestimonials.map((t, index) => ({
            title: t.name,
            subtitle: t.quote,
            image_url: `https://source.unsplash.com/random/800x1200?futuristic,abstract&sig=${t.id}`,
            gradient_colors: 'from-black/80 via-black/50 to-transparent',
            avatar_url: t.avatar,
            user_title: t.title,
            rating: 5,
            duration: 7000 + (index * 1000),
        }));
        setSlides(formattedStaticData);
      } else {
         const formattedData = data.map((item, index) => ({
            ...item,
            rating: item.rating || 5,
            duration: 7000 + (index * 1000),
        }));
        setSlides(formattedData);
      }
      setSlidesLoading(false);
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (initialized && user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, initialized, navigate, location.state]);

  useEffect(() => {
    setIsLogin(location.pathname === '/login');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setAcceptTerms(false);
    setSubmitted(false);
    setErrors({});
  }, [location.pathname, setSubmitted, setErrors]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'email' && value.includes('@') && !isLogin) {
      checkEmailAvailability(value);
    }
  };

  const handleGoToVerification = async (email) => {
    if (resending) return;
    setResending(true);
    toast({
      title: "Yeni Kod Gönderiliyor",
      description: "E-posta adresinize yeni bir doğrulama kodu gönderiyoruz...",
    });
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      if (error) throw error;
      navigate('/verify-otp', { state: { email: email, type: 'signup', fromLogin: true } });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Doğrulama e-postası gönderilemedi. Lütfen daha sonra tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    const isValid = validateAllFields();

    if (!isValid) {
      const firstErrorKey = Object.keys(errors)[0];
      const message = errors[firstErrorKey] || (isLogin ? "Lütfen tüm alanları doldurun." : "Lütfen tüm gerekli alanları doldurun ve şartları kabul edin.");
      toast({
        title: "Form eksik",
        description: message,
        variant: "destructive"
      });
      return;
    }

    if (!isLogin && !acceptTerms) {
      toast({
        title: "Şartlar ve Koşullar",
        description: "Kayıt olmak için Kullanım Koşulları ve Gizlilik Politikasını kabul etmelisiniz.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast({ title: "Giriş başarılı!", description: "Tekrar hoş geldiniz!" });
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        await register(formData.name, formData.email, formData.password);
        toast({
          title: "Kayıt Başarılı!",
          description: "Doğrulama kodu e-posta adresinize gönderildi.",
        });
        navigate('/verify-otp', { state: { email: formData.email, type: 'signup' } });
      }
    } catch (error) {
      const errorDetails = isLogin ? handleLoginError(error) : handleRegistrationError(error);
      
      const toastProps = {
        title: isLogin ? "Giriş başarısız" : "Kayıt başarısız",
        description: errorDetails.message || errorDetails,
        variant: "destructive",
      };

      if (isLogin && errorDetails.type === 'email_not_confirmed') {
        toastProps.action = (
          <ToastAction altText="Hesabı Doğrula" onClick={() => handleGoToVerification(formData.email)}>
            Hesabı Doğrula
          </ToastAction>
        );
      }

      toast(toastProps);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (loginMode) => {
    if (isLogin === loginMode) return;
    setIsLogin(loginMode);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setAcceptTerms(false);
    setSubmitted(false);
    setErrors({});
  };

  if (initialized && user) return null;

  return (
    <>
      <Seo
        title={isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
        description={isLogin ? 'HikayeGO hesabınıza giriş yapın ve İngilizce öğrenme maceranıza devam edin.' : 'HikayeGO\'ya ücretsiz kaydolun ve hikayelerle İngilizce öğrenmeye başlayın.'}
        url={isLogin ? '/login' : '/register'}
        keywords="İngilizce giriş, İngilizce kayıt, dil öğrenme hesabı"
      />
      <div className="h-screen w-full flex bg-background overflow-hidden">
        <div className="w-full lg:w-1/2 flex flex-col p-4 sm:p-6 md:p-8 relative overflow-y-auto overflow-x-hidden custom-scrollbar">
          <motion.div 
            className="absolute -top-20 -left-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute -bottom-20 -right-20 w-48 h-48 bg-green-400/10 rounded-full blur-3xl pointer-events-none"
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          
          <main className="w-full max-w-md z-10 m-auto flex-grow flex flex-col justify-center py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/30 dark:border-gray-700/30 shadow-2xl shadow-black/10 dark:shadow-black/30 rounded-2xl">
                <CardContent className="p-6">
                  <>
                    <AuthHeader isLogin={isLogin} />
                    <div className="space-y-4">
                      <AuthToggle isLogin={isLogin} onToggle={handleToggle} />
                      <AuthForm
                        isLogin={isLogin}
                        formData={formData}
                        onInputChange={handleInputChange}
                        acceptTerms={acceptTerms}
                        setAcceptTerms={setAcceptTerms}
                        rememberMe={rememberMe}
                        setRememberMe={setRememberMe}
                        loading={loading}
                        onSubmit={handleSubmit}
                        errors={errors}
                        emailWarning={emailWarning}
                        submitted={submitted}
                      />
                    </div>
                  </>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
        <aside className="hidden lg:flex lg:w-1/2 h-full relative overflow-hidden border-l border-border/50">
          <TestimonialSlider slides={slides} loading={slidesLoading} />
        </aside>
      </div>
    </>
  );
};

export default LoginPage;