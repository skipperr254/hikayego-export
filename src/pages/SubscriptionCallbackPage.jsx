import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Seo from '@/components/Seo';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const SubscriptionCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUserProfile } = useAuth();

  const query = new URLSearchParams(location.search);
  const status = query.get('status') || 'processing';

  React.useEffect(() => {
    if (status === 'success') {
      toast({
        title: 'Ödeme Başarılı! 🎉',
        description: 'HikayeGO Premium dünyasına hoş geldiniz!',
        duration: 5000,
      });
      refreshUserProfile();
      setTimeout(() => navigate('/dashboard'), 3000);
    } else if (status === 'error') {
      toast({
        variant: 'destructive',
        title: 'Ödeme Başarısız',
        description: 'Ödeme sırasında bir sorun oluştu. Lütfen tekrar deneyin.',
        duration: 5000,
      });
    }
  }, [status, toast, navigate, refreshUserProfile]);

  const renderStatus = () => {
    switch (status) {
      case 'processing':
        return (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
            <h1 className="text-3xl font-bold">İşleniyor...</h1>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
            <h1 className="text-3xl font-bold text-green-500">Ödeme Başarılı!</h1>
          </>
        );
      case 'error':
        return (
          <>
            <XCircle className="h-16 w-16 text-destructive mb-6" />
            <h1 className="text-3xl font-bold text-destructive">Ödeme Başarısız</h1>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Seo title="Ödeme Sonucu" description="Ödeme sonucunuz işleniyor." noindex />
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
        <div className="max-w-md w-full">
          {renderStatus()}
          {status !== 'processing' && (
            <Button onClick={() => navigate('/dashboard')} className="mt-8">
              Anasayfaya Dön
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default SubscriptionCallbackPage;