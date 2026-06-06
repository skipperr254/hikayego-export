import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import Seo from '@/components/Seo';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();

  if (loading || !initialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    const userRole = user.role;
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!allowedRoles.includes(userRole)) {
      return (
        <>
          <Seo title="Yetkisiz Erişim" description="Bu sayfaya erişim yetkiniz bulunmamaktadır." />
          <div className="flex h-screen flex-col items-center justify-center bg-background text-center">
            <h1 className="text-4xl font-bold text-destructive mb-4">403 - Yetkisiz Erişim</h1>
            <p className="text-muted-foreground mb-8">Üzgünüz, bu sayfayı görüntüleme yetkiniz yok.</p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Geri Dön
            </button>
          </div>
        </>
      );
    }
  }

  return children;
};

export default ProtectedRoute;