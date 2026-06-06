import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, Plus, Edit, Trash2, X, Check, Clock } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const formatTime = (seconds) => {
  if (seconds === null || isNaN(seconds)) return '00:00';
  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(14, 5);
};

const LessonNotes = ({ lessonId, userId, player, videoType }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const fetchNotes = useCallback(async () => {
    if (!userId || !lessonId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('lesson_notes')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .order('timestamp', { ascending: true });
    
    if (error) {
      console.error('Error fetching notes:', error);
    } else {
      setNotes(data);
    }
    setLoading(false);
  }, [lessonId, userId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setIsSaving(true);
    
    let currentTime = 0;
    if (player) {
      if (videoType === 'youtube' && typeof player.getCurrentTime === 'function') {
        currentTime = Math.floor(await player.getCurrentTime());
      } else if (videoType === 'native') {
        currentTime = Math.floor(player.currentTime);
      }
    }
    
    const { data, error } = await supabase
      .from('lesson_notes')
      .insert({ user_id: userId, lesson_id: lessonId, note: newNote, timestamp: currentTime })
      .select()
      .single();

    setIsSaving(false);
    if (error) {
      toast({ title: 'Hata', description: 'Not eklenemedi.', variant: 'destructive' });
    } else {
      setNotes([...notes, data].sort((a, b) => a.timestamp - b.timestamp));
      setNewNote('');
      toast({ title: 'Başarılı', description: 'Notunuz eklendi.' });
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !editingNote.note.trim()) return;
    setIsSaving(true);
    
    const { data, error } = await supabase
      .from('lesson_notes')
      .update({ note: editingNote.note, updated_at: new Date().toISOString() })
      .eq('id', editingNote.id)
      .select()
      .single();

    setIsSaving(false);
    if (error) {
      toast({ title: 'Hata', description: 'Not güncellenemedi.', variant: 'destructive' });
    } else {
      setNotes(notes.map(n => n.id === editingNote.id ? data : n));
      setEditingNote(null);
      toast({ title: 'Başarılı', description: 'Notunuz güncellendi.' });
    }
  };

  const handleDeleteNote = async (noteId) => {
    const { error } = await supabase
      .from('lesson_notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      toast({ title: 'Hata', description: 'Not silinemedi.', variant: 'destructive' });
    } else {
      setNotes(notes.filter(n => n.id !== noteId));
      toast({ title: 'Başarılı', description: 'Notunuz silindi.' });
    }
  };

  const seekTo = (time) => {
    if (player) {
      if (videoType === 'youtube' && typeof player.seekTo === 'function') {
        player.seekTo(time);
        player.playVideo();
      } else if (videoType === 'native') {
        player.currentTime = time;
        player.play();
      }
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle>Kişisel Notlarım</CardTitle>
        <CardDescription>Dersle ilgili önemli bulduğunuz anları ve bilgileri not alın.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <Textarea 
            placeholder="Yeni bir not ekle..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={isMobile ? 3 : 2}
            className="flex-grow bg-background/50 text-base"
          />
          <Button onClick={handleAddNote} disabled={isSaving || !newNote.trim()} className="w-full sm:w-auto text-base py-3">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Ekle
          </Button>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : notes.length > 0 ? notes.map(note => (
            <motion.div key={note.id} layout>
              {editingNote?.id === note.id ? (
                <div className="bg-secondary p-3 rounded-lg">
                  <Textarea value={editingNote.note} onChange={(e) => setEditingNote({...editingNote, note: e.target.value})} className="mb-2 bg-background" />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditingNote(null)}><X className="h-4 w-4" /></Button>
                    <Button size="sm" onClick={handleUpdateNote} disabled={isSaving}><Check className="h-4 w-4" /></Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/80 dark:hover:bg-secondary/50 transition-colors">
                  <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={() => seekTo(note.timestamp)}>
                    <Badge variant="outline" className="cursor-pointer">
                      <Clock className="mr-1.5 h-3 w-3" />
                      {formatTime(note.timestamp)}
                    </Badge>
                  </Button>
                  <p className="flex-grow text-sm text-muted-foreground py-1">{note.note}</p>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingNote({...note})}><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive-foreground hover:bg-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Notu silmek istediğinize emin misiniz?</AlertDialogTitle>
                          <AlertDialogDescription>Bu işlem geri alınamaz.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteNote(note.id)} className="bg-destructive hover:bg-destructive/90">Sil</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </motion.div>
          )) : (
            <p className="text-center text-muted-foreground py-4">Henüz not eklenmemiş.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonNotes;