import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { User, Mail, FileImage as ImageIcon, Check, Edit, Crown } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import AvatarSelection from './AvatarSelection';
import UserStats from './UserStats';
import { normalAvatars, allPremiumAvatars } from '@/lib/avatars';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';

const ProfileSettings = () => {
  const { user, profile, updateUser, canAccessPremiumFeatures, refreshUserProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [modalProfileData, setModalProfileData] = useState({ avatar_url: null });
  const [initialProfileData, setInitialProfileData] = useState(null);
  const [isAvatarModalOpen, setAvatarModalOpen] = useState(false);

  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const setupProfileData = useCallback(() => {
    const source = profile || user;
    if (source) {
      const data = { 
        name: source.name || '', 
        email: source.email || '', 
        avatar_url: source.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${source.email}`
      };
      setInitialProfileData(data);
      setModalProfileData({ avatar_url: data.avatar_url });
    }
  }, [user, profile]);

  useEffect(() => {
    if (profile || user) {
      setupProfileData();
    }
  }, [profile, user, setupProfileData]);
  
  const isProfileChanged = useMemo(() => {
    return modalProfileData.avatar_url !== initialProfileData?.avatar_url;
  }, [modalProfileData.avatar_url, initialProfileData?.avatar_url]);

  const handleUpdateProfile = useCallback(async () => {
    if (!initialProfileData) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.from('profiles').update({ 
          avatar_url: modalProfileData.avatar_url, 
          updated_at: new Date().toISOString() 
      })
      .eq('id', user.id)
      .select()
      .single();

      if (error) throw error;
      
      await updateUser({ ...initialProfileData, avatar_url: data.avatar_url });
      await refreshUserProfile();
      
      const updatedInitialData = { ...initialProfileData, avatar_url: data.avatar_url };
      setInitialProfileData(updatedInitialData);
      setModalProfileData({ avatar_url: data.avatar_url });

      toast({ title: "Profil güncellendi! ✨", description: "Avatarın başarıyla değiştirildi." });
      setAvatarModalOpen(false);
    } catch (error) {
      toast({ title: "Hata", description: "Profil güncellenirken bir hata oluştu.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [modalProfileData.avatar_url, initialProfileData, user.id, updateUser, refreshUserProfile, toast]);

  const handleAvatarSelect = useCallback((avatarUrl) => {
    setModalProfileData({ avatar_url: avatarUrl });
  }, []);

  const handleOpenModal = useCallback(() => {
    setAvatarModalOpen(true);
  }, []);

  const handleCloseModal = useCallback((isOpen) => {
    if (!isOpen) {
      setModalProfileData({ avatar_url: initialProfileData.avatar_url });
    }
    setAvatarModalOpen(isOpen);
  }, [initialProfileData]);

  const SecureAvatarDisplay = useCallback(({ avatarUrl, name, email, className, onEditClick, isPremium }) => {
    const fallback = name ? name.charAt(0).toUpperCase() : email?.charAt(0).toUpperCase();
    return (
      <div 
        className="relative group"
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className={`relative rounded-full ${isPremium ? 'p-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 animate-pulse-slow' : ''}`}>
           <Avatar 
            className={`shadow-xl transition-all duration-300 group-hover:shadow-primary/20 pointer-events-none ${className}`}
          >
            <AvatarImage src={avatarUrl} alt={name} className="object-cover rounded-full" draggable="false" />
            <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-primary to-purple-600 text-white">{fallback}</AvatarFallback>
          </Avatar>
           {isPremium && (
            <div className="absolute top-0 right-0 h-8 w-8 md:h-9 md:w-9 bg-amber-400 rounded-full flex items-center justify-center border-2 border-background shadow-md">
              <Crown className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
          )}
        </div>
        <button
          onClick={onEditClick}
          className="absolute bottom-0 right-0 h-8 w-8 md:h-10 md:w-10 bg-secondary rounded-full flex items-center justify-center cursor-pointer border-2 border-background shadow-md group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
          aria-label="Avatarı değiştir"
        >
          <Edit className="h-4 w-4 md:h-5 w-5" />
        </button>
      </div>
    );
  }, []);
  
  if (!initialProfileData) {
    return (
      <Card className="overflow-hidden border-border/20 shadow-lg w-full">
         <CardHeader className="border-b">
           <Skeleton className="h-8 w-48 rounded-lg" />
         </CardHeader>
         <CardContent className="space-y-8 p-6">
           <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
              <Skeleton className="h-32 w-32 rounded-full shrink-0" />
              <div className="space-y-4 w-full max-w-md">
                 <div className="space-y-2"><Skeleton className="h-5 w-24 rounded-lg" /><Skeleton className="h-12 w-full rounded-xl" /></div>
                 <div className="space-y-2"><Skeleton className="h-5 w-24 rounded-lg" /><Skeleton className="h-12 w-full rounded-xl" /></div>
              </div>
           </div>
         </CardContent>
      </Card>
    );
  }

  const AvatarModalContent = () => (
    <>
      <AvatarSelection 
        normalAvatars={normalAvatars} 
        premiumAvatars={allPremiumAvatars} 
        selectedAvatar={modalProfileData.avatar_url} 
        onSelect={handleAvatarSelect} 
        isPremium={canAccessPremiumFeatures} 
      />
    </>
  );

  const ModalFooter = () => (
    <Button onClick={handleUpdateProfile} disabled={!isProfileChanged || loading} className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Kaydediliyor...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center space-x-2">
          <Check className="h-5 w-5" />
          <span>Değişiklikleri Kaydet</span>
        </div>
      )}
    </Button>
  );

  const AvatarDialog = () => (
    <Dialog open={isAvatarModalOpen && !isMobile} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <ImageIcon className="h-6 w-6 text-primary" />
            <span>Avatarını Seç</span>
          </DialogTitle>
          <DialogDescription>
            Tarzını yansıtan bir avatar seçerek profilini kişiselleştir.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <AvatarModalContent />
        </div>
        <DialogFooter>
          <ModalFooter />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  const AvatarSheet = () => (
    <Sheet open={isAvatarModalOpen && isMobile} onOpenChange={handleCloseModal}>
      <SheetContent side="bottom" className="max-h-[85vh] flex flex-col">
        <SheetHeader className="px-0">
          <SheetTitle>Avatarını Seç</SheetTitle>
          <SheetDescription>
            Tarzını yansıtan bir avatar seçerek profilini kişiselleştir.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4">
          <AvatarModalContent />
        </div>
        <SheetFooter className="mt-auto pt-4 border-t">
          <ModalFooter />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  const DesktopLayout = () => (
    <Card className="overflow-hidden border-border/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-b">
        <CardTitle className="flex items-center text-xl"><User className="mr-3 h-6 w-6 text-primary" />Profil Bilgileri</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
          <motion.div whileHover={{ scale: 1.05 }} className="relative">
             <SecureAvatarDisplay 
                avatarUrl={initialProfileData.avatar_url}
                name={initialProfileData.name}
                email={user?.email} 
                className="h-32 w-32" 
                onEditClick={handleOpenModal}
                isPremium={canAccessPremiumFeatures}
              />
          </motion.div>
          <div className="space-y-4 w-full max-w-md">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">Ad Soyad</Label>
                <Input id="name" value={initialProfileData.name} className="h-12 text-lg border-2 bg-muted" readOnly />
            </div>
            <div className="space-y-2"><Label htmlFor="email" className="text-base font-semibold">E-posta</Label><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input id="email" type="email" value={initialProfileData.email} disabled className="h-12 text-lg bg-muted pl-12 border-2" /></div></div>
          </div>
        </div>
        
        <UserStats userId={user.id} />
        
      </CardContent>
    </Card>
  );

  const MobileLayout = () => (
    <div className="space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <motion.div whileHover={{ scale: 1.05 }} className="relative">
           <SecureAvatarDisplay 
              avatarUrl={initialProfileData.avatar_url} 
              name={initialProfileData.name} 
              email={user?.email} 
              className="h-24 w-24" 
              onEditClick={handleOpenModal}
              isPremium={canAccessPremiumFeatures}
            />
        </motion.div>
        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name-mobile">Ad Soyad</Label>
            <Input id="name-mobile" value={initialProfileData.name} className="h-11 text-base bg-muted" readOnly />
          </div>
          <div className="space-y-1"><Label htmlFor="email-mobile">E-posta</Label><Input id="email-mobile" type="email" value={initialProfileData.email} disabled className="h-11 text-base bg-muted/50" /></div>
        </div>
      </div>
      
      <UserStats userId={user.id} />
      
      <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border flex flex-col gap-2">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Uygulama içinden plan/hesap işlemleri desteklenmiyor. Lütfen masaüstünden devam edin.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed flex items-center flex-wrap gap-1">
          Gerekirse bizimle iletişime geçin:
          <span className="font-medium inline-flex items-center gap-1 text-primary">
            <Mail className="h-3 w-3" />
            contact@hikayego.com
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
      <AvatarDialog />
      <AvatarSheet />
    </>
  );
};

export default ProfileSettings;