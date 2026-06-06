import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import Seo from '@/components/Seo';

const AuthCallbackPage = () => {
    const navigate = useNavigate();
    const { user, initialized } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        if (!initialized) return;

        if (user) {
            console.log('User found on callback, redirecting to dashboard.');
            toast({
                title: 'Giriş Başarılı!',
                description: 'Tekrar hoş geldiniz!',
            });
            navigate('/dashboard', { replace: true });
        } else {
            console.log('No user found on callback, redirecting to login.');
            toast({
                title: 'Oturum Açılamadı',
                description: 'Giriş yapılırken bir sorun oluştu. Lütfen tekrar deneyin.',
                variant: 'destructive',
            });
            navigate('/login', { replace: true });
        }
    }, [user, initialized, navigate, toast]);

    return (
        <>
            <Seo
                title="Yönlendiriliyor..."
                description="Kimlik doğrulama işlemi tamamlanıyor."
                noIndex={true}
            />
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Oturumunuz doğrulanıyor, lütfen bekleyin...</p>
                </div>
            </div>
        </>
    );
};

export default AuthCallbackPage;