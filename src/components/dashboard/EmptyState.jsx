import React from 'react';
import { Button } from '@/components/ui/button';
import { Frown, SearchX, Smile } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({ onResetFilters, isSearch = false, isKidMode = false }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6 bg-secondary/30 rounded-2xl border-2 border-dashed border-border"
    >
      {isKidMode ? (
         <>
          <Smile className="h-16 w-16 text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Çocuklara Özel Hikaye Yok</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Görünüşe göre şu an için çocuklara özel olarak eklenmiş bir hikaye bulunmuyor. Yakında yeni hikayeler eklenecek!
          </p>
          <Button onClick={() => navigate('/settings/appearance')}>
            Ayarları Değiştir
          </Button>
        </>
      ) : isSearch ? (
        <>
          <SearchX className="h-16 w-16 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sonuç Bulunamadı</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Aradığınız kriterlere uygun bir hikaye bulamadık. Lütfen filtrelerinizi temizleyerek tekrar deneyin.
          </p>
          <Button onClick={onResetFilters}>
            Filtreleri Temizle
          </Button>
        </>
      ) : (
        <>
          <Frown className="h-16 w-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Hiç Hikaye Bulunamadı</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Görünüşe göre kütüphanede hiç hikaye yok. Lütfen daha sonra tekrar kontrol edin.
          </p>
        </>
      )}
    </motion.div>
  );
};

export default EmptyState;