import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const DangerZone = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      // Delete user data from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
      }

      // Delete user's saved words
      const { error: wordsError } = await supabase
        .from('user_saved_words')
        .delete()
        .eq('user_id', user.id);

      if (wordsError) {
        console.error('Error deleting saved words:', wordsError);
      }

      // Delete user's quiz attempts
      const { error: quizError } = await supabase
        .from('user_quiz_attempts')
        .delete()
        .eq('user_id', user.id);

      if (quizError) {
        console.error('Error deleting quiz attempts:', quizError);
      }

      // Delete user's saved stories
      const { error: storiesError } = await supabase
        .from('user_saved_stories')
        .delete()
        .eq('user_id', user.id);

      if (storiesError) {
        console.error('Error deleting saved stories:', storiesError);
      }

      // Delete user's read stories
      const { error: readStoriesError } = await supabase
        .from('user_read_stories')
        .delete()
        .eq('user_id', user.id);

      if (readStoriesError) {
        console.error('Error deleting read stories:', readStoriesError);
      }

      // Delete user's word categories
      const { error: categoriesError } = await supabase
        .from('word_categories')
        .delete()
        .eq('user_id', user.id);

      if (categoriesError) {
        console.error('Error deleting word categories:', categoriesError);
      }

      // Logout user
      await logout();
      
      toast({
        title: "Hesabınız Silindi",
        description: "Tüm verileriniz başarıyla silindi. Sizi tekrar aramızda görmeyi umuyoruz.",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Hata",
        description: "Hesap silinirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5" />
          Tehlikeli Bölge
        </CardTitle>
        <CardDescription>
          Bu işlemler geri alınamaz. Lütfen dikkatli olun.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
          <h4 className="font-medium text-destructive mb-2">Hesabı Kalıcı Olarak Sil</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Bu işlem geri alınamaz. Tüm hikaye ilerlemeniz, kelime listeleriniz ve hesap bilgileriniz kalıcı olarak silinecektir.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Hesabımı Kalıcı Olarak Sil
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center text-destructive">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Hesabınızı silmek istediğinizden emin misiniz?
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>Bu işlem <strong>geri alınamaz</strong>. Aşağıdaki veriler kalıcı olarak silinecektir:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Tüm hikaye ilerlemeniz</li>
                    <li>Kaydettiğiniz kelimeler ve kategoriler</li>
                    <li>Quiz sonuçlarınız</li>
                    <li>Hesap bilgileriniz</li>
                    <li>Premium aboneliğiniz (varsa)</li>
                  </ul>
                  <p className="font-medium text-destructive">
                    Bu işlemden sonra aynı e-posta ile yeni hesap oluşturabilirsiniz, ancak tüm verileriniz kaybolacaktır.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal Et</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAccount} 
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Evet, Hesabımı Sil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default DangerZone;