import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Crown, BookOpen, Youtube, Calendar } from 'lucide-react';

const AdminStats = ({ users, stories, lessons }) => {
  const getStats = () => {
    const totalUsers = users.length;
    const premiumUsers = users.filter(u => u.subscription).length;
    const totalStories = stories.length;
    const totalLessons = lessons.length;
    const recentUsers = users.filter(u => {
      const createdAt = new Date(u.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdAt > weekAgo;
    }).length;

    return { totalUsers, premiumUsers, totalStories, totalLessons, recentUsers };
  };

  const stats = getStats();

  const statCards = [
    {
      title: 'Toplam Kullanıcı',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'Premium Üyeler',
      value: stats.premiumUsers,
      icon: Crown,
      color: 'text-amber-500'
    },
    {
      title: 'Toplam Hikaye',
      value: stats.totalStories,
      icon: BookOpen,
      color: 'text-green-500'
    },
    {
      title: 'Toplam Ders',
      value: stats.totalLessons,
      icon: Youtube,
      color: 'text-red-500'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStats;