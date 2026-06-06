import React from 'react';
import { motion } from 'framer-motion';

const MobileDownloadSection = React.memo(() => {
  return (
    <section className="w-full px-4 py-8 sm:px-8 sm:py-12 lg:px-16 lg:py-20 flex justify-center bg-transparent">
      <motion.div 
        className="w-full max-w-7xl bg-card shadow-lg border border-gray-200 dark:border-gray-800 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between p-8 sm:p-12 md:p-16 lg:p-20 gap-12 lg:gap-20 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col text-center md:text-left flex-1 w-full">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-foreground leading-tight">
            HikayeGO Cebinizde!
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed font-medium">
            İngilizce öğrenme serüveninize istediğiniz her yerde devam edin. Mobil uygulamamızı indirin, hikayeleri dinleyin, kelime pratikleri yapın ve gelişiminizi kesintisiz sürdürün.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start items-center">
            <a 
              href="https://play.google.com/store/apps/details?id=com.ni.HikayeGO" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95"
              aria-label="Google Play'den Alın"
            >
              <img 
                src="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/3d97d59f66d594298cca2f373360aded.png" 
                alt="Google Play'den Alın" 
                className="h-16 md:h-[72px] w-auto object-contain drop-shadow-sm"
              />
            </a>
            <a 
              href="https://apps.apple.com/us/app/hikayego/id6755883981" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95"
              aria-label="App Store'dan İndirin"
            >
              <img 
                src="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/f447b1de0d323238a5b47c6bea61dc99.png" 
                alt="App Store'dan İndirin" 
                className="h-16 md:h-[72px] w-auto object-contain drop-shadow-sm"
              />
            </a>
          </div>
        </div>

        <div className="flex justify-center flex-1 w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg mt-8 md:mt-0 relative z-10">
          <img 
            src="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/4f234e3559212580429077106f614a24.png" 
            alt="HikayeGO Mobile App Illustration" 
            className="w-full h-auto object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
          />
        </div>
      </motion.div>
    </section>
  );
});

export default MobileDownloadSection;