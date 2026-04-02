import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://pypkjchxhgjbzgkyskhj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cGtqY2h4aGdqYnpna3lza2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MzEwMzgsImV4cCI6MjA4NjIwNzAzOH0.h-_HqgM39WlvTC9t2IsvCdIRWKaCSQPCfUdBzYJxSWo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
