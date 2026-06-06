import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { User, Shield, Bell, Palette, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/settings', label: 'Profil', icon: User },
  { to: '/settings/security', label: 'Güvenlik', icon: Shield },
  { to: '/settings/notifications', label: 'Bildirimler', icon: Bell },
  { to: '/settings/appearance', label: 'Görünüm', icon: Palette },
  { to: '/settings/subscription', label: 'Abonelik', icon: Crown },
];

const SettingsSidebar = () => {
  return (
    <aside className="hidden md:block w-56">
      <nav className="flex flex-col space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end>
            {({ isActive }) => (
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SettingsSidebar;