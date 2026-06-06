import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SectionHeader from '@/components/home/SectionHeader';

const BlogPostCard = ({ post, index }) => {
  const cardVariants = {
    offscreen: {
      opacity: 0,
      y: 50,
    },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 50,
        damping: 20,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.3 }}
      className="h-full"
    >
      <Link to={`/blog/${post.slug}`} className="block h-full group">
        <Card className="h-full overflow-hidden rounded-2xl shadow-lg hover:shadow-primary/20 dark:hover:shadow-primary/10 transition-all duration-300 border-transparent hover:border-primary/20 bg-card/50 backdrop-blur-sm">
          <div className="relative">
            <img
              src={post.image_url || 'https://via.placeholder.com/400x250/EBF4FF/1E293B?text=HikayeGO'}
              alt={post.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <Badge variant="secondary" className="text-xs font-semibold">Blog</Badge>
            </div>
          </div>
          <CardContent className="p-6 flex flex-col justify-between flex-grow">
            <div>
              <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {post.excerpt}
              </p>
            </div>
            <div className="mt-auto">
              <div className="flex items-center text-xs text-muted-foreground mb-4 space-x-4">
                <div className="flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5" />
                  <span>{post.author_name || 'HikayeGO Ekibi'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  <span>{new Date(post.published_at).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
              <div className="flex items-center text-primary font-semibold text-sm">
                Devamını Oku
                <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

const RecommendedBlogs = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (error) throw error;
        
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);

        const shuffled = [...data].sort((a, b) => {
            const valA = (a.id * 31 + dayOfYear * 7) % data.length;
            const valB = (b.id * 31 + dayOfYear * 7) % data.length;
            return valA - valB;
        });

        setPosts(shuffled.slice(0, 3));
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 sm:py-24 bg-slate-50 dark:bg-background">
        <div className="container mx-auto px-4">
          <Skeleton className="h-24 w-full max-w-2xl mx-auto mb-16" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="rounded-2xl overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-6" />
                  <Skeleton className="h-5 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 sm:py-24 bg-slate-50 dark:bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader 
          title="Öne Çıkan Yazılar"
          titleHighlight="Yazılar"
          subtitle="Dil öğrenimi, ipuçları ve daha fazlası hakkında en son makalelerimize göz atın."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedBlogs;