import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X, Users, Crown, Shield, CheckCircle, XCircle, RefreshCw, Edit3 } from 'lucide-react';

const UserFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  roleFilter, 
  setRoleFilter, 
  subscriptionFilter, 
  setSubscriptionFilter,
  verificationFilter,
  setVerificationFilter,
  filteredUsers,
  totalUsers,
  onRefresh,
  isRefreshing
}) => {
  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setSubscriptionFilter('all');
    setVerificationFilter('all');
  };

  const hasActiveFilters = searchTerm || roleFilter !== 'all' || subscriptionFilter !== 'all' || verificationFilter !== 'all';

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Kullanıcı adı veya e-posta ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Roller</SelectItem>
              <SelectItem value="admin">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </div>
              </SelectItem>
              <SelectItem value="content_creator">
                <div className="flex items-center">
                  <Edit3 className="h-4 w-4 mr-2" />
                  İçerik Üreticisi
                </div>
              </SelectItem>
              <SelectItem value="user">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Kullanıcı
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Üyelik" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Üyelikler</SelectItem>
              <SelectItem value="premium">
                <div className="flex items-center">
                  <Crown className="h-4 w-4 mr-2 text-amber-500" />
                  Premium
                </div>
              </SelectItem>
              <SelectItem value="free">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Ücretsiz
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={verificationFilter} onValueChange={setVerificationFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Doğrulama" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="verified">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Doğrulanmış
                </div>
              </SelectItem>
              <SelectItem value="unverified">
                <div className="flex items-center">
                  <XCircle className="h-4 w-4 mr-2 text-red-500" />
                  Doğrulanmamış
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Kullanıcıları Yenile"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            <Filter className="h-3 w-3 mr-1" />
            {filteredUsers.length} / {totalUsers} kullanıcı
          </Badge>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Filtreleri Temizle
            </Button>
          )}
        </div>

        <div className="flex gap-1 flex-wrap">
          {searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Arama: "{searchTerm}"
            </Badge>
          )}
          {roleFilter !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Rol: {roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1).replace('_', ' ')}
            </Badge>
          )}
          {subscriptionFilter !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Üyelik: {subscriptionFilter === 'premium' ? 'Premium' : 'Ücretsiz'}
            </Badge>
          )}
          {verificationFilter !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Durum: {verificationFilter === 'verified' ? 'Doğrulanmış' : 'Doğrulanmamış'}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFilters;