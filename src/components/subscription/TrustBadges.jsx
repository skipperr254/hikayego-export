import React from 'react';
import IyzicoLogo from '@/components/iyzico/IyzicoLogo';
import { ShieldCheck } from 'lucide-react';

const TrustBadges = () => {
  return (
    <div className="mt-6 flex flex-col items-center space-y-4">
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-5 w-5 text-green-500" />
          <span>SSL Güvenli Ödeme</span>
        </div>
        <div className="hidden sm:block border-l h-5 border-border"></div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <IyzicoLogo className="h-5" />
          <span>ile Korunmaktadır</span>
        </div>
      </div>
      <div className="flex items-center space-x-4" aria-label="Visa & MasterCard desteklenir">
        <img 
          src="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/68cc4940906159e97da1ee1d73e1ebd3.png" 
          alt="MasterCard" 
          className="h-8 object-contain"
        />
        <img 
          src="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/2fcd11116b5d21ed99e9d7165d71bcc6.webp" 
          alt="Visa" 
          className="h-8 object-contain"
        />
      </div>
    </div>
  );
};

export default TrustBadges;