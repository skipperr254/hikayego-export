import { supabase } from '@/lib/customSupabaseClient';

export const checkEmailExistsViaRPC = async (email) => {
  const { data, error } = await supabase.rpc('check_email_exists', { p_email: email });
  if (error) {
    throw error;
  }
  return data;
};

export const checkEmailExistsInSupabase = async (email) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('email')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    throw error;
  }
  return !!data;
};