import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
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
        <Card className="h-full overflow-hidden rounded-2xl shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/10 transition-all duration-300 border-transparent hover:border-primary/20 bg-card/50 backdrop-blur-sm">
          <div className="relative">
            <img
              src={post.image_url || 'https://via.placeholder.com/400x250/EBF4FF/1E293B?text=HikayeGO'}
              alt={post.title}
              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <CardContent className="p-5 flex flex-col justify-between flex-grow">
            <div>
              <h3 className="text-lg font-light tracking-wide mb-2 text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                {post.title}
              </h3>
            </div>
            <div className="mt-auto pt-2">
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

const RelatedBlogPosts = ({ currentPostId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!currentPostId) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, slug, image_url, excerpt')
          .eq('status', 'published')
          .neq('id', currentPostId)
          .limit(3)
          .order('published_at', { ascending: false });

        if (error) throw error;
        setPosts(data);
      } catch (error) {
        console.error('Error fetching related blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPostId]);

  if (loading) {
    return (
      <section className="py-20 sm:py-24 bg-slate-50 dark:bg-background">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-1/2 mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="rounded-2xl overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <CardContent className="p-5">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-1/2" />
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
    <section className="py-20 sm:py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <SectionHeader title="Benzer Yazılar" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedBlogPosts;