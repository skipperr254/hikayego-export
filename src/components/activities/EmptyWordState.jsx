import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyWordState = React.memo(({ searchTerm }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16"
    >
      <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">
        {searchTerm ? 'Kelime bulunamadı' : 'Henüz kelime eklenmemiş'}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {searchTerm 
          ? 'Arama kriterlerinizi değiştirmeyi deneyin.'
          : 'Hikayeleri okurken kelimelere tıklayıp kaydederek koleksiyonunuzu oluşturmaya başlayın.'
        }
      </p>
      {!searchTerm && (
        <Button onClick={() => navigate('/dashboard')}>
          Hikayeleri Keşfet
        </Button>
      )}
    </motion.div>
  );
});

export default EmptyWordState;