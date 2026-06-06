import React from 'react';
import { Lightbulb, Crown } from 'lucide-react';
import { getGrammarTip } from '@/lib/grammarRules';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const GrammarTip = ({ selectedWord, translationInfo }) => {
  const { canAccessPremiumFeatures } = useAuth();
  const navigate = useNavigate();

  const handlePremiumUpgrade = () => {
    navigate('/subscription');
  };

  const renderContent = () => {
    if (!selectedWord || !translationInfo) {
      return (
        <p className="text-muted-foreground text-center py-4">
          Bir kelime seçerek ilgili dil bilgisi ipuçlarını görün.
        </p>
      );
    }

    const grammarTip = getGrammarTip(selectedWord, translationInfo);

    if (canAccessPremiumFeatures) {
      return (
        <div className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            <span className="font-semibold text-primary capitalize">"{selectedWord}"</span> - {grammarTip.type}
          </p>
          <div className="bg-secondary p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">Dil Bilgisi Açıklaması</h4>
            <p className="leading-relaxed">{grammarTip.explanation}</p>
          </div>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/50"
      >
        <Crown className="h-10 w-10 text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200">
          Dil Bilgisi Uzmanı
        </h3>
        <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
          Seçtiğiniz kelimelerin detaylı dil bilgisi açıklamalarını, kullanım örneklerini ve uzman ipuçlarını görmek için Premium'a geçin.
        </p>
        <Button onClick={handlePremiumUpgrade} size="sm" className="bg-amber-500 hover:bg-amber-600 text-white rounded-full">
          <Crown className="h-4 w-4 mr-2" />
          Premium'a Yükselt
        </Button>
      </motion.div>
    );
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default GrammarTip;