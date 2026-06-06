import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Star, Smile, Volume2, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const StoryList = ({ stories, onEditStory, onDeleteStory, onGenerateAudio, generatingStoryId }) => {
  // Derive audio completeness from the story_sections join data.
  const getAudioStatus = (story) => {
    const sections = story.story_sections;
    if (!sections || sections.length === 0) return 'none';
    const withAudio = sections.filter((s) => s.audio_url).length;
    if (withAudio === 0) return 'none';
    if (withAudio === sections.length) return 'complete';
    return 'partial';
  };

  const getLevelLabel = (level) => {
    const levelMap = {
      'a1': 'A1 - Başlangıç',
      'a2': 'A2 - Temel',
      'b1': 'B1 - Orta Alt',
      'b2': 'B2 - Orta Üst',
      'c1': 'C1 - İleri',
      // Legacy support
      'beginner': 'Başlangıç',
      'intermediate': 'Orta',
      'advanced': 'İleri'
    };
    return levelMap[level] || level?.toUpperCase();
  };

  const getLevelColor = (level) => {
    const colorMap = {
      'a1': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'a2': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'b1': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'b2': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'c1': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      // Legacy support
      'beginner': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'advanced': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colorMap[level] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mevcut Hikayeler ({stories.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {stories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Henüz hikaye eklenmemiş.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stories.map((story) => (
              <div key={story.id} className="border rounded-lg p-4 space-y-3 relative">
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  {story.is_for_kids && (
                    <div className="p-1 bg-sky-400 rounded-full text-white" title="Çocuklar İçin">
                      <Smile className="h-4 w-4" />
                    </div>
                  )}
                  {story.is_featured && (
                    <div className="p-1 bg-amber-400 rounded-full text-white" title="Öne Çıkan">
                      <Star className="h-4 w-4" />
                    </div>
                  )}
                  {(() => {
                    const audioStatus = getAudioStatus(story);
                    if (audioStatus === 'complete') {
                      return (
                        <div className="p-1 bg-emerald-500 rounded-full text-white" title="Ses Hazır">
                          <Volume2 className="h-4 w-4" />
                        </div>
                      );
                    }
                    if (audioStatus === 'partial') {
                      return (
                        <div className="p-1 bg-yellow-400 rounded-full text-white" title="Ses Kısmen Hazır">
                          <Volume2 className="h-4 w-4" />
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
                {/* Story Image */}
                {story.image_url && (
                  <div className="w-full h-32 rounded-md overflow-hidden">
                    <img
                      src={story.image_url}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Story Header */}
                <div className="flex items-start justify-between">
                  <h3 className="font-medium line-clamp-2 flex-1 mr-2">{story.title}</h3>
                  <Badge className={getLevelColor(story.level)}>
                    {getLevelLabel(story.level)}
                  </Badge>
                </div>

                {/* Story Description */}
                {story.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {story.description}
                  </p>
                )}

                {/* Story Content Preview */}
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {story.content?.substring(0, 100)}...
                </p>

                {/* Story Meta */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{story.read_time || '5 dk'}</span>
                  <span>
                    {new Date(story.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditStory(story)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Düzenle
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" className="flex-1">
                          <Trash2 className="h-3 w-3 mr-1" />
                          Sil
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hikayeyi Sil</AlertDialogTitle>
                          <AlertDialogDescription>
                            "{story.title}" hikayesini silmek istediğinizden emin misiniz?
                            Bu işlem geri alınamaz ve hikayeye ait tüm veriler silinecektir.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteStory(story.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  {onGenerateAudio && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onGenerateAudio(story)}
                      disabled={generatingStoryId === story.id}
                      className="w-full"
                    >
                      {generatingStoryId === story.id ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Volume2 className="h-3 w-3 mr-1" />
                      )}
                      {generatingStoryId === story.id ? 'Oluşturuluyor...' : 'Ses Oluştur'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StoryList;