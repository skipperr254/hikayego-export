import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const StoryFormFields = ({ storyForm, setStoryForm }) => {
  const levelOptions = [
    { value: 'a1', label: 'A1 - Başlangıç' },
    { value: 'a2', label: 'A2 - Temel' },
    { value: 'b1', label: 'B1 - Orta' },
    { value: 'b2', label: 'B2 - Orta Üstü' },
    { value: 'c1', label: 'C1 - İleri' }
  ];

  const categoryOptions = [
    { value: 'adventure', label: 'Macera' },
    { value: 'fantasy', label: 'Fantastik' },
    { value: 'sci-fi', label: 'Bilim Kurgu' },
    { value: 'mystery', label: 'Gizem' },
    { value: 'romance', label: 'Romantizm' },
    { value: 'history', label: 'Tarihi' },
    { value: 'comedy', label: 'Komedi' },
    { value: 'drama', label: 'Dram' },
    { value: 'thriller', label: 'Gerilim' },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="story-title">Başlık *</Label>
          <Input
            id="story-title"
            value={storyForm.title}
            onChange={(e) => setStoryForm({...storyForm, title: e.target.value})}
            placeholder="Hikaye başlığı"
            maxLength={100}
          />
        </div>
        <div>
          <Label htmlFor="story-read-time">Okuma Süresi</Label>
          <Input
            id="story-read-time"
            value={storyForm.read_time}
            onChange={(e) => setStoryForm({...storyForm, read_time: e.target.value})}
            placeholder="5 dk"
            maxLength={20}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="story-level">Seviye *</Label>
          <Select value={storyForm.level} onValueChange={(value) => setStoryForm({...storyForm, level: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {levelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="story-category">Hikaye Türü *</Label>
          <Select value={storyForm.category || 'adventure'} onValueChange={(value) => setStoryForm({...storyForm, category: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Tür seçin" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="story-description">Açıklama</Label>
        <Textarea
          id="story-description"
          value={storyForm.description}
          onChange={(e) => setStoryForm({...storyForm, description: e.target.value})}
          placeholder="Hikaye hakkında kısa açıklama"
          maxLength={300}
          rows={3}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {storyForm.description.length}/300 karakter
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="story-content">İçerik *</Label>
          <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
            Boşluklar ve paragraflar (Enter) aynen korunur
          </span>
        </div>
        <Textarea
          id="story-content"
          value={storyForm.content}
          onChange={(e) => setStoryForm({...storyForm, content: e.target.value})}
          placeholder="Hikaye içeriği (minimum 50 karakter)&#10;Paragraflar arası boşluk bırakmak için Enter tuşunu kullanın."
          className="min-h-[300px] whitespace-pre-wrap leading-relaxed p-4 text-base font-medium resize-y font-story"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {storyForm.content.length} karakter {storyForm.content.length < 50 && '(minimum 50 karakter gerekli)'}
        </p>
      </div>

       <div className="flex items-center space-x-6 pt-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="is-featured"
              checked={storyForm.is_featured}
              onCheckedChange={(checked) => setStoryForm({ ...storyForm, is_featured: checked })}
            />
            <Label htmlFor="is-featured">Öne Çıkan Hikaye</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is-for-kids"
              checked={storyForm.is_for_kids}
              onCheckedChange={(checked) => setStoryForm({ ...storyForm, is_for_kids: checked })}
            />
            <Label htmlFor="is-for-kids">Çocuklar İçin</Label>
          </div>
        </div>
    </>
  );
};

export default StoryFormFields;