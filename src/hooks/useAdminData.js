import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/customSupabaseClient";
import { useToast } from "@/components/ui/use-toast";

export const useAdminData = (user) => {
  const [users, setUsers] = useState([]);
  const [stories, setStories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const isAdmin = user?.role === "admin";
  const isContentCreator = user?.role === "content_creator";

  const fetchAllUsers = async () => {
    try {
      console.log("🔄 Fetching all users via edge function...");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Auth session missing");
      }

      const { data, error } = await supabase.functions.invoke("get-all-users", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      console.log("✅ Users fetched via edge function:", data.length);
      return data;
    } catch (error) {
      console.error("❌ Error in fetchAllUsers:", error);

      let errorMessage = "Kullanıcılar yüklenirken bir hata oluştu.";

      if (error.message && error.message.includes("Not authorized")) {
        errorMessage =
          "Bu işlemi yapmak için yönetici yetkiniz bulunmamaktadır.";
      } else if (
        error.message &&
        (error.message.includes("failed to fetch") ||
          error.message.includes("network error"))
      ) {
        errorMessage = "Ağ hatası: Sunucuya bağlanılamadı.";
      } else if (
        error.message &&
        (error.message.includes("Auth session missing") ||
          error.message.includes("JWT"))
      ) {
        errorMessage = "Oturum hatası. Lütfen yeniden giriş yapın.";
      } else if (error.message) {
        errorMessage = `Detay: ${error.message}`;
      }

      toast({
        title: "Kullanıcı Yükleme Hatası",
        description: errorMessage,
        variant: "destructive",
      });

      return [];
    }
  };

  const fetchData = useCallback(
    async (dataType) => {
      if (!user) return;
      if (!dataType) setLoading(true);

      try {
        console.log(
          `🔄 Starting admin data fetch for: ${dataType || "all"} for role ${user.role}`
        );

        const fetches = {};

        if (isAdmin) {
          Object.assign(fetches, {
            users: () => fetchAllUsers(),
            stories: () =>
              supabase
                .from("stories")
                .select("*, story_sections(id, audio_url)")
                .order("created_at", { ascending: false }),
            testimonials: () =>
              supabase
                .from("testimonials")
                .select("*")
                .order("created_at", { ascending: false }),
            lessons: () =>
              supabase.from("lessons").select("*").order("position"),
            categories: () =>
              supabase.from("lesson_categories").select("*").order("position"),
          });
        } else if (isContentCreator) {
          Object.assign(fetches, {
            stories: () =>
              supabase
                .from("stories")
                .select("*, story_sections(id, audio_url)")
                .order("created_at", { ascending: false }),
            blog: () =>
              supabase
                .from("blog_posts")
                .select("*")
                .order("created_at", { ascending: false }),
          });
        }

        const dataToFetch = dataType ? [dataType] : Object.keys(fetches);

        if (dataToFetch.length === 0) {
          setLoading(false);
          return;
        }

        const results = await Promise.allSettled(
          dataToFetch.map((key) => fetches[key]())
        );

        const processResult = (index, key, setter) => {
          const result = results[index];

          if (result.status === "fulfilled") {
            let value = result.value;
            if (value && value.data !== undefined) value = value.data;
            setter(value);
          } else {
            console.error(`❌ ${key} fetch failed:`, result.reason);
            setter([]);
          }
        };

        results.forEach((_, index) => {
          const key = dataToFetch[index];
          const setterMap = {
            users: setUsers,
            stories: setStories,
            testimonials: setTestimonials,
            lessons: setLessons,
            categories: setCategories,
          };

          if (setterMap[key]) {
            processResult(index, key, setterMap[key]);
          }
        });
      } catch (error) {
        console.error("❌ Error fetching admin data:", error);
        toast({
          title: "Hata",
          description: "Admin verileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      } finally {
        if (!dataType) setLoading(false);
      }
    },
    [user, toast, isAdmin, isContentCreator]
  );

  useEffect(() => {
    if (user && (isAdmin || isContentCreator)) {
      fetchData();
    } else if (!user) {
      setLoading(false);
    }
  }, [user, isAdmin, isContentCreator, fetchData]);

  return {
    users,
    setUsers,
    stories,
    setStories,
    testimonials,
    setTestimonials,
    lessons,
    setLessons,
    categories,
    setCategories,
    loading,
    refetch: fetchData,
  };
};