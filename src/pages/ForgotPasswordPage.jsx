import React, { useState, useRef, useCallback } from 'react';
import Seo from '@/components/Seo';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import DOMPurify from 'dompurify';
import { handlePasswordResetError } from '@/utils/authUtils';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isSubmitting = useRef(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (isSubmitting.current) return;

    const sanitizedEmail = DOMPurify.sanitize(email.trim().toLowerCase());
    
    if (!sanitizedEmail) {
      toast({
        title: "Eksik bilgi",
        description: "Lütfen e-posta adresinizi girin.",
        variant: "destructive"
      });
      return;
    }

    isSubmitting.current = true;
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: `${window.location.origin}/reset-password`, // This is required but we will use OTP
      });

      if (error) {
        const friendlyError = handlePasswordResetError(error);
        toast({
          title: "Hata",
          description: friendlyError,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Kod Gönderildi!",
          description: "Şifre sıfırlama kodu e-posta adresinize gönderildi.",
        });
        navigate('/verify-otp', { state: { email: sanitizedEmail, type: 'recovery' } });
      }
      
    } catch (error) {
      console.error('Unhandled password reset request error:', error);
      const friendlyError = handlePasswordResetError(error);
       toast({
        title: "Hata",
        description: friendlyError,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  }, [email, toast, navigate]);

  return (
    <>
      <Seo
        title="Şifremi Unuttum"
        description="HikayeGO hesap şifrenizi sıfırlayın. E-posta adresinize bir sıfırlama kodu gönderelim."
        url="/forgot-password"
        keywords="şifre sıfırlama, şifremi unuttum, hesap kurtarma"
      />
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-secondary/20 relative">
        <div className="absolute top-4 right-4">
            <ThemeToggle />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md z-10"
        >
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 dark:border-gray-700/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl font-bold">Şifrenizi mi Unuttunuz?</CardTitle>
              <CardDescription className="text-base">
                Endişelenmeyin! Şifrenizi sıfırlamak için e-posta adresinizi girin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta Adresi</Label>
                  <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                          id="email"
                          type="email"
                          placeholder="ornek@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                          className="pl-10 h-10 text-sm"
                      />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    'Doğrulama Kodu Gönder'
                  )}
                </Button>
              </form>
               <div className="mt-6 text-center text-sm">
                <Link to="/login" className="font-medium text-primary hover:underline inline-flex items-center">
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Giriş ekranına geri dön
                </Link>
                </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;