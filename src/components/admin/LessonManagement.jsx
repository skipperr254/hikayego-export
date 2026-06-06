import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Plus, Edit, Trash2, Loader2, GripVertical, ChevronDown, ChevronUp, ArrowUp, ArrowDown } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';

const levelOptions = [
  { value: 'a1', label: 'A1 - Başlangıç' },
  { value: 'a2', label: 'A2 - Temel' },
  { value: 'b1', label: 'B1 - Orta Alt' },
  { value: 'b2', label: 'B2 - Orta Üst' },
  { value: 'c1', label: 'C1 - İleri' }
];

const CategoryForm = ({ level, onCategoryAdded }) => {
    const [name, setName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const { toast } = useToast();

    const handleCreate = async () => {
        if (!name.trim()) return;
        setIsCreating(true);
        try {
            const { data, error } = await supabase
                .from('lesson_categories')
                .insert({ name, level })
                .select()
                .single();
            if (error) throw error;
            onCategoryAdded(data);
            setName('');
            toast({ title: 'Kategori oluşturuldu!', description: `"${name}" kategorisi eklendi.` });
        } catch (error) {
            toast({ title: 'Hata', description: 'Kategori oluşturulamadı.', variant: 'destructive' });
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="flex gap-2 items-center p-2 border-t mt-2">
            <Input 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Yeni kategori adı"
                className="flex-grow"
                disabled={isCreating}
            />
            <Button onClick={handleCreate} size="sm" disabled={isCreating || !name.trim()}>
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
        </div>
    );
};

const LessonForm = ({ lesson, categories, onSave, onCancel, isProcessing, onCategoryAdded }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(
    lesson || {
      title: '',
      description: '',
      level: 'a1',
      video_url: '',
      video_id: '',
      video_type: 'youtube',
      is_free: false,
      category_id: null,
      position: null,
    }
  );
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getYouTubeVideoId = (url) => {
    try {
      if (!url) return null;
      const urlObj = new URL(url);
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
      }
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      }
    } catch (e) {}
    return null;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 500 * 1024 * 1024) { // 500MB limit
            toast({ title: "Dosya çok büyük", description: "Lütfen 500MB'dan küçük bir video dosyası yükleyin.", variant: "destructive"});
            return;
        }
        setVideoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let lessonPayload = { ...formData, category_id: formData.category_id === 'none' ? null : formData.category_id };
    
    if (lessonPayload.video_type === 'youtube') {
        const video_id = getYouTubeVideoId(formData.video_url);
        if (!video_id) {
            toast({ title: 'Geçersiz YouTube Linki', description: 'Lütfen geçerli bir YouTube video linki girin.', variant: 'destructive'});
            return;
        }
        lessonPayload.video_id = video_id;
        lessonPayload.video_url = null;
    } else if (lessonPayload.video_type === 'native') {
        if (!videoFile && !lessonPayload.video_url) {
            toast({ title: 'Video Eksik', description: 'Lütfen bir video dosyası yükleyin.', variant: 'destructive'});
            return;
        }
        lessonPayload.video_id = null;
    }

    onSave(lessonPayload, videoFile);
  };
  
  const levelCategories = categories.filter(c => c.level === formData.level);

  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle>{lesson ? 'Dersi Düzenle' : 'Yeni Ders Ekle'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Ders Başlığı</Label>
              <Input id="title" placeholder="Ders Başlığı" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} required />
            </div>
            <div>
              <Label>Video Kaynağı</Label>
              <RadioGroup defaultValue="youtube" value={formData.video_type} onValueChange={(value) => handleChange('video_type', value)} className="flex items-center space-x-4 pt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="youtube" id="youtube"/>
                  <Label htmlFor="youtube">YouTube Linki</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="native" id="native"/>
                  <Label htmlFor="native">Video Yükle</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          {formData.video_type === 'youtube' ? (
            <div>
              <Label htmlFor="video_url_youtube">YouTube Linki</Label>
              <Input id="video_url_youtube" placeholder="https://www.youtube.com/watch?v=..." value={formData.video_url} onChange={(e) => handleChange('video_url', e.target.value)} required={formData.video_type === 'youtube'} />
            </div>
          ) : (
             <div>
                <Label htmlFor="video_file">Video Dosyası</Label>
                <div className="flex items-center gap-4">
                    <Input id="video_file" type="file" accept="video/mp4,video/webm" onChange={handleFileChange} className="flex-grow" />
                    {isProcessing && <div className="w-24"><Progress value={uploadProgress} /></div>}
                </div>
                {videoFile && <p className="text-sm text-muted-foreground mt-2">Seçilen dosya: {videoFile.name}</p>}
                {formData.video_url && !videoFile && <p className="text-sm text-muted-foreground mt-2">Mevcut video yüklü. Değiştirmek için yeni dosya seçin.</p>}
            </div>
          )}

          <div>
            <Label htmlFor="description">Açıklama</Label>
            <Textarea id="description" placeholder="Açıklama" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Seviye</Label>
              <Select value={formData.level} onValueChange={(value) => handleChange('level', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {levelOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <div>
                <Label>Kategori</Label>
                <Select value={formData.category_id || 'none'} onValueChange={(value) => handleChange('category_id', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Kategorisiz</SelectItem>
                        {levelCategories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <CategoryForm level={formData.level} onCategoryAdded={onCategoryAdded} />
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Switch id="is_free" checked={formData.is_free} onCheckedChange={(checked) => handleChange('is_free', checked)} />
            <Label htmlFor="is_free">Herkes için ücretsiz ders</Label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>İptal</Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {lesson ? 'Güncelle' : 'Dersi Ekle'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const SortableLessonItem = ({ id, lesson, categoryName, onEdit, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    const imageUrl = lesson.video_type === 'youtube' && lesson.video_id 
        ? `https://i.ytimg.com/vi/${lesson.video_id}/mqdefault.jpg` 
        : `https://placehold.co/120x90/000000/FFFFFF?text=${lesson.title.charAt(0)}`;

    return (
        <div ref={setNodeRef} style={style} className={cn("flex items-center gap-2 p-2 rounded-md bg-background", isDragging && "shadow-lg opacity-50")}>
            <Button variant="ghost" size="sm" {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
            </Button>
            <img className="w-20 h-12 object-cover rounded" alt={lesson.title} src={imageUrl} />
            <div className="flex-grow">
                <p className="font-semibold">{lesson.title}</p>
                <p className="text-xs text-muted-foreground">{categoryName}</p>
            </div>
            <Badge variant={lesson.video_type === 'youtube' ? 'destructive' : 'secondary'}>{lesson.video_type}</Badge>
            {lesson.is_free && <Badge className="bg-green-500 text-white">Ücretsiz</Badge>}
            <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(lesson)}><Edit className="h-4 w-4" /></Button>
                <Button variant="destructive" size="icon" onClick={() => onDelete(lesson)}><Trash2 className="h-4 w-4" /></Button>
            </div>
        </div>
    );
};

const SortableCategory = ({ category, lessons, onEdit, onDelete, onMoveCategory, onDeleteCategory, isFirst, isLast }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id, data: { type: 'category', level: category.level } });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className={cn(isDragging && "opacity-50")}>
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-t-md">
                <Button variant="ghost" size="sm" {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </Button>
                <h3 className="font-semibold text-lg flex-grow">{category.name}</h3>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onMoveCategory(category.id, 'up')} disabled={isFirst}>
                        <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onMoveCategory(category.id, 'down')} disabled={isLast}>
                        <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDeleteCategory(category.id, category.name, lessons.length)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            </div>
            <SortableContext items={lessons.map(l => l.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 border-l-2 border-primary/20 pl-4 py-2 rounded-b-md border min-h-[50px]">
                    {lessons.map(lesson => (
                        <SortableLessonItem
                            key={lesson.id}
                            id={lesson.id}
                            lesson={lesson}
                            categoryName={category.name}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                    {lessons.length === 0 && <p className="text-sm text-muted-foreground p-2 text-center">Dersleri buraya sürükleyin</p>}
                </div>
            </SortableContext>
        </div>
    );
};

const LessonManagement = ({ lessons, categories, onAddLesson, onUpdateLesson, onDeleteLesson, onCategoryAdded, onUpdateLessonOrder }) => {
  const [editingLesson, setEditingLesson] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [openLevels, setOpenLevels] = useState({});
  const [activeLessons, setActiveLessons] = useState(lessons);
  const [activeCategories, setActiveCategories] = useState(categories);
  const [activeDragItem, setActiveDragItem] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    setActiveLessons(lessons);
  }, [lessons]);

  useEffect(() => {
    setActiveCategories(categories);
  }, [categories]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const toggleLevel = (level) => {
    setOpenLevels(prev => ({...prev, [level]: !prev[level]}));
  };

  const handleSave = async (lessonData, videoFile) => {
    setIsProcessing(true);
    let finalLessonData = { ...lessonData };
    
    if (lessonData.video_type === 'youtube') {
        finalLessonData.video_url = null;
    }

    try {
        if (lessonData.video_type === 'native' && videoFile) {
            const fileExt = videoFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `lesson-videos/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('lessons')
                .upload(filePath, videoFile);

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
                .from('lessons')
                .getPublicUrl(filePath);
            
            finalLessonData.video_url = publicUrlData.publicUrl;
        }

        if (editingLesson) {
            const { data, error } = await supabase.from('lessons').update(finalLessonData).eq('id', editingLesson.id).select().single();
            if (error) throw error;
            onUpdateLesson(data);
            toast({ title: "Başarılı", description: "Ders güncellendi." });
        } else {
            const { data, error } = await supabase.from('lessons').insert(finalLessonData).select().single();
            if (error) throw error;
            onAddLesson(data);
            toast({ title: "Başarılı", description: "Ders eklendi." });
        }
        setIsFormVisible(false);
        setEditingLesson(null);
    } catch (error) {
        toast({ title: "Hata", description: "İşlem başarısız: " + error.message, variant: "destructive" });
    } finally {
        setIsProcessing(false);
    }
  };
  
  const handleEdit = (lesson) => {
    const lessonWithVideoUrl = {
      ...lesson,
      video_url: lesson.video_type === 'youtube' ? `https://www.youtube.com/watch?v=${lesson.video_id}` : lesson.video_url
    }
    setEditingLesson(lessonWithVideoUrl);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (lesson) => {
    setLessonToDelete(lesson);
  };

  const confirmDelete = async () => {
    if (!lessonToDelete) return;
    setIsProcessing(true);
    try {
      if (lessonToDelete.video_type === 'native' && lessonToDelete.video_url) {
        const filePath = new URL(lessonToDelete.video_url).pathname.split('/lessons/')[1];
        await supabase.storage.from('lessons').remove([filePath]);
      }
      await onDeleteLesson(lessonToDelete.id);
      setLessonToDelete(null);
    } catch(error) {
       toast({ title: "Hata", description: "Ders silinemedi: " + error.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteCategory = (categoryId, categoryName, lessonCount) => {
    if (lessonCount > 0) {
      toast({
        title: 'Kategori Silinemez',
        description: `"${categoryName}" kategorisinde dersler bulunduğu için silinemez. Lütfen önce dersleri başka bir kategoriye taşıyın.`,
        variant: 'destructive',
      });
      return;
    }
    setCategoryToDelete({ id: categoryId, name: categoryName });
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsProcessing(true);
    try {
      const { error } = await supabase.from('lesson_categories').delete().eq('id', categoryToDelete.id);
      if (error) throw error;
      
      setActiveCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
      toast({ title: 'Kategori Silindi', description: `"${categoryToDelete.name}" kategorisi başarıyla silindi.` });
      setCategoryToDelete(null);
    } catch (error) {
      toast({ title: 'Hata', description: 'Kategori silinemedi: ' + error.message, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddNew = () => {
    setEditingLesson(null);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setEditingLesson(null);
    setIsFormVisible(false);
  };
  
  const lessonsByLevelAndCategory = useMemo(() => {
    const structured = {};
    levelOptions.forEach(level => {
        const levelCategories = activeCategories.filter(c => c.level === level.value).sort((a, b) => a.position - b.position);
        const levelLessons = activeLessons.filter(l => l.level === level.value);

        const categoriesWithLessons = levelCategories.map(cat => ({
            ...cat,
            lessons: levelLessons.filter(l => l.category_id === cat.id).sort((a, b) => a.position - b.position)
        }));

        const uncategorizedLessons = levelLessons.filter(l => !l.category_id).sort((a, b) => a.position - b.position);
        if (uncategorizedLessons.length > 0) {
            categoriesWithLessons.push({ id: null, name: 'Kategorisiz', lessons: uncategorizedLessons, level: level.value });
        }
        structured[level.value] = categoriesWithLessons;
    });
    return structured;
  }, [activeLessons, activeCategories]);

  const handleDragStart = (event) => {
    setActiveDragItem(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveDragItem(null);
    const { active, over } = event;

    if (!over || active.id === over.id) return;
    
    const isCategoryDrag = active.data.current?.type === 'category';
    const isLessonDrag = !isCategoryDrag;

    if (isCategoryDrag) {
        const level = active.data.current?.level;
        const levelCategories = activeCategories.filter(c => c.level === level && c.id !== null).sort((a, b) => a.position - b.position);
        const oldIndex = levelCategories.findIndex(c => c.id === active.id);
        const newIndex = levelCategories.findIndex(c => c.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const reordered = arrayMove(levelCategories, oldIndex, newIndex);
        const updates = reordered.map((cat, index) => ({ ...cat, position: index }));
        const otherCategories = activeCategories.filter(c => c.level !== level || c.id === null);

        setActiveCategories([...otherCategories, ...updates]);
        onUpdateLessonOrder(null, updates.map(({id, position}) => ({id, position})));
    }

    if (isLessonDrag) {
        const activeLesson = activeLessons.find(l => l.id === active.id);
        if (!activeLesson) return;

        const overId = over.id;
        const overCategory = findCategoryForId(overId);
        const activeCategory = findCategoryForId(active.id);

        if (!activeCategory) return;
        
        let newCategoryId = activeLesson.category_id;
        let newLevel = activeLesson.level;

        if (overCategory) {
          newCategoryId = overCategory.id;
          newLevel = overCategory.level;
        }

        const sourceItems = activeCategory.lessons;
        const destinationItems = overCategory ? overCategory.lessons : [];

        const activeIndex = sourceItems.findIndex(l => l.id === active.id);
        let overIndex;

        if (overCategory && overCategory.id === activeCategory.id) { // Same category
             overIndex = destinationItems.findIndex(l => l.id === over.id);
             if (activeIndex === overIndex) return;
             const reorderedLessons = arrayMove(sourceItems, activeIndex, overIndex);
             const newLessonList = activeLessons.map(l => {
                 const updated = reorderedLessons.find(rl => rl.id === l.id);
                 if (updated) return { ...l, position: reorderedLessons.indexOf(updated) };
                 return l;
             });
             setActiveLessons(newLessonList);
             onUpdateLessonOrder(newLessonList.filter(l => l.category_id === newCategoryId));
        } else { // Different category
            const [movedLesson] = sourceItems.splice(activeIndex, 1);
            movedLesson.category_id = newCategoryId;
            movedLesson.level = newLevel;
            
            overIndex = destinationItems.findIndex(l => l.id === over.id);
            if (overIndex !== -1) {
              destinationItems.splice(overIndex, 0, movedLesson);
            } else {
              destinationItems.push(movedLesson);
            }
            
            const reorderedSource = sourceItems.map((l, i) => ({...l, position: i}));
            const reorderedDest = destinationItems.map((l, i) => ({...l, position: i}));

            const finalLessons = activeLessons.filter(l => l.category_id !== activeCategory.id && l.category_id !== newCategoryId)
              .concat(reorderedSource)
              .concat(reorderedDest);

            setActiveLessons(finalLessons);
            onUpdateLessonOrder(reorderedSource);
            onUpdateLessonOrder(reorderedDest);
        }
    }
  };

  const handleMoveCategory = (categoryId, direction) => {
    const category = activeCategories.find(c => c.id === categoryId);
    if (!category) return;

    const levelCategories = activeCategories
      .filter(c => c.level === category.level && c.id !== null)
      .sort((a, b) => a.position - b.position);

    const currentIndex = levelCategories.findIndex(c => c.id === categoryId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= levelCategories.length) return;

    const reordered = arrayMove(levelCategories, currentIndex, newIndex);
    const updates = reordered.map((cat, index) => ({ ...cat, position: index }));
    const otherCategories = activeCategories.filter(c => c.level !== category.level || c.id === null);

    const newActiveCategories = [...otherCategories, ...updates];
    setActiveCategories(newActiveCategories);
    onUpdateLessonOrder(null, updates.map(({id, position}) => ({id, position})));
  };

  const findCategoryForId = (id) => {
    for (const level in lessonsByLevelAndCategory) {
        for (const category of lessonsByLevelAndCategory[level]) {
            if (category.id === id) return category; // It's a category drop zone
            if (category.lessons.some(l => l.id === id)) return category;
        }
    }
    return null;
  };
  
  const draggedItem = useMemo(() => {
    if(!activeDragItem) return null;
    return activeLessons.find(l => l.id === activeDragItem);
  }, [activeDragItem, activeLessons]);


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ders Yönetimi</h2>
        {!isFormVisible && <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Yeni Ders Ekle</Button>}
      </div>

      {isFormVisible && (
        <LessonForm lesson={editingLesson} categories={categories} onSave={handleSave} onCancel={handleCancel} isProcessing={isProcessing} onCategoryAdded={onCategoryAdded} />
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="space-y-4">
          {levelOptions.map(level => (
            <Card key={level.value}>
              <CardHeader onClick={() => toggleLevel(level.value)} className="cursor-pointer flex flex-row items-center justify-between">
                <CardTitle>{level.label}</CardTitle>
                {openLevels[level.value] ? <ChevronUp /> : <ChevronDown />}
              </CardHeader>
              {openLevels[level.value] && (
                <CardContent>
                    <SortableContext items={lessonsByLevelAndCategory[level.value].filter(c => c.id !== null).map(c => c.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-4">
                        {lessonsByLevelAndCategory[level.value].map((category, index, arr) => {
                          if (category.id === null) return null; // Skip uncategorized
                          const isFirst = index === 0;
                          const isLast = index === arr.filter(c => c.id !== null).length - 1;
                          return (
                            <SortableCategory
                              key={category.id}
                              category={category}
                              lessons={category.lessons}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              onMoveCategory={handleMoveCategory}
                              onDeleteCategory={handleDeleteCategory}
                              isFirst={isFirst}
                              isLast={isLast}
                            />
                          );
                        })}
                      </div>
                    </SortableContext>
                    {lessonsByLevelAndCategory[level.value].find(c => c.id === null) && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-t-md">
                          <h3 className="font-semibold text-lg flex-grow">Kategorisiz</h3>
                        </div>
                        <div className="space-y-2 border-l-2 border-dashed border-muted-foreground/20 pl-4 py-2 rounded-b-md border">
                          {lessonsByLevelAndCategory[level.value].find(c => c.id === null).lessons.map(lesson => (
                            <SortableLessonItem
                              key={lesson.id}
                              id={lesson.id}
                              lesson={lesson}
                              categoryName="Kategorisiz"
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
        <DragOverlay>
            {draggedItem ? <SortableLessonItem id={draggedItem.id} lesson={draggedItem} categoryName="" /> : null}
        </DragOverlay>
      </DndContext>
      
       <AlertDialog open={!!lessonToDelete} onOpenChange={(isOpen) => !isOpen && setLessonToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              "{lessonToDelete?.title}" dersini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90" disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Evet, Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!categoryToDelete} onOpenChange={(isOpen) => !isOpen && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kategoriyi Silmek İstediğinize Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              "{categoryToDelete?.name}" kategorisini silmek üzeresiniz. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCategory} className="bg-destructive hover:bg-destructive/90" disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Evet, Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LessonManagement;