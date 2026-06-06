import React from 'react';
import SlideEditor from './SlideEditor';

const AuthSlideImageManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Giriş/Kayıt Sayfası Slide Görselleri</h2>
        <p className="text-muted-foreground">
          Giriş ve kayıt sayfalarında kullanılan slide görsellerini, metinlerini ve gradyantlarını yönetin. Bu slide'lar her iki sayfada da aynı şekilde görüntülenir.
        </p>
      </div>

      <SlideEditor />
    </div>
  );
};

export default AuthSlideImageManagement;