import React, { useState, memo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import LessonPlayer from './LessonPlayer';
import LessonNotes from './LessonNotes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Laptop as Notebook, Info } from 'lucide-react';
import { usePageVisibility } from '@/hooks/usePageVisibility';

const LessonView = memo(({ lesson, onLessonEnd }) => {
  const { user } = useAuth();
  const [player, setPlayer] = useState(null);
  const isVisible = usePageVisibility();

  const onPlayerReady = (event) => {
    setPlayer(event.target);
  };
  
  useEffect(() => {
    if (player && typeof player.getPlayerState === 'function') { // YouTube player
      const state = player.getPlayerState();
      if (!isVisible && state === 1) player.pauseVideo();
    } else if (player && typeof player.pause === 'function') { // Native video player
      if (!isVisible && !player.paused) player.pause();
    }
  }, [isVisible, player]);

  const handleNativeVideoEnd = () => {
    onLessonEnd(lesson.id);
  };
  
  return (
    <div className="space-y-6">
      <LessonPlayer 
        lesson={lesson} 
        onReady={onPlayerReady}
        onEnd={lesson.video_type === 'native' ? handleNativeVideoEnd : () => onLessonEnd(lesson.id)}
        key={lesson.id}
      />
      
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="description"><Info className="mr-2 h-4 w-4" /> Açıklama</TabsTrigger>
          <TabsTrigger value="notes"><Notebook className="mr-2 h-4 w-4" /> Notlarım</TabsTrigger>
        </TabsList>
        <TabsContent value="description">
          <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle>{lesson.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{lesson.description}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes">
           <LessonNotes lessonId={lesson.id} userId={user?.id} player={player} videoType={lesson.video_type}/>
        </TabsContent>
      </Tabs>
    </div>
  );
});

export default LessonView;