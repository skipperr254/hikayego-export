import React from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const FooterDownloadSection = React.memo(() => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) return null;

  return (
    <div className="flex flex-col md:items-end">
      <h3 className="font-semibold tracking-wider text-sm mb-4 text-foreground/90">UYGULAMAYI İNDİRİN</h3>
      <div className="flex flex-col lg:flex-row gap-3">
        <a 
          href="https://play.google.com/store/apps/details?id=com.ni.HikayeGO" 
          target="_blank" 
          rel="noopener noreferrer"
          className="transition-transform duration-300 hover:scale-105 inline-block w-fit"
          aria-label="Get it on Google Play"
        >
          <img 
            src="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/3d97d59f66d594298cca2f373360aded.png" 
            alt="Google Play'den Alın" 
            className="h-10 w-auto object-contain"
          />
        </a>
        <a 
          href="https://apps.apple.com/us/app/hikayego/id6755883981" 
          target="_blank" 
          rel="noopener noreferrer"
          className="transition-transform duration-300 hover:scale-105 inline-block w-fit"
          aria-label="Download on the App Store"
        >
          <img 
            src="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/f447b1de0d323238a5b47c6bea61dc99.png" 
            alt="App Store'dan İndirin" 
            className="h-10 w-auto object-contain"
          />
        </a>
      </div>
    </div>
  );
});

export default FooterDownloadSection;