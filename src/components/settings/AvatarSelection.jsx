import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { CheckCircle, Crown, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AvatarSelection = ({ normalAvatars, premiumAvatars, selectedAvatar, onSelect, isPremium }) => {
  const { toast } = useToast();

  const handleAvatarClick = (avatarUrl) => {
    const isPremiumAvatar = premiumAvatars.includes(avatarUrl);
    
    if (isPremiumAvatar && !isPremium) {
      toast({
        title: "Premium Özellik 👑",
        description: "Bu özel avatar sadece premium üyeler için! Premium'a geçerek tüm havalı avatarlara erişebilirsin.",
        variant: "default"
      });
      return;
    }
    
    onSelect(avatarUrl);
  };
  
  const SecureAvatar = ({ avatarUrl, alt, className, ...props }) => {
    return (
      <Avatar
        className={cn("pointer-events-none", className)}
        onDragStart={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
        {...props}
      >
        <AvatarImage 
          src={avatarUrl} 
          alt={alt}
          className="pointer-events-none" 
          draggable="false"
        />
      </Avatar>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Standart Avatarlar</h3>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {normalAvatars.map((avatarUrl, index) => (
            <motion.div
              key={`normal-${index}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-pointer group"
              onClick={() => handleAvatarClick(avatarUrl)}
            >
              <SecureAvatar 
                avatarUrl={avatarUrl} 
                alt={`Avatar ${index + 1}`}
                className={cn(
                  'h-16 w-16 md:h-20 md:w-20 border-2 transition-all duration-300 shadow-md',
                  selectedAvatar === avatarUrl 
                    ? 'border-primary ring-2 ring-primary/50' 
                    : 'border-transparent group-hover:border-primary/50'
                )}
              />
              {selectedAvatar === avatarUrl && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-background rounded-full p-0.5"
                >
                  <CheckCircle className="h-5 w-5 text-green-500" fill="white" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Crown className="h-5 w-5 mr-2 text-amber-400"/>
          Premium Avatarlar
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {premiumAvatars.map((avatarUrl, index) => (
            <motion.div
              key={`premium-${index}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-pointer group"
              onClick={() => handleAvatarClick(avatarUrl)}
            >
              <SecureAvatar
                avatarUrl={avatarUrl}
                alt={`Premium Avatar ${index + 1}`}
                className={cn(
                  'h-16 w-16 md:h-20 md:w-20 border-2 transition-all duration-300 shadow-lg',
                  selectedAvatar === avatarUrl 
                    ? 'border-amber-400 ring-2 ring-amber-400/50'
                    : 'border-transparent group-hover:border-amber-400/50',
                  !isPremium && 'opacity-60 grayscale-[50%]'
                )}
              />
              {!isPremium && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                  <Lock className="h-6 w-6 text-white/80" />
                </div>
              )}
               {selectedAvatar === avatarUrl && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-background rounded-full p-0.5"
                >
                  <CheckCircle className="h-5 w-5 text-green-500" fill="white" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarSelection;