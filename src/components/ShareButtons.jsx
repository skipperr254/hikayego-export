import React from 'react';
import { Copy, Share2, Twitter, Facebook, Linkedin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const ShareButtons = ({ url, title, text }) => {
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'Kopyalandı!',
      description: 'Bağlantı panoya kopyalandı.',
      variant: 'success',
    });
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      // The `text` parameter should be URL-encoded. It includes the title and the URL.
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n${url}`)}`,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`,
    },
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
      } catch (error) {
        console.error('Error sharing natively:', error);
      }
    } else {
      handleCopyToClipboard();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {shareOptions.map((option, index) => (
        <motion.a
          key={option.name}
          href={option.href}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, y: -2 }}
          transition={{ type: 'spring', stiffness: 300, delay: index * 0.05 }}
        >
          <Button variant="outline" size="icon" aria-label={`Share on ${option.name}`}>
            <option.icon className="h-5 w-5" />
          </Button>
        </motion.a>
      ))}
       <motion.div
        whileHover={{ scale: 1.1, y: -2 }}
        transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
       >
        <Button variant="outline" size="icon" onClick={handleCopyToClipboard} aria-label="Copy link">
            <Copy className="h-5 w-5" />
        </Button>
       </motion.div>
       {navigator.share && (
         <motion.div
            whileHover={{ scale: 1.1, y: -2 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.25 }}
         >
            <Button variant="outline" size="icon" onClick={handleNativeShare} aria-label="More share options">
                <Share2 className="h-5 w-5" />
            </Button>
         </motion.div>
       )}
    </div>
  );
};

export default ShareButtons;