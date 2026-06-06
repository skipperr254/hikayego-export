import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Crown, Mail, Calendar, CheckCircle, XCircle, AlertTriangle, Edit3, UserPlus, Loader2, Clock } from 'lucide-react';
import UserFilters from './UserFilters';
import UserActions from './UserActions';
import CreateUserDialog from './CreateUserDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const Countdown = ({ expiryDate }) => {
  const calculateRemainingTime = () => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) {
      return 'Süre Doldu';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let result = '';
    if (days > 0) result += `${days}g `;
    if (hours > 0) result += `${hours}s `;
    if (minutes > 0 && days === 0) result += `${minutes}d`;
    
    return result.trim() || 'Az Kaldı';
  };

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [expiryDate]);

  return (
    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
      <Clock className="h-3 w-3 mr-1" />
      {remainingTime}
    </Badge>
  );
};

const UserManagement = ({ users, onTogglePremium, onUpdateRole, onDeleteUser, onCreateUser, updatingUser, onRefresh, isRefreshing }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [isCreateUserOpen, setCreateUserOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (!user) return false;
      const matchesSearch = !searchTerm || 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      const matchesSubscription = subscriptionFilter === 'all' || 
        (subscriptionFilter === 'premium' && user.subscription) ||
        (subscriptionFilter === 'free' && !user.subscription);
      
      const matchesVerification = verificationFilter === 'all' ||
        (verificationFilter === 'verified' && user.email_confirmed_at) ||
        (verificationFilter === 'unverified' && !user.email_confirmed_at);
      
      return matchesSearch && matchesRole && matchesSubscription && matchesVerification;
    });
  }, [users, searchTerm, roleFilter, subscriptionFilter, verificationFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Bilinmiyor';
    try {
      const date = new Date(dateString);
      return isMobile
        ? date.toLocaleDateString('tr-TR')
        : date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
    } catch (error) {
      return 'Geçersiz tarih';
    }
  };

  const getUserRoleBadge = (user) => {
    if (user.role === 'admin') return <Badge variant="destructive"><Shield className="h-3 w-3 mr-1" />Admin</Badge>;
    if (user.role === 'content_creator') return <Badge variant="secondary" className="text-blue-800 bg-blue-100 dark:text-blue-200 dark:bg-blue-900"><Edit3 className="h-3 w-3 mr-1" />İçerik Üretici</Badge>;
    return <Badge variant="outline">Kullanıcı</Badge>;
  };

  const getUserSubscriptionBadge = (user) => {
    if (user.subscription) return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"><Crown className="h-3 w-3 mr-1" />Premium</Badge>;
    return <Badge variant="outline">Ücretsiz</Badge>;
  };

  const getUserVerificationBadge = (user) => {
    if (user.email_confirmed_at) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Doğrulanmış</Badge>;
    return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Doğrulanmamış</Badge>;
  };

  const DesktopUserList = () => (
    <div className="space-y-4">
      {filteredUsers.map((userData) => (
        <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
          <div className="flex items-center space-x-4 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userData.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${userData.email}`} />
              <AvatarFallback>{userData.name ? userData.name.charAt(0).toUpperCase() : userData.email.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <p className="font-medium text-lg truncate">{userData.name || 'İsimsiz Kullanıcı'}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {getUserRoleBadge(userData)}
                {getUserSubscriptionBadge(userData)}
                {getUserVerificationBadge(userData)}
                {userData.premium_expires_at && new Date(userData.premium_expires_at) > new Date() && <Countdown expiryDate={userData.premium_expires_at} />}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center"><Mail className="h-4 w-4 mr-2 flex-shrink-0" /><span className="truncate">{userData.email}</span></div>
                <div className="flex items-center"><Calendar className="h-4 w-4 mr-2 flex-shrink-0" /><span>Kayıt: {formatDate(userData.created_at)}</span></div>
                {userData.last_sign_in_at && <div className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 flex-shrink-0 text-green-500" /><span>Son giriş: {formatDate(userData.last_sign_in_at)}</span></div>}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 ml-4"><UserActions user={userData} onTogglePremium={onTogglePremium} onUpdateRole={onUpdateRole} onDeleteUser={onDeleteUser} isUpdating={updatingUser === userData.id} /></div>
        </div>
      ))}
    </div>
  );

  const MobileUserList = () => (
    <div className="space-y-4">
      {filteredUsers.map((userData) => (
        <Card key={userData.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userData.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${userData.email}`} />
                <AvatarFallback>{userData.name ? userData.name.charAt(0).toUpperCase() : userData.email.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{userData.name || 'İsimsiz'}</p>
                <p className="text-sm text-muted-foreground truncate">{userData.email}</p>
              </div>
            </div>
            <UserActions user={userData} onTogglePremium={onTogglePremium} onUpdateRole={onUpdateRole} onDeleteUser={onDeleteUser} isUpdating={updatingUser === userData.id} />
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {getUserRoleBadge(userData)}
            {getUserSubscriptionBadge(userData)}
            {getUserVerificationBadge(userData)}
            {userData.premium_expires_at && new Date(userData.premium_expires_at) > new Date() && <Countdown expiryDate={userData.premium_expires_at} />}
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Kayıt:</strong> {formatDate(userData.created_at)}</p>
            {userData.last_sign_in_at && <p><strong>Son Giriş:</strong> {formatDate(userData.last_sign_in_at)}</p>}
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                Kullanıcı Yönetimi
              </CardTitle>
              <CardDescription>
                Platformdaki kullanıcıları görüntüleyin ve yönetin.
              </CardDescription>
            </div>
            <Button onClick={() => setCreateUserOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Yeni Kullanıcı
            </Button>
        </CardHeader>
        <CardContent>
          <UserFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            subscriptionFilter={subscriptionFilter}
            setSubscriptionFilter={setSubscriptionFilter}
            verificationFilter={verificationFilter}
            setVerificationFilter={setVerificationFilter}
            filteredUsers={filteredUsers}
            totalUsers={users.length}
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
          />

          {isRefreshing && !users.length ? (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground mb-2">Kullanıcılar yükleniyor...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8"><Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground mb-2">Henüz kayıtlı kullanıcı yok.</p><Button variant="outline" onClick={onRefresh} disabled={isRefreshing}><UserPlus className="h-4 w-4 mr-2" />Kullanıcı Ekle</Button></div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8"><AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground mb-2">Filtrelere uygun kullanıcı bulunamadı.</p><Button variant="outline" onClick={() => { setSearchTerm(''); setRoleFilter('all'); setSubscriptionFilter('all'); setVerificationFilter('all'); }}>Filtreleri Temizle</Button></div>
          ) : (
            isMobile ? <MobileUserList /> : <DesktopUserList />
          )}
        </CardContent>
      </Card>
      <CreateUserDialog
        isOpen={isCreateUserOpen}
        onClose={() => setCreateUserOpen(false)}
        onCreateUser={onCreateUser}
      />
    </>
  );
};

export default UserManagement;