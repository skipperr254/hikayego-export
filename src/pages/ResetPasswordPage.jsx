import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/customSupabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Seo from "@/components/Seo";
import { handlePasswordResetError } from "@/utils/authUtils";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsRecoveryMode(true);
      }
      setCheckingSession(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecoveryMode(true);
        setCheckingSession(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      const msg = "Şifreler eşleşmiyor.";
      setError(msg);
      toast({ title: "Hata", description: msg, variant: "destructive" });
      return;
    }

    if (password.length < 8) {
      const msg = "Şifre en az 8 karakter olmalıdır.";
      setError(msg);
      toast({ title: "Hata", description: msg, variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) throw updateError;

      toast({
        title: "Başarılı!",
        description: "Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz.",
      });
      
      await supabase.auth.signOut();
      navigate("/login");

    } catch (err) {
      const friendlyError = handlePasswordResetError(err);
      setError(friendlyError);
      toast({
        title: "Hata",
        description: friendlyError,
        variant: "destructive",
      });
      if (friendlyError.includes("geçersiz") || friendlyError.includes("süresi dolmuş")) {
        setTimeout(() => navigate("/forgot-password"), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (checkingSession) {
      return (
        <div className='flex flex-col justify-center items-center p-8 space-y-4'>
          <Loader2 className='h-8 w-8 animate-spin' />
          <p className='text-sm text-muted-foreground'>Oturum kontrol ediliyor...</p>
        </div>
      );
    }

    if (!isRecoveryMode) {
      return (
        <div className='text-center p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700'>
          <AlertCircle className='mx-auto h-12 w-12 text-yellow-600 mb-4' />
          <h3 className='text-xl font-semibold'>Geçersiz İstek</h3>
          <p className='text-muted-foreground mt-2'>
            Bu sayfaya erişmek için geçerli bir şifre sıfırlama işlemi başlatmanız gerekmektedir.
          </p>
          <Button onClick={() => navigate("/forgot-password")} className='w-full mt-4'>
            Şifremi Unuttum Sayfasına Git
          </Button>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='password'>Yeni Şifre</Label>
          <div className='relative group'>
            <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
            <Input
              id='password'
              type={showPassword ? "text" : "password"}
              placeholder='En az 8 karakter'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className='pl-10 pr-10 h-10 text-sm'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors'
            >
              {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
            </button>
          </div>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='confirmPassword'>Yeni Şifre Tekrar</Label>
          <div className='relative group'>
            <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
            <Input
              id='confirmPassword'
              type={showConfirmPassword ? "text" : "password"}
              placeholder='Şifrenizi tekrar girin'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className='pl-10 pr-10 h-10 text-sm'
            />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors'
            >
              {showConfirmPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
            </button>
          </div>
        </div>
        {error && (
          <p className='text-xs text-destructive flex items-center'>
            <AlertCircle className='h-3 w-3 mr-1' />
            {error}
          </p>
        )}
        <Button type='submit' className='w-full' disabled={loading}>
          {loading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Güncelleniyor...
            </>
          ) : (
            "Şifreyi Güncelle"
          )}
        </Button>
      </form>
    );
  };

  return (
    <>
      <Seo
        title='Yeni Şifre Belirle'
        description='HikayeGO hesabınız için yeni bir şifre oluşturun.'
        url='/reset-password'
        keywords='yeni şifre, şifre güncelleme, hesap güvenliği'
      />
      <div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-secondary/20 relative'>
        <div className='absolute top-4 right-4'>
          <ThemeToggle />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full max-w-md z-10'
        >
          <Card className='backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 dark:border-gray-700/20 shadow-2xl'>
            <CardHeader className='text-center'>
              <CardTitle className='text-2xl md:text-3xl font-bold'>
                Yeni Şifre Belirle
              </CardTitle>
              <CardDescription className='text-base'>
                Hesabınız için yeni bir şifre oluşturun.
              </CardDescription>
            </CardHeader>
            <CardContent>{renderContent()}</CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default ResetPasswordPage;