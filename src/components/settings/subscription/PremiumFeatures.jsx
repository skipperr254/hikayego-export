import React from 'react';
import { Zap, Languages, Bot, Bookmark, Shield, Sparkles, BarChart, Users } from 'lucide-react';

const PremiumFeatures = () => {
  const features = [
    { icon: Zap, text: "Tüm seviyelerde sınırsız hikaye" },
    { icon: Languages, text: "Sınırsız kelime çevirisi ve kaydetme" },
    { icon: Bot, text: "Yapay zeka destekli öğrenme asistanı" },
    { icon: Bookmark, text: "Kaldığın yeri işaretleme ve devam etme" },
    { icon: Shield, text: "Reklamsız premium deneyim" },
    { icon: Sparkles, text: "Yeni özelliklere erken erişim" },
    { icon: BarChart, text: "Detaylı ilerleme raporları" },
    { icon: Users, text: "Özel topluluk rozeti" },
  ];

  return (
    <div className="space-y-3">
      <h4 className="font-medium">Aktif Premium Özellikleriniz:</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="flex items-center space-x-2 text-sm p-2 bg-secondary/50 rounded-md">
              <Icon className="h-4 w-4 text-green-500" />
              <span>{feature.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PremiumFeatures;