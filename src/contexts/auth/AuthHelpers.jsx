import { supabase } from '@/lib/customSupabaseClient';

export const loadUserProfile = async (authUser, setUser, preserveUser) => {
  try {
    console.log('Loading profile for:', authUser.email);
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (error) {
      console.error('Profile fetch error:', error);
      const fallbackUser = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || '',
        role: authUser.email === 'mustafabayrak121@gmail.com' ? 'admin' : 'user',
        subscription: authUser.email === 'mustafabayrak121@gmail.com'
      };
      
      if (preserveUser?.subscription !== undefined) {
        fallbackUser.subscription = preserveUser.subscription;
        fallbackUser.subscription_date = preserveUser.subscription_date;
        fallbackUser.cancellation_date = preserveUser.cancellation_date;
      }
      if (preserveUser?.avatar_url) {
        fallbackUser.avatar_url = preserveUser.avatar_url;
      }
      
      console.log('Using fallback user data due to fetch error');
      setUser(fallbackUser);
      return;
    }

    if (!profile) {
      console.log('Profile not found, creating new profile...');
      await createUserProfile(authUser, setUser);
    } else {
      console.log('Profile loaded successfully');
      const newUser = {
        id: authUser.id,
        email: authUser.email,
        name: profile.name || authUser.user_metadata?.name || '',
        avatar_url: profile.avatar_url,
        role: profile.role || 'user',
        subscription: profile.subscription || false,
        subscription_date: profile.subscription_date,
        cancellation_date: profile.cancellation_date,
        premium_expires_at: profile.premium_expires_at,
        subscription_status: profile.subscription_status,
        trial_start_date: profile.trial_start_date,
        trial_end_date: profile.trial_end_date,
        next_payment_date: profile.next_payment_date,
        preferences: profile.preferences,
        is_kid_account: profile.is_kid_account || false
      };
      
      setUser(prevUser => {
        if (!prevUser || 
            prevUser.id !== newUser.id ||
            prevUser.subscription !== newUser.subscription ||
            prevUser.name !== newUser.name ||
            prevUser.role !== newUser.role ||
            prevUser.avatar_url !== newUser.avatar_url ||
            prevUser.premium_expires_at !== newUser.premium_expires_at ||
            prevUser.next_payment_date !== newUser.next_payment_date) {
          return newUser;
        }
        return prevUser;
      });
    }
  } catch (error) {
    console.error('Unhandled profile loading error:', error);
    const fallbackUser = {
      id: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.name || '',
      role: authUser.email === 'mustafabayrak121@gmail.com' ? 'admin' : 'user',
      subscription: authUser.email === 'mustafabayrak121@gmail.com'
    };
    
    if (preserveUser?.subscription !== undefined) {
      fallbackUser.subscription = preserveUser.subscription;
      fallbackUser.subscription_date = preserveUser.subscription_date;
      fallbackUser.cancellation_date = preserveUser.cancellation_date;
    }
    if (preserveUser?.avatar_url) {
        fallbackUser.avatar_url = preserveUser.avatar_url;
    }
    
    console.log('Using fallback user data after unhandled error');
    setUser(fallbackUser);
  }
};

export const createUserProfile = async (authUser, setUser) => {
  try {
    const profileData = {
      id: authUser.id,
      name: authUser.user_metadata?.name || '',
      email: authUser.email,
      role: authUser.email === 'mustafabayrak121@gmail.com' ? 'admin' : 'user',
      subscription: authUser.email === 'mustafabayrak121@gmail.com',
      subscription_status: authUser.email === 'mustafabayrak121@gmail.com' ? 'active' : 'none',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      avatar_url: null,
      preferences: {
        theme: 'system',
        language: 'tr',
        fontSize: [16],
        readingSpeed: [1],
        autoPlay: true,
        soundEffects: true,
        animations: true,
        compactMode: false,
        showTranslations: true,
        highlightWords: true
      },
      is_kid_account: false
    };

    const { data: profile, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      console.error('Profile creation error:', error);
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || '',
        role: authUser.email === 'mustafabayrak121@gmail.com' ? 'admin' : 'user',
        subscription: authUser.email === 'mustafabayrak121@gmail.com',
        avatar_url: null
      });
    } else {
      console.log('Profile created successfully');
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: profile.name,
        role: profile.role,
        subscription: profile.subscription,
        subscription_date: profile.subscription_date,
        cancellation_date: profile.cancellation_date,
        premium_expires_at: profile.premium_expires_at,
        avatar_url: profile.avatar_url,
        subscription_status: profile.subscription_status,
        trial_start_date: profile.trial_start_date,
        trial_end_date: profile.trial_end_date,
        next_payment_date: profile.next_payment_date,
        preferences: profile.preferences,
      });
    }
  } catch (error) {
    console.error('Profile creation failed:', error);
    setUser({
      id: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.name || '',
      role: authUser.email === 'mustafabayrak121@gmail.com' ? 'admin' : 'user',
      subscription: authUser.email === 'mustafabayrak121@gmail.com',
      avatar_url: null
    });
  }
};