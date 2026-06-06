import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileImage as ImageIcon } from 'lucide-react';
import AuthSlideManagement from '@/components/admin/AuthSlideManagement';

const AdminSettings = () => {
  return (
    <Tabs defaultValue="slides" className="space-y-6">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="slides">
          <ImageIcon className="mr-2 h-4 w-4" />
          Giriş/Kayıt Sayfası Slaytları
        </TabsTrigger>
      </TabsList>
      <TabsContent value="slides">
        <Card>
          <CardHeader>
            <CardTitle>Slayt ve Yorum Yönetimi</CardTitle>
            <CardDescription>
              Giriş ve Kayıt sayfalarında gösterilecek etkileyici slaytları ve kullanıcı yorumlarını buradan yönetin. En fazla 5 slayt ekleyebilirsiniz.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthSlideManagement />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminSettings;