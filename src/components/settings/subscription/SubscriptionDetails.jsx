import React from 'react';
import { Calendar, CreditCard } from 'lucide-react';

const SubscriptionDetails = ({ profile, nextPaymentDate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
        <Calendar className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm font-medium">Başlangıç Tarihi</p>
          <p className="text-xs text-muted-foreground">
            {profile?.subscription_date 
              ? new Date(profile.subscription_date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
              : 'Bilinmiyor'
            }
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
        <CreditCard className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm font-medium">Sonraki Ödeme Tarihi</p>
          <p className="text-xs text-muted-foreground">
            {profile?.subscription_status === 'cancelled' 
              ? 'Yok' 
              : (nextPaymentDate?.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) || 'Bilinmiyor')
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;