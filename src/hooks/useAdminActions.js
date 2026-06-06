import { useState } from "react";
import { supabase } from "@/lib/customSupabaseClient";

export const useAdminActions = ({
  users,
  setUsers,
  stories,
  setStories,
  testimonials,
  setTestimonials,
  announcements,
  setAnnouncements,
  refetch,
  toast,
}) => {
  const [updatingUser, setUpdatingUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [storyForm, setStoryForm] = useState({
    title: "",
    description: "",
    level: "a1",
    category: "adventure",
    content: "",
    read_time: "5 dk",
    image_url: "",
    is_featured: false,
    is_for_kids: false,
  });

  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    comment: "",
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    type: "info",
  });

  const [editingStory, setEditingStory] = useState(null);

  const handleRefreshUsers = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Başarılı! ✅",
        description: "Kullanıcı listesi yenilendi.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Kullanıcılar yenilenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTogglePremium = async (userId, isPremium, expiresAt = null) => {
    setUpdatingUser(userId);
    try {
      // Get the current user's session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Hata",
          description: "Oturum bulunamadı. Lütfen tekrar giriş yapın.",
          variant: "destructive",
        });
        return;
      }

      // Call the edge function to update user premium status
      const { data, error } = await supabase.functions.invoke(
        "admin-update-user-premium",
        {
          body: {
            userId,
            isPremium,
            expiresAt,
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (error) {
        console.error("❌ Error calling edge function:", error);
        toast({
          title: "Hata",
          description: error.message || "Kullanıcı aboneliği güncellenirken bir hata oluştu.",
          variant: "destructive",
        });
        return;
      }

      if (data.error) {
        console.error("❌ Error from edge function:", data.error);
        toast({
          title: "Hata",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      // Update local state with the returned profile data
      const updateData = {
        subscription: isPremium,
        subscription_date: isPremium ? new Date().toISOString() : null,
        cancellation_date: isPremium ? null : new Date().toISOString(),
        premium_expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      };

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, ...updateData } : u))
      );

      toast({
        title: "Başarılı! ✅",
        description: data.message || `Kullanıcı ${
          isPremium ? "Premium üye yapıldı" : "Premium üyeliği iptal edildi"
        }.`,
      });
    } catch (error) {
      console.error("❌ Error toggling premium:", error);
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleStoryAdded = (newStory) => {
    setStories((prev) => [newStory, ...prev]);
  };

  const handleStoryUpdated = (updatedStory) => {
    setStories((prev) =>
      prev.map((s) => (s.id === updatedStory.id ? updatedStory : s))
    );
  };

  const handleEditStory = (story) => {
    setEditingStory(story);
    setStoryForm({
      title: story.title,
      description: story.description || "",
      level: story.level,
      category: story.category || "adventure",
      content: story.content || "",
      read_time: story.read_time || "5 dk",
      image_url: story.image_url || "",
      is_featured: story.is_featured || false,
      is_for_kids: story.is_for_kids || false,
    });
  };

  const handleDeleteStory = async (storyId) => {
    try {
      const { error } = await supabase
        .from("stories")
        .delete()
        .eq("id", storyId);

      if (error) {
        console.error("❌ Error deleting story:", error);
        toast({
          title: "Hata",
          description: "Hikaye silinirken bir hata oluştu.",
          variant: "destructive",
        });
        return;
      }

      setStories((prev) => prev.filter((s) => s.id !== storyId));

      toast({
        title: "Başarılı! ✅",
        description: "Hikaye başarıyla silindi.",
      });
    } catch (error) {
      console.error("❌ Error deleting story:", error);
      toast({
        title: "Hata",
        description: "Hikaye silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleAddTestimonial = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .insert([
          {
            ...testimonialForm,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("❌ Error adding testimonial:", error);
        toast({
          title: "Hata",
          description: "Yorum eklenirken bir hata oluştu.",
          variant: "destructive",
        });
        return;
      }

      setTestimonials((prev) => [data, ...prev]);
      setTestimonialForm({ name: "", comment: "" });

      toast({
        title: "Başarılı! ✅",
        description: "Yorum başarıyla eklendi.",
      });
    } catch (error) {
      console.error("❌ Error adding testimonial:", error);
      toast({
        title: "Hata",
        description: "Yorum eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTestimonial = async (testimonialId) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", testimonialId);

      if (error) {
        console.error("❌ Error deleting testimonial:", error);
        toast({
          title: "Hata",
          description: "Yorum silinirken bir hata oluştu.",
          variant: "destructive",
        });
        return;
      }

      setTestimonials((prev) => prev.filter((t) => t.id !== testimonialId));

      toast({
        title: "Başarılı! ✅",
        description: "Yorum başarıyla silindi.",
      });
    } catch (error) {
      console.error("❌ Error deleting testimonial:", error);
      toast({
        title: "Hata",
        description: "Yorum silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUserRole = async (userId, role) => {
    setUpdatingUser(userId);
    try {
      // Get the current user's session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Hata",
          description: "Oturum bulunamadı. Lütfen tekrar giriş yapın.",
          variant: "destructive",
        });
        return;
      }

      // Call the edge function to update user role
      const { data, error } = await supabase.functions.invoke(
        "admin-update-user-role",
        {
          body: {
            userId,
            role,
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (error) {
        console.error("❌ Error calling edge function:", error);
        toast({
          title: "Hata",
          description: error.message || "Kullanıcı rolü güncellenirken bir hata oluştu.",
          variant: "destructive",
        });
        return;
      }

      if (data.error) {
        console.error("❌ Error from edge function:", data.error);
        toast({
          title: "Hata",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, role, updated_at: new Date().toISOString() } : u
        )
      );

      toast({
        title: "Başarılı! ✅",
        description: data.message || "Kullanıcı rolü başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("❌ Error updating role:", error);
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    setUpdatingUser(userId);
    try {
      // Get the current user's session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Hata",
          description: "Oturum bulunamadı. Lütfen tekrar giriş yapın.",
          variant: "destructive",
        });
        return;
      }

      // Call the edge function to delete user
      const { data, error } = await supabase.functions.invoke(
        "admin-delete-user",
        {
          body: {
            userId,
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (error) {
        console.error("❌ Error calling edge function:", error);
        toast({
          title: "Hata",
          description: error.message || "Kullanıcı silinirken bir hata oluştu.",
          variant: "destructive",
        });
        return;
      }

      if (data.error) {
        console.error("❌ Error from edge function:", data.error);
        toast({
          title: "Hata",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      // Remove user from local state
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));

      toast({
        title: "Başarılı! ✅",
        description: data.message || "Kullanıcı başarıyla silindi.",
      });
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleCreateUser = async (userData) => {
    // This would need to be implemented with auth.admin.createUser
    // For now, returning a placeholder
    toast({
      title: "Bilgi",
      description: "Kullanıcı oluşturma özelliği henüz aktif değil.",
      variant: "default",
    });
  };

  const handleAddAnnouncement = async () => {
    try {
      const newAnnouncement = {
        id: Date.now(),
        ...announcementForm,
        created_at: new Date().toISOString(),
      };

      const updatedAnnouncements = [newAnnouncement, ...announcements];

      const { error } = await supabase.from("site_settings").upsert({
        key: "announcements",
        value: updatedAnnouncements,
      });

      if (error) {
        console.error("❌ Error adding announcement:", error);
        toast({
          title: "Hata",
          description: "Duyuru eklenirken bir hata oluştu.",
          variant: "destructive",
        });
        return;
      }

      setAnnouncements(updatedAnnouncements);
      setAnnouncementForm({ title: "", content: "", type: "info" });

      toast({
        title: "Başarılı! ✅",
        description: "Duyuru başarıyla eklendi.",
      });
    } catch (error) {
      console.error("❌ Error adding announcement:", error);
      toast({
        title: "Hata",
        description: "Duyuru eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return {
    handleTogglePremium,
    handleRefreshUsers,
    handleUpdateUserRole,
    handleDeleteUser,
    handleCreateUser,
    handleStoryAdded,
    handleStoryUpdated,
    handleEditStory,
    handleDeleteStory,
    handleAddTestimonial,
    handleDeleteTestimonial,
    handleAddAnnouncement,
    updatingUser,
    isRefreshing,
    storyForm,
    setStoryForm,
    editingStory,
    setEditingStory,
    testimonialForm,
    setTestimonialForm,
    announcementForm,
    setAnnouncementForm,
  };
};