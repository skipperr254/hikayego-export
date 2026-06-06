import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Rss, Loader2, User, CalendarDays, Flame } from 'lucide-react';
import Seo from '@/components/Seo';
import { supabase } from '@/lib/customSupabaseClient';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [hotTopics, setHotTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultImage = 'https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/f557009055158d9ee5d06d3a4010e832.png';

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

        const hot = data.filter(p => p.is_hot_topic).sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        const regular = data.filter(p => !p.is_hot_topic);
        setHotTopics(hot);
        setPosts(regular);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const mainHotTopic = useMemo(() => (hotTopics.length > 0 ? hotTopics[0] : null), [hotTopics]);
  const sideHotTopics = useMemo(() => (hotTopics.length > 1 ? hotTopics.slice(1, 3) : []), [hotTopics]);

  return (
    <>
      <Seo
        title="Blog"
        description="Dil öğrenimi, etkili çalışma teknikleri ve HikayeGO'dan haberler hakkında en son makaleler."
        url="/blog"
        keywords="ingilizce öğrenme blog, dil ipuçları, hikayego blog"
        image="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/d4fa57d4eeab1334500ea83bdd9cbedb.png"
      />
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-grow">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative bg-secondary/30 pt-20 pb-10 text-center overflow-hidden"
          >
            <div className="absolute inset-0">
              <img src="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/366922a31d1e46225d596c04907118d5.jpg" alt="Blog hero" className="w-full h-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
            </div>
            <div className="container mx-auto px-6 relative">
              <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                <Rss className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                HikayeGO <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text">Blog</span>
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Dil öğrenimi yolculuğunuzda size ilham verecek ipuçları, hikayeler ve güncellemeler.
              </p>
            </div>
          </motion.div>

          <div className="container mx-auto py-16 px-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {hotTopics.length > 0 && (
                  <motion.section
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-16"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <Flame className="h-7 w-7 text-orange-500" />
                      <h2 className="text-3xl font-bold tracking-tight text-foreground">Hot Topics</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                      {mainHotTopic && (
                        <motion.div variants={itemVariants} className="h-full">
                          <Link to={`/blog/${mainHotTopic.slug}`} className="block group h-full">
                            <Card className="border-none shadow-none bg-transparent h-full flex flex-col">
                              <div className="relative w-full overflow-hidden rounded-2xl mb-4">
                                <motion.img
                                  alt={mainHotTopic.title}
                                  className="w-full h-full object-cover rounded-2xl aspect-[16/10] md:aspect-auto lg:aspect-[16/10]"
                                  src={mainHotTopic.image_url || defaultImage}
                                  whileHover={{ scale: 1.05 }}
                                  transition={{ duration: 0.5 }}
                                />
                              </div>
                              <CardContent className="p-0">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                  <div className="flex items-center gap-1.5"><User className="h-4 w-4"/>{mainHotTopic.author_name || 'HikayeGO Team'}</div>
                                  <div className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4"/>{formatDate(mainHotTopic.published_at)}</div>
                                </div>
                                <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">{mainHotTopic.title}</h2>
                              </CardContent>
                            </Card>
                          </Link>
                        </motion.div>
                      )}
                      {sideHotTopics.length > 0 && (
                        <div className="flex flex-col gap-6 justify-between h-full">
                          {sideHotTopics.map((post) => (
                            <motion.div variants={itemVariants} key={post.id} className="flex-1 flex">
                              <Link to={`/blog/${post.slug}`} className="block group h-full w-full">
                                <Card className="border-none shadow-none bg-transparent h-full flex flex-row sm:flex-col lg:flex-row gap-4 w-full">
                                  <div className="relative w-2/5 sm:w-full lg:w-2/5 aspect-square sm:aspect-video lg:aspect-square overflow-hidden rounded-2xl flex-shrink-0">
                                    <motion.img
                                      alt={post.title}
                                      className="w-full h-full object-cover rounded-2xl"
                                      src={post.image_url || defaultImage}
                                      whileHover={{ scale: 1.05 }}
                                      transition={{ duration: 0.5 }}
                                    />
                                  </div>
                                  <CardContent className="p-0 flex-grow flex flex-col justify-center w-3/5 sm:w-full lg:w-3/5">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                                      <div className="flex items-center gap-1"><User className="h-3 w-3"/><span>{post.author_name || 'Team'}</span></div>
                                      <div className="hidden sm:flex items-center gap-1"><CalendarDays className="h-3 w-3"/><span>{formatDate(post.published_at)}</span></div>
                                    </div>
                                    <h3 className="text-base lg:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">{post.title}</h3>
                                    <p className="hidden sm:block text-sm text-muted-foreground line-clamp-2">
                                      {post.excerpt}
                                    </p>
                                  </CardContent>
                                </Card>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.section>
                )}
                
                <h2 className="text-3xl font-bold mb-8">All Articles</h2>
                {posts.length > 0 ? (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {posts.map((post) => (
                      <motion.div key={post.id} variants={itemVariants} className="h-full">
                        <Link to={`/blog/${post.slug}`} className="block h-full group">
                          <Card className="h-full overflow-hidden transition-all duration-300 border-none shadow-none bg-transparent flex flex-col">
                            <div className="aspect-video overflow-hidden rounded-2xl mb-4">
                              <motion.img
                                alt={post.title}
                                className="w-full h-full object-cover rounded-2xl"
                                src={post.image_url || defaultImage}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                            <CardContent className="p-0 flex flex-col justify-between flex-grow">
                              <div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                  <div className="flex items-center gap-1.5"><User className="h-4 w-4"/>{post.author_name || 'HikayeGO Team'}</div>
                                  <div className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4"/>{formatDate(post.published_at)}</div>
                                </div>
                                <h2 className="text-xl font-bold tracking-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h2>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (hotTopics.length === 0 && posts.length === 0) && (
                  <div className="text-center py-16">
                      <h2 className="text-2xl font-semibold text-foreground">Henüz Blog Yazısı Yok</h2>
                      <p className="mt-2 text-muted-foreground">Yakında burada ilham verici içerikler bulacaksınız!</p>
                    </div>
                )}
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogPage;