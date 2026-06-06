import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vjxkmufoztgzrnwaxswo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqeGttdWZvenRnenJud2F4c3dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTIyNTcsImV4cCI6MjA2NjI4ODI1N30.kUPMcGditeRQxRayjOXFbQiE-hCQ8FNxI7Ni6FpSt20';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
