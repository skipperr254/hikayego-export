import { supabase } from '@/lib/customSupabaseClient';

export const fetchDashboardStories = async (userId, canAccessPremiumFeatures, isKidAccount) => {
  if (!userId) {
    throw new Error('User ID is required to fetch stories.');
  }

  const rpcName = canAccessPremiumFeatures ? 'get_stories_with_user_data' : 'get_stories_with_user_data_stable';
  
  let query = supabase.rpc(rpcName, { p_user_id: userId });

  if (isKidAccount) {
    query = query.eq('is_for_kids', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching dashboard stories:', error);
    throw new Error('Hikayeler yüklenirken bir sorun oluştu.');
  }
  
  return data || [];
};

export const fetchStoryBySlug = async (slug, userId) => {
  if (!slug || !userId) {
    throw new Error('Slug and User ID are required.');
  }

  const { data, error } = await supabase
    .from('stories')
    .select('*, story_ratings(rating, user_id)')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error('Error fetching story by slug:', error);
    throw new Error('Hikaye bulunamadı.');
  }

  // Fetch related data in parallel
  const [sectionsResult, savedResult, readResult] = await Promise.allSettled([
    supabase
      .from('story_sections')
      .select('id, content, audio_url, section_order, word_timings')
      .eq('story_id', data.id)
      .order('section_order', { ascending: true }),
    supabase
      .from('user_saved_stories')
      .select('story_id')
      .eq('user_id', userId)
      .eq('story_id', data.id)
      .maybeSingle(),
    supabase
      .from('user_read_stories')
      .select('story_id')
      .eq('user_id', userId)
      .eq('story_id', data.id)
      .maybeSingle(),
  ]);

  const storySections = sectionsResult.status === 'fulfilled' ? sectionsResult.value.data : [];
  const isSaved = savedResult.status === 'fulfilled' && !!savedResult.value.data;
  const isRead = readResult.status === 'fulfilled' && !!readResult.value.data;

  // Local storage is synchronous and can be fetched here
  let progress = null;
  try {
    const progressData = localStorage.getItem(`story_progress_${userId}_${data.id}`);
    progress = progressData ? JSON.parse(progressData) : null;
  } catch (e) {
    console.error("Failed to read progress from localStorage", e);
  }

  return {
    story: data,
    storySections: storySections || [],
    isSaved,
    isRead,
    progress,
  };
};

export const toggleSaveStory = async (storyId, userId, isCurrentlySaved, canAccessPremiumFeatures) => {
  if (!storyId || !userId) throw new Error("Story ID and User ID are required.");

  if (!canAccessPremiumFeatures) {
    return { requiresPremium: true, success: false };
  }

  try {
    if (isCurrentlySaved) {
      const { error } = await supabase.from('user_saved_stories').delete().match({ user_id: userId, story_id: storyId });
      if (error) throw error;
      return { success: true, saved: false };
    } else {
      const { error } = await supabase.from('user_saved_stories').insert({ user_id: userId, story_id: storyId, saved_at: new Date().toISOString() });
      if (error) throw error;
      return { success: true, saved: true };
    }
  } catch (error) {
    console.error('Error toggling save story:', error);
    throw new Error("Hikayeyi kaydederken veya kaldırırken bir hata oluştu.");
  }
};

export const toggleReadStatus = async (storyId, userId, isCurrentlyRead) => {
  if (!storyId || !userId) throw new Error("Story ID and User ID are required.");

  try {
    if (isCurrentlyRead) {
      const { error } = await supabase.from('user_read_stories').delete().match({ user_id: userId, story_id: storyId });
      if (error) throw error;
      return { success: true, read: false };
    } else {
      const { error } = await supabase.from('user_read_stories').insert({ user_id: userId, story_id: storyId, read_at: new Date().toISOString() });
      if (error) throw error;
      return { success: true, read: true };
    }
  } catch (error) {
    console.error('Error toggling read status:', error);
    throw new Error("Okundu durumunu değiştirirken bir hata oluştu.");
  }
};