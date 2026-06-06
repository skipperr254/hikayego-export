import React from 'react';
import { cn } from '@/lib/utils';

const IyzicoLogo = ({ className }) => {
  return (
    <img 
      src="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/43bdb00cc0419a670bff93608bd18e93.png" 
      alt="iyzico ile Öde" 
      className={cn("object-contain", className)}
    />
  );
};

export default IyzicoLogo;