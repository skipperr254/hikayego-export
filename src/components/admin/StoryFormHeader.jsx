import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

const StoryFormHeader = ({ editingStory }) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          {editingStory ? 'Hikaye Düzenle' : 'Yeni Hikaye Ekle'}
        </div>
      </CardTitle>
    </CardHeader>
  );
};

export default StoryFormHeader;