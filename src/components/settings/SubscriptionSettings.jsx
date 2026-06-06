import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, Crown, Calendar, CreditCard, ArrowLeft, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const SubscriptionSettings = ({ user }) => {
  const { updateUser } = useAuth();
  const { toast } = useToast();
  const [cancellationStep, setCancellationStep] = useState(0);
  const [cancellationData, setCancellationData] = useState({
    reason: '',
    feedback: '',
    improvement: ''
  });

  const cancellationReasons = [
    { value: "price", label: "Fiyatı çok yüksek buluyorum" },
    { value: "usage", label: "Yeterince sık kullanmıyorum" },
    { value: "features", label: "İhtiyacım olan özellikleri bulamadım" },
    { value: "technical", label: "Teknik sorunlar yaşıyorum" },
    { value: "alternative", label: "Başka bir hizmete geçiyorum" },
    { value: "temporary", label: "Geçici olarak durdurmak istiyorum" },
    { value: "other", label: "Diğer" }
  ];

  const handleCancelSubscription = () => {
    // Immediate cancellation - no waiting for billing period end
    updateUser({ 
      subscription: false, 
      cancellation_date: new Date().toISOString() 
    });
    
    toast({
      title: "Aboneliğiniz İptal Edildi",
      description: "Premium özellikleriniz anında sonlandırıldı. İstediğiniz zaman tekrar abone olabilirsiniz.",
    });
    
    setCancellationStep(0);
    setCancellationData({ reason: '', feedback: '', improvement: '' });
  };

  const getStepProgress = () => {
    switch(cancellationStep) {
      case 1: return 25;
      case 2: return 50;
      case 3: return 75;
      case 4: return 100;
      default: return 0;
    }
  };

  const renderCancellationStep = () => {
    switch(cancellationStep) {
      case 1:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center text-xl">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                Aboneliği İptal Et
              </DialogTitle>
              <DialogDescription className="text-base">
                Ayrılmanız bizi üzer. Premium aboneliğinizi iptal etmek istediğinizden emin misiniz?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                  Kaybedecekleriniz:
                </h4>
                <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                  <li>• Tüm seviyelerdeki hikayelere erişim</li>
                  <li>• Sınırsız kelime kaydetme</li>
                  <li>• Kelime kategorileri ve özel quizler</li>
                  <li>• Sesli okuma ve telaffuz özellikleri</li>
                  <li>• Detaylı dil bilgisi notları</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setCancellationStep(0)}>
                Vazgeç
              </Button>
              <Button variant="destructive" onClick={() => setCancellationStep(2)}>
                Devam Et <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Neden ayrılıyorsunuz?</DialogTitle>
              <DialogDescription>
                Geri bildiriminiz hizmetimizi geliştirmemize yardımcı olur. Lütfen bir neden seçin.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <RadioGroup 
                value={cancellationData.reason} 
                onValueChange={(value) => setCancellationData({...cancellationData, reason: value})}
                className="space-y-3"
              >
                {cancellationReasons.map((reason) => (
                  <div key={reason.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value={reason.value} id={reason.value} />
                    <Label htmlFor={reason.value} className="flex-1 cursor-pointer">
                      {reason.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setCancellationStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Geri
              </Button>
              <Button 
                onClick={() => setCancellationStep(3)} 
                disabled={!cancellationData.reason}
              >
                Devam Et <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        );
      
      case 3:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Deneyiminizi iyileştirmek için</DialogTitle>
              <DialogDescription>
                Yaşadığınız sorunları anlamamıza yardımcı olun. Bu bilgiler ürünümüzü geliştirmek için kullanılacak.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <Label htmlFor="feedback" className="text-sm font-medium">
                  Hangi konularda sorun yaşadınız? (İsteğe bağlı)
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="Örn: Hikayeler çok kolay/zor geldi, teknik sorunlar yaşadım..."
                  value={cancellationData.feedback}
                  onChange={(e) => setCancellationData({...cancellationData, feedback: e.target.value})}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="improvement" className="text-sm font-medium">
                  Hangi iyileştirmeler sizi geri getirebilir? (İsteğe bağlı)
                </Label>
                <Textarea
                  id="improvement"
                  placeholder="Örn: Daha fazla hikaye, daha iyi fiyatlandırma, yeni özellikler..."
                  value={cancellationData.improvement}
                  onChange={(e) => setCancellationData({...cancellationData, improvement: e.target.value})}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setCancellationStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Geri
              </Button>
              <Button onClick={() => setCancellationStep(4)}>
                Devam Et <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        );
      
      case 4:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-red-600 dark:text-red-400">Son Onay</DialogTitle>
              <DialogDescription>
                Bu işlem geri alınamaz. Aboneliğiniz anında iptal edilecek ve Premium özellikleriniz sonlandırılacak.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 font-medium">
                  Aboneliğinizi iptal etmek üzeresiniz. Bu işlemden sonra:
                </p>
                <ul className="text-sm text-red-700 dark:text-red-300 mt-2 space-y-1">
                  <li>• Premium özellikleriniz anında sonlandırılacak</li>
                  <li>• Sadece ücretsiz özellikleri kullanabileceksiniz</li>
                  <li>• İstediğiniz zaman tekrar abone olabilirsiniz</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setCancellationStep(3)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Geri
              </Button>
              <Button variant="destructive" onClick={handleCancelSubscription}>
                Aboneliği İptal Et
              </Button>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  if (!user?.subscription) {
    return (
      <Card className="mb-8 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="h-5 w-5 mr-2 text-primary" />
            Premium'a Geç
          </CardTitle>
          <CardDescription>
            Tüm özelliklerin kilidini açın ve öğrenme deneyiminizi geliştirin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">∞</div>
                <div className="text-sm text-muted-foreground">Sınırsız Hikaye</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">∞</div>
                <div className="text-sm text-muted-foreground">Sınırsız Kelime</div>
              </div>
            </div>
            <Button className="w-full btn-glow">
              <Crown className="mr-2 h-4 w-4" />
              Premium'a Geç - ₺50/ay
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-8 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="h-5 w-5 mr-2 text-amber-500" />
            Premium Abonelik
          </CardTitle>
          <CardDescription>Mevcut aboneliğinizi yönetin.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-500 rounded-full">
                  <Crown className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-amber-800 dark:text-amber-200">
                    Premium Aktif
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-300">
                    Aylık ₺50 • 3 günlük ücretsiz deneme
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Aktif
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Başlangıç Tarihi</p>
                  <p className="text-xs text-muted-foreground">
                    {user.subscription_date 
                      ? new Date(user.subscription_date).toLocaleDateString('tr-TR')
                      : 'Bilinmiyor'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Deneme Süresi</p>
                  <p className="text-xs text-muted-foreground">
                    3 gün ücretsiz deneme
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Premium Özellikleriniz:</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Tüm seviye hikayeleri</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Sınırsız kelime kaydetme</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Kelime kategorileri</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Sesli okuma</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Detaylı dil bilgisi</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Özel quizler</span>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              onClick={() => setCancellationStep(1)}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Aboneliği İptal Et
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={cancellationStep > 0} onOpenChange={() => {
        setCancellationStep(0);
        setCancellationData({ reason: '', feedback: '', improvement: '' });
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="mb-4">
            <Progress value={getStepProgress()} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">Adım {cancellationStep} / 4</p>
          </div>
          {renderCancellationStep()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubscriptionSettings;