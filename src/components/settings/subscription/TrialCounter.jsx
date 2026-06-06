import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock } from 'lucide-react';

const TrialCounter = ({ trialDaysLeft, totalTrialDays = 3 }) => {
  const progressPercentage = ((totalTrialDays - trialDaysLeft) / totalTrialDays) * 100;
  
  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-center space-x-3 mb-3">
        <Clock className="h-5 w-5 text-blue-600" />
        <div>
          <p className="font-semibold text-blue-800 dark:text-blue-200">
            Ücretsiz Deneme Süresi
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-300">
            {trialDaysLeft} gün kaldı
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-blue-700 dark:text-blue-300">Geçen süre</span>
          <span className="font-medium text-blue-800 dark:text-blue-200">
            {totalTrialDays - trialDaysLeft} / {totalTrialDays} gün
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
      
      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
        Deneme süresi bittiğinde otomatik olarak aylık ₺99,99 ödeme başlayacak.
      </p>
    </div>
  );
};

export default TrialCounter;