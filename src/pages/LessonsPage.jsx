import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, BookOpen, Lock, CheckSquare, Square, ArrowLeft, Mail } from 'lucide-react';
import Seo from '@/components/Seo';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import LessonView from '@/components/lessons/LessonView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

const levelFilters = [{
  id: 'a1',
  label: 'A1'
}, {
  id: 'a2',
  label: 'A2'
}, {
  id: 'b1',
  label: 'B1'
}, {
  id: 'b2',
  label: 'B2'
}, {
  id: 'c1',
  label: 'C1'
}];

const LAST_LESSON_KEY = 'lastViewedLessonId';

const PremiumNotice = React.memo(() => (
  <Card className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 bg-card/80 backdrop-blur-sm">
    <Lock className="w-12 h-12 text-muted-foreground mb-4" />
    <h2 className="text-2xl font-bold mb-4">Kilitli İçerik</h2>
    <div className="text-muted-foreground mb-6 max-w-md leading-relaxed flex flex-col gap-2">
      <span>Uygulama içinden plan/hesap işlemleri desteklenmiyor. Lütfen masaüstünden devam edin.</span>
      <span>Gerekirse bizimle iletişime geçin:</span>
      <span className="font-medium inline-flex items-center gap-2 justify-center text-primary mt-2">
        <Mail className="h-4 w-4" />
        contact@hikayego.com
      </span>
    </div>
  </Card>
));

PremiumNotice.displayName = 'PremiumNotice';

const LessonViewer = React.memo(({
  lessonToView,
  handleLessonEnd
}) => {
  return (
    <div className="lg:sticky lg:top-24">
      {lessonToView ? lessonToView.isLocked ? <PremiumNotice /> : <LessonView lesson={lessonToView} onLessonEnd={handleLessonEnd} /> : (
        <Card className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 bg-card/80 backdrop-blur-sm">
          <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold">Bir Ders Seçin</h2>
          <p className="text-muted-foreground mt-2">Öğrenmeye başlamak için listeden bir ders seçin.</p>
        </Card>
      )}
    </div>
  );
});

LessonViewer.displayName = 'LessonViewer';

const Playlist = React.memo(({
  selectedLevel,
  setSelectedLevel,
  structuredLessons,
  allCategoryAndUncategorizedIds,
  canAccessPremiumFeatures,
  selectedLesson,
  lessonProgress,
  handleLessonSelect
}) => {
  const handleLevelClick = useCallback(levelId => {
    setSelectedLevel(levelId);
  }, [setSelectedLevel]);
  
  return (
    <Card className="lg:h-[calc(100vh-8rem-6rem)] lg:flex lg:flex-col bg-card/80 backdrop-blur-sm shadow-xl mt-8 lg:mt-0">
      <CardHeader className='flex-shrink-0'>
        <CardTitle className="flex items-center text-lg">Ders Programı</CardTitle>
        <div className="grid grid-cols-5 gap-2 pt-4">
          {levelFilters.map(filter => (
            <Button 
              key={filter.id} 
              variant={selectedLevel === filter.id ? 'default' : 'outline'} 
              onClick={() => handleLevelClick(filter.id)} 
              className={cn('aspect-square h-auto w-full text-base sm:text-lg font-bold transition-all duration-300 transform', selectedLevel === filter.id ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/40 scale-105' : 'bg-background hover:bg-accent')}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto custom-scrollbar p-3">
        <Accordion type="multiple" className="w-full" defaultValue={allCategoryAndUncategorizedIds}>
          {(structuredLessons[selectedLevel] || []).map(category => (
            <AccordionItem value={category.id?.toString() || 'uncategorized'} key={category.id || 'uncategorized'}>
              <AccordionTrigger className="text-base font-semibold hover:no-underline">{category.name}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {category.lessons.map(lesson => {
                    const isLocked = !canAccessPremiumFeatures && !lesson.is_free;
                    const isSelected = selectedLesson?.id === lesson.id;
                    const isCompleted = lessonProgress.has(lesson.id);
                    return (
                      <div 
                        key={lesson.id} 
                        onClick={() => handleLessonSelect(lesson)} 
                        className={cn('flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group relative', isSelected ? 'bg-primary/20 dark:bg-primary/10' : 'hover:bg-accent', isLocked && 'opacity-60 hover:opacity-80')}
                      >
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                          {isCompleted ? <CheckSquare className="h-6 w-6 text-primary" /> : isLocked ? <Lock className="h-5 w-5 text-muted-foreground" /> : <Square className="h-6 w-6 text-muted-foreground/50" />}
                        </div>
                        <div className="flex-grow">
                          <p className={cn('font-semibold text-sm transition-colors', isSelected ? 'text-primary' : 'text-foreground')}>
                            {lesson.title}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
});

Playlist.displayName = 'Playlist';

const LessonHeaderPanel = React.memo(({
  progressByLevel,
  selectedLevel,
  onBack
}) => {
  const currentProgress = progressByLevel[selectedLevel] || {
    percentage: 0,
    completed: 0,
    total: 0
  };
  
  return (
    <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-lg border-b shadow-sm">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10 flex-shrink-0">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex-grow text-center px-4">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Video Dersler</h1>
          <p className="text-sm text-muted-foreground mt-1">HikayeGO öğrencilerine özel çekilmiş Youtube videolarıyla İngilizce konularına göz at!</p>
        </div>
        <div className="hidden md:flex flex-col items-end gap-2 w-48 flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedLevel} 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 10 }} 
              transition={{ duration: 0.3 }} 
              className="w-full"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-foreground">{selectedLevel.toUpperCase()} Seviyesi</span>
                <span className="text-sm font-bold text-primary">{`${Math.round(currentProgress.percentage)}%`}</span>
              </div>
              <Progress value={currentProgress.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {currentProgress.total} dersten {currentProgress.completed} tanesi tamamlandı.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});

LessonHeaderPanel.displayName = 'LessonHeaderPanel';

const LessonsPage = () => {
  const {
    user,
    canAccessPremiumFeatures
  } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lessonProgress, setLessonProgress] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('a1');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const navigate = useNavigate();

  const fetchInitialData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [lessonsRes, categoriesRes, progressRes] = await Promise.all([
        supabase.from('lessons').select('*').order('position', { ascending: true }), 
        supabase.from('lesson_categories').select('*').order('position', { ascending: true }), 
        supabase.from('user_lesson_progress').select('lesson_id').eq('user_id', user.id).eq('completed', true)
      ]);
      
      if (lessonsRes.error) throw lessonsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (progressRes.error) throw progressRes.error;
      
      const fetchedLessons = lessonsRes.data || [];
      setLessons(fetchedLessons);
      setCategories(categoriesRes.data || []);
      setLessonProgress(new Set(progressRes.data.map(p => p.lesson_id)));
      
      if (fetchedLessons.length > 0) {
        const lastViewedId = localStorage.getItem(LAST_LESSON_KEY);
        const lastViewedLesson = lastViewedId ? fetchedLessons.find(l => l.id.toString() === lastViewedId) : null;
        if (lastViewedLesson && (canAccessPremiumFeatures || lastViewedLesson.is_free)) {
          setSelectedLesson(lastViewedLesson);
          setSelectedLevel(lastViewedLesson.level);
        } else {
          const firstVisibleLesson = fetchedLessons.find(l => canAccessPremiumFeatures || l.is_free);
          setSelectedLesson(firstVisibleLesson || null);
          if (firstVisibleLesson) {
            setSelectedLevel(firstVisibleLesson.level);
          }
        }
      }
    } catch (error) {
      // Ignored console.error per requirements
    } finally {
      setLoading(false);
    }
  }, [user, canAccessPremiumFeatures]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const structuredLessons = useMemo(() => {
    const byLevel = {};
    levelFilters.forEach(f => {
      byLevel[f.id] = [];
    });
    
    const sortedCategories = [...categories].sort((a, b) => a.position - b.position);
    sortedCategories.forEach(category => {
      if (!byLevel[category.level]) byLevel[category.level] = [];
      const categoryLessons = lessons.filter(l => l.category_id === category.id).sort((a, b) => a.position - b.position);
      if (categoryLessons.length > 0) {
        byLevel[category.level].push({
          ...category,
          lessons: categoryLessons
        });
      }
    });
    
    const lessonsWithoutCategory = lessons.filter(l => !l.category_id).sort((a, b) => a.position - b.position);
    lessonsWithoutCategory.forEach(lesson => {
      if (!byLevel[lesson.level]) byLevel[lesson.level] = [];
      let uncategorized = byLevel[lesson.level].find(c => c.id === null);
      if (!uncategorized) {
        uncategorized = {
          id: null,
          name: 'Diğer Dersler',
          lessons: []
        };
        byLevel[lesson.level].push(uncategorized);
      }
      uncategorized.lessons.push(lesson);
    });
    
    return byLevel;
  }, [lessons, categories]);

  const handleLessonSelect = useCallback(lesson => {
    setSelectedLesson(lesson);
    localStorage.setItem(LAST_LESSON_KEY, lesson.id.toString());
    if (isMobile) {
      const lessonViewElement = document.getElementById('lesson-view-container');
      if (lessonViewElement) {
        lessonViewElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  }, [isMobile]);

  const handleLessonEnd = useCallback(async endedLessonId => {
    if (!user) return;
    setLessonProgress(prev => new Set(prev).add(endedLessonId));
    await supabase.from('user_lesson_progress').upsert({
      user_id: user.id,
      lesson_id: endedLessonId,
      completed: true
    }, {
      onConflict: 'user_id,lesson_id'
    });
    
    const allLessonsFlat = Object.values(structuredLessons).flatMap(level => level.flatMap(cat => cat.lessons));
    const currentIndex = allLessonsFlat.findIndex(l => l.id === endedLessonId);
    if (currentIndex > -1 && currentIndex < allLessonsFlat.length - 1) {
      const nextLesson = allLessonsFlat[currentIndex + 1];
      if (nextLesson && (canAccessPremiumFeatures || nextLesson.is_free)) {
        handleLessonSelect(nextLesson);
        setSelectedLevel(nextLesson.level);
      }
    }
  }, [user, structuredLessons, canAccessPremiumFeatures, handleLessonSelect]);

  const lessonToView = useMemo(() => {
    if (!selectedLesson) return null;
    if (!canAccessPremiumFeatures && !selectedLesson.is_free) {
      return {
        isLocked: true,
        id: selectedLesson.id
      };
    }
    return selectedLesson;
  }, [selectedLesson, canAccessPremiumFeatures]);

  const allCategoryAndUncategorizedIds = useMemo(() => {
    const ids = categories.map(c => c.id?.toString()).filter(Boolean);
    if (lessons.some(l => !l.category_id)) {
      ids.push('uncategorized');
    }
    return ids;
  }, [categories, lessons]);

  const progressByLevel = useMemo(() => {
    const progressData = {};
    levelFilters.forEach(level => {
      const levelLessons = lessons.filter(l => l.level === level.id);
      const total = levelLessons.length;
      const completed = levelLessons.filter(l => lessonProgress.has(l.id)).length;
      progressData[level.id] = {
        total,
        completed,
        percentage: total > 0 ? completed / total * 100 : 0
      };
    });
    return progressData;
  }, [lessons, lessonProgress]);

  const handleBack = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const playlistProps = useMemo(() => ({
    selectedLevel,
    setSelectedLevel,
    structuredLessons,
    allCategoryAndUncategorizedIds,
    canAccessPremiumFeatures,
    selectedLesson,
    lessonProgress,
    handleLessonSelect
  }), [selectedLevel, structuredLessons, allCategoryAndUncategorizedIds, canAccessPremiumFeatures, selectedLesson, lessonProgress, handleLessonSelect]);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Seo 
        title="Video Dersler" 
        description="İngilizce öğrenme yolculuğunuzu video derslerle destekleyin. Her seviyeye uygun konu anlatımlarını izleyin, notlar alın ve pratik yapın." 
        url="/lessons" 
        keywords="İngilizce video dersler, İngilizce konu anlatımı, İngilizce gramer, online İngilizce dersleri" 
      />
      <LessonHeaderPanel progressByLevel={progressByLevel} selectedLevel={selectedLevel} onBack={handleBack} />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : isMobile ? (
            <>
              <div id="lesson-view-container">
                <LessonViewer lessonToView={lessonToView} handleLessonEnd={handleLessonEnd} />
              </div>
              <Playlist {...playlistProps} />
            </>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
              <div className="lg:col-span-2 mb-8 lg:mb-0" id="lesson-view-container">
                <LessonViewer lessonToView={lessonToView} handleLessonEnd={handleLessonEnd} />
              </div>
              <div className="lg:col-span-1 lg:sticky lg:top-24">
                <Playlist {...playlistProps} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LessonsPage;