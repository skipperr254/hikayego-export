import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, AlertCircle, Info } from 'lucide-react';

const SubscriptionStatus = ({ subscriptionStatus, trialDaysLeft, nextPaymentDate, isPendingCancellation }) => {
  const isTrialActive = subscriptionStatus === 'trial' && trialDaysLeft > 0;

  if (isPendingCancellation) {
    return (
      <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg border border-orange-200 dark:border-orange-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500 rounded-full">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-orange-800 dark:text-orange-200">
                İptal Beklemede
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-300">
                Aboneliğiniz {nextPaymentDate?.toLocaleDateString('tr-TR')} tarihinde sonlanacak.
              </p>
            </div>
          </div>
          <Badge variant="destructive" className="capitalize">
            İptal Edildi
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground p-2 bg-background/50 rounded-md flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>Mevcut fatura döneminin sonuna kadar tüm premium özelliklerden yararlanmaya devam edebilirsin. Fikrini değiştirirsen, aboneliğini yeniden aktif edebilirsin.</span>
        </div>
      </div>
    );
  }

  return (
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
            {isTrialActive
              ? `${trialDaysLeft} gün deneme süresi kaldı`
              : `Aylık ₺149,99 • Sonraki ödeme: ${nextPaymentDate?.toLocaleDateString('tr-TR')}`
            }
          </p>
        </div>
      </div>
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 capitalize">
        <Star className="h-3 w-3 mr-1" />
        {subscriptionStatus}
      </Badge>
    </div>
  );
};

export default SubscriptionStatus;