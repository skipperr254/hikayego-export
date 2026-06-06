import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, PenSquare, GraduationCap, MessageSquare, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminSidebar = ({ activeView, setActiveView }) => {
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';
  const isContentCreator = user && user.role === 'content_creator';

  const menuItems = [];

  if (isAdmin) {
    menuItems.push(
      { id: 'users', label: 'Kullanıcılar', icon: Users },
      { id: 'stories', label: 'Hikayeler', icon: BookOpen },
      { id: 'blog', label: 'Blog', icon: PenSquare },
      { id: 'lessons', label: 'Dersler', icon: GraduationCap },
      { id: 'testimonials', label: 'Yorumlar', icon: MessageSquare },
      { id: 'settings', label: 'Site Ayarları', icon: Settings }
    );
  } else if (isContentCreator) {
    menuItems.push(
      { id: 'stories', label: 'Hikayeler', icon: BookOpen },
      { id: 'blog', label: 'Blog', icon: PenSquare }
    );
  }

  return (
    <aside className="space-y-2">
      {menuItems.map((item) => (
        <Button
          key={item.id}
          variant={activeView === item.id ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setActiveView(item.id)}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.label}
        </Button>
      ))}
    </aside>
  );
};

export default AdminSidebar;