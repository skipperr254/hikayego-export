import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Plus, Trash2, Loader2 } from 'lucide-react';
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

const TestimonialManagement = ({ 
  testimonials, 
  testimonialForm, 
  setTestimonialForm, 
  onAddTestimonial, 
  onDeleteTestimonial,
  isProcessing
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Yorum Ekle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="testimonial-name">İsim</Label>
            <Input
              id="testimonial-name"
              value={testimonialForm.name}
              onChange={(e) => setTestimonialForm({...testimonialForm, name: e.target.value})}
              placeholder="Kullanıcı adı"
              maxLength={50}
              disabled={isProcessing}
            />
          </div>
          <div>
            <Label htmlFor="testimonial-comment">Yorum</Label>
            <Textarea
              id="testimonial-comment"
              value={testimonialForm.comment}
              onChange={(e) => setTestimonialForm({...testimonialForm, comment: e.target.value})}
              placeholder="Kullanıcı yorumu"
              maxLength={500}
              rows={4}
              disabled={isProcessing}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {testimonialForm.comment.length}/500 karakter
            </p>
          </div>
          <Button 
            onClick={onAddTestimonial}
            disabled={!testimonialForm.name.trim() || !testimonialForm.comment.trim() || isProcessing}
            className="w-full"
          >
            {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            {isProcessing ? 'Ekleniyor...' : 'Yorum Ekle'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mevcut Yorumlar ({testimonials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {testimonials.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Henüz yorum eklenmemiş.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                        "{testimonial.comment}"
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(testimonial.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" disabled={isProcessing}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Yorumu Sil</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteTestimonial(testimonial.id)}
                            className="bg-destructive hover:bg-destructive/90"
                            disabled={isProcessing}
                          >
                           {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

export default TestimonialManagement;