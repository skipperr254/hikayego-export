import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { MailCheck, KeyRound, Loader2, ArrowLeft } from 'lucide-react';
import Seo from '@/components/Seo';

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const email = state?.email;
  const type = state?.type || 'signup'; // 'signup' or 'recovery'
  const fromLogin = state?.fromLogin || false;
  const inputRefs = useRef([]);

  const pageConfig = {
    signup: {
      title: "E-postanızı Doğrulayın",
      description: "kayıt işlemini tamamlamak için gönderilen 6 haneli kodu girin.",
      icon: <MailCheck className="w-8 h-8 text-primary" />,
      resendType: 'signup',
    },
    recovery: {
      title: "Şifrenizi Sıfırlayın",
      description: "şifrenizi sıfırlamak için gönderilen 6 haneli kodu girin.",
      icon: <KeyRound className="w-8 h-8 text-primary" />,
      resendType: 'recovery',
    }
  };

  const config = pageConfig[type];

  useEffect(() => {
    if (!email) {
      toast({
        title: "Hata",
        description: "Doğrulama için e-posta adresi bulunamadı. Lütfen işlemi tekrar başlatın.",
        variant: "destructive",
      });
      navigate(type === 'recovery' ? '/forgot-password' : '/register');
    } else if (!fromLogin) {
      toast({
        title: "Kod Gönderildi",
        description: `Doğrulama kodu ${email} adresine gönderildi. Lütfen gelen kutunuzu kontrol edin.`,
      });
    }
  }, [email, navigate, toast, type, fromLogin]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (element, index) => {
    const value = element.value;

    // Allow only numbers
    if (isNaN(value)) return false;

    const newOtp = [...otp];
    // Take only the last character if multiple are entered
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input if value is entered
    if (value !== "" && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    // Auto-submit when all 6 digits are filled
    if (newOtp.join("").length === 6) {
      handleSubmit(new Event('submit'), newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace to move to previous field
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    // Only accept numeric paste data
    if (!/^\d+$/.test(pastedData)) {
      toast({
        title: "Geçersiz Format",
        description: "Lütfen sadece sayılar içeren bir kod yapıştırın.",
        variant: "destructive",
      });
      return;
    }

    // Take first 6 digits
    const digits = pastedData.slice(0, 6).split('');
    const newOtp = [...otp];

    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });

    setOtp(newOtp);

    // Focus the next empty field or the last field
    const nextEmptyIndex = newOtp.findIndex(val => val === "");
    if (nextEmptyIndex !== -1 && inputRefs.current[nextEmptyIndex]) {
      inputRefs.current[nextEmptyIndex].focus();
    } else if (inputRefs.current[5]) {
      inputRefs.current[5].focus();
    }

    // Auto-submit if we have 6 digits
    if (newOtp.join("").length === 6) {
      handleSubmit(new Event('submit'), newOtp.join(""));
    }
  };

  const handleSubmit = async (e, otpValue) => {
    e.preventDefault();
    setLoading(true);
    const token = otpValue || otp.join("");

    if (token.length !== 6) {
      toast({
        title: "Geçersiz Kod",
        description: "Lütfen 6 haneli kodu eksiksiz girin.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: type === 'recovery' ? 'recovery' : 'signup',
      });

      if (error) {
        throw error;
      }

      if (type === 'signup') {
        toast({
          title: "Doğrulama Başarılı!",
          description: "Hesabınız başarıyla doğrulandı. Yönlendiriliyorsunuz...",
        });
        if (data.session) {
          await supabase.auth.setSession(data.session);
        }
        navigate('/dashboard');
      } else if (type === 'recovery') {
        toast({
          title: "Kod Doğrulandı!",
          description: "Şimdi yeni şifrenizi oluşturabilirsiniz.",
        });
        navigate('/reset-password');
      }

    } catch (error) {
      toast({
        title: "Doğrulama Başarısız",
        description: error.message === 'Token has expired or is invalid' ? 'Kodun süresi dolmuş veya geçersiz. Lütfen yeni bir kod isteyin.' : 'Bir hata oluştu. Lütfen tekrar deneyin.',
        variant: "destructive",
      });
      setOtp(new Array(6).fill(""));
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resending) return;

    if (countdown > 0) {
      toast({
        title: "Lütfen Bekleyin",
        description: `Yeni bir kod istemek için ${countdown} saniye daha beklemelisiniz.`,
        variant: "destructive",
      });
      return;
    }

    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: config.resendType,
        email: email,
      });
      if (error) throw error;
      toast({
        title: "Kod Gönderildi",
        description: "Yeni doğrulama kodu e-posta adresinize gönderildi.",
      });
      setCountdown(60);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Kod gönderilemedi. Lütfen daha sonra tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <Seo title={config.title} description={`Hesabınızı doğrulamak için e-postanıza gönderilen kodu girin.`} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md mx-auto shadow-2xl shadow-black/10 dark:shadow-black/30 rounded-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
                  className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  {config.icon}
                </motion.div>
              </div>
              <CardTitle className="text-2xl font-bold">{config.title}</CardTitle>
              <CardDescription>
                <strong className="text-primary">{email}</strong> adresine, {config.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((data, index) => {
                    return (
                      <Input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength="1"
                        className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-bold border-2 focus:border-primary focus:ring-primary transition-all"
                        value={data}
                        onChange={e => handleChange(e.target, index)}
                        onKeyDown={e => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        onFocus={e => e.target.select()}
                        ref={el => (inputRefs.current[index] = el)}
                        disabled={loading}
                        autoComplete="one-time-code"
                      />
                    );
                  })}
                </div>
                <Button type="submit" className="w-full" disabled={loading || otp.join("").length < 6}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Doğrula
                </Button>
              </form>
              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">
                  Kodu almadınız mı?{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-semibold"
                    onClick={handleResendOtp}
                    disabled={resending || countdown > 0}
                  >
                    {resending ? <Loader2 className="inline w-4 h-4 mr-1 animate-spin" /> : null}
                    {countdown > 0 ? `${countdown} saniye sonra tekrar dene` : 'Yeniden gönder'}
                  </Button>
                </p>
              </div>
              <div className="mt-4 text-center">
                <Button variant="ghost" asChild className="text-sm text-muted-foreground">
                  <Link to="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Giriş ekranına dön
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default OtpVerificationPage;