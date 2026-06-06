import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Eye, EyeOff, Loader2, AlertTriangle, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

const DeleteAccountDialog = () => {
  const { user, reauthenticate, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    setStep(1);
    setPassword('');
    setPasswordVerified(false);
    setShowPassword(false);
  };

  const handleVerifyPassword = async () => {
    if (!password) {
      toast({
        title: "Şifre gerekli",
        description: "Lütfen şifrenizi girin.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await reauthenticate(password);
      if (error) {
        toast({
          title: "Yanlış şifre",
          description: "Girdiğiniz şifre hatalı. Lütfen tekrar deneyin.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      setPasswordVerified(true);
      setStep(2);
      toast({
        title: "Şifre doğrulandı",
        description: "Hesabınızı silmek için devam edebilirsiniz."
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Şifre doğrulanırken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!passwordVerified) {
      toast({
        title: "Şifre doğrulanmadı",
        description: "Önce şifrenizi doğrulamanız gerekiyor.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('delete_user_by_id', {
        user_id_to_delete: user.id
      });

      if (error) throw error;

      if (data && data.success === false) {
        toast({
          title: "Hesap silinemedi",
          description: data.message || "Hesap silinirken bir hata oluştu.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Hesap silindi",
        description: "Hesabınız başarıyla silindi. Yönlendiriliyorsunuz..."
      });

      await logout();
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Hesap silinirken beklenmedik bir hata oluştu.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <Trash2 className="mr-2 h-4 w-4" />
          Hesabı Sil
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {step === 1 ? 'Hesabınızı Silmek İstediğinize Emin misiniz?' : 'Son Onay'}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            {step === 1 ? (
              <>
                <p>Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak silinecektir:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Tüm kayıtlı hikayeler</li>
                  <li>Kelime listeleri ve kategoriler</li>
                  <li>Ders notları ve ilerleme kayıtları</li>
                  <li>Profil bilgileri</li>
                </ul>
                <p className="mt-4">Devam etmek için lütfen şifrenizi girin:</p>
              </>
            ) : (
              <p>Hesabınız silinmek üzere. Bu işlem geri alınamaz. Devam etmek istediğinize emin misiniz?</p>
            )}
            <p className="text-sm mt-4 text-muted-foreground flex flex-wrap gap-1 items-center">
              Yardıma ihtiyacınız varsa bizimle iletişime geçin:
              <span className="font-medium inline-flex items-center gap-1 text-primary">
                <Mail className="h-3 w-3" />
                contact@hikayego.com
              </span>
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {step === 1 && (
          <div className="space-y-2 py-4">
            <Label htmlFor="delete-password">Şifre</Label>
            <div className="relative">
              <Input
                id="delete-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin"
                className="pr-10"
                disabled={loading}
                onKeyPress={(e) => e.key === 'Enter' && handleVerifyPassword()}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>İptal</AlertDialogCancel>
          {step === 1 ? (
            <Button onClick={handleVerifyPassword} disabled={loading || !password} variant="destructive">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Şifreyi Doğrula
            </Button>
          ) : (
            <AlertDialogAction onClick={handleDeleteAccount} disabled={loading} className="bg-destructive hover:bg-destructive/90">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Hesabı Kalıcı Olarak Sil
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountDialog;