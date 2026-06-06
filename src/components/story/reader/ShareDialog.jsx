import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ShareButtons from '@/components/ShareButtons';

const ShareDialog = ({ open, onOpenChange, story }) => {
  if (!story) return null;
  const url = `https://hikayego.com/story/${story.slug}`;
  const title = story.title;
  const text = `HikayeGO'da "${story.title}" adlı bu harika hikayeye göz at!`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hikayeyi Paylaş</DialogTitle>
          <DialogDescription>
            Bu harika hikayeyi arkadaşlarınla paylaşarak onların da öğrenmesine yardımcı ol!
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ShareButtons url={url} title={title} text={text} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;