import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStoryData } from '@/hooks/useStoryData';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ArrowLeft, BookOpen, Clock, BarChart, Star, Calendar, Tag, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Seo from '@/components/Seo';
import StarRating from '@/components/dashboard/StarRating';
import { useToast } from '@/components/ui/use-toast';

const getLevelBadgeClass = (level) => {
  switch (level) {
    case 'a1': return 'bg-green-500 hover:bg-green-600';
    case 'a2': return 'bg-blue-500 hover:bg-blue-600';
    case 'b1': return 'bg-yellow-500 hover:bg-yellow-600 text-black';
    case 'b2': return 'bg-orange-500 hover:bg-orange-600';
    case 'c1': return 'bg-red-500 hover:bg-red-600';
    default: return 'bg-gray-500 hover:bg-gray-600';
  }
};

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

const StoryDetailPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { story, loading } = useStoryData(slug, user, navigate);
  const { toast } = useToast();

  const wordCount = useMemo(() => {
    if (!story?.content) return 'N/A';
    return story.content.split(/\s+/).length;
  }, [story?.content]);
  
  const handleShare = async () => {
    const shareData = {
      title: `HikayeGO'da bir hikaye keşfettim: ${story.title}`,
      text: `${story.description}\nBu harika hikayeyi HikayeGO'da oku!`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Bağlantı kopyalandı!",
          description: "Hikaye bağlantısı panoya kopyalandı.",
        });
      }
    } catch (error) {
      console.error('Error sharing story:', error);
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Bağlantı kopyalandı.",
        description: "Paylaşım başarısız oldu. Bağlantıyı panoya kopyaladık.",
      });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center text-center p-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Hikaye Bulunamadı</h2>
          <p className="text-muted-foreground mb-4">Aradığınız hikaye mevcut değil veya kaldırılmış olabilir.</p>
          <Button onClick={() => navigate('/dashboard')}>Kütüphaneye Dön</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={story.title}
        description={story.description}
        image={story.image_url}
        url={`/story/${story.slug}`}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-background pb-28"
      >
        <div className="relative">
          <div className="absolute top-4 left-4 z-20">
            <Button variant="ghost" size="icon" className="rounded-full bg-background/50 hover:bg-background/80" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="aspect-[4/3] w-full overflow-hidden relative">
            <img
              src={story.image_url}
              alt={story.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          </div>
        </div>

        <div className="p-6 -mt-16 relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className={`${getLevelBadgeClass(story.level)} text-white shadow-lg mb-2`}>
              {story.level.toUpperCase()}
            </Badge>
            <h1 className="text-3xl font-bold text-foreground mb-2">{story.title}</h1>
            <div className="flex items-center justify-between text-muted-foreground mb-6">
              <p>Yazar: Bilinmiyor</p>
              <StarRating storyId={story.id} initialAvgRating={story.rating} />
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 p-6 rounded-2xl bg-card border shadow-sm mb-8">
              <InfoCard icon={Tag} label="Türler" value={story.category || 'Genel'} />
              <InfoCard icon={Calendar} label="Yayınlandı" value={new Date(story.created_at).toLocaleDateString('tr-TR')} />
              <InfoCard icon={Clock} label="Okuma Süresi" value={story.read_time || 'N/A'} />
              <InfoCard icon={BarChart} label="Kelimeler" value={wordCount} />
            </div>

            <h2 className="text-xl font-bold text-foreground mb-3">Açıklama</h2>
            <p className="text-muted-foreground leading-relaxed">
              {story.description}
            </p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30, delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t z-30"
      >
        <div className="flex items-center gap-2">
            <Link to={`/read/${story.slug}`} className="w-full">
              <Button size="lg" className="w-full font-bold text-lg">
                <BookOpen className="mr-2 h-5 w-5" />
                Oku
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-3" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
        </div>
      </motion.div>
    </>
  );
};

export default StoryDetailPage;