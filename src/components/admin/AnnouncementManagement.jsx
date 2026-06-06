import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Megaphone, Plus } from 'lucide-react';

const AnnouncementManagement = ({ 
  announcements, 
  announcementForm, 
  setAnnouncementForm, 
  onAddAnnouncement 
}) => {
  const typeOptions = [
    { value: 'info', label: 'Bilgi', variant: 'default' },
    { value: 'warning', label: 'Uyarı', variant: 'secondary' },
    { value: 'success', label: 'Başarı', variant: 'default' },
    { value: 'error', label: 'Hata', variant: 'destructive' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Megaphone className="h-5 w-5 mr-2" />
            Duyuru Ekle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="announcement-title">Başlık</Label>
            <Input
              id="announcement-title"
              value={announcementForm.title}
              onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
              placeholder="Duyuru başlığı"
              maxLength={100}
            />
          </div>
          <div>
            <Label htmlFor="announcement-content">İçerik</Label>
            <Textarea
              id="announcement-content"
              value={announcementForm.content}
              onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
              placeholder="Duyuru içeriği"
              maxLength={1000}
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {announcementForm.content.length}/1000 karakter
            </p>
          </div>
          <div>
            <Label htmlFor="announcement-type">Tip</Label>
            <Select value={announcementForm.type} onValueChange={(value) => setAnnouncementForm({...announcementForm, type: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={onAddAnnouncement}
            disabled={!announcementForm.title.trim() || !announcementForm.content.trim()}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Duyuru Ekle
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mevcut Duyurular ({announcements.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Henüz duyuru eklenmemiş.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="font-medium">{announcement.title}</p>
                        <Badge variant={announcement.type === 'error' ? 'destructive' : 'default'}>
                          {typeOptions.find(t => t.value === announcement.type)?.label || announcement.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {announcement.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(announcement.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementManagement;