// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// 🔴 IMPORTANT: Replace these with YOUR actual keys from Supabase Dashboard
// Go to Settings -> API -> Copy the "URL" and "anon public" key.
const SUPABASE_URL = "https://fquxzsphqknqdimferqk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxdXh6c3BocWtucWRpbWZlcnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMTk1NTYsImV4cCI6MjA5OTU5NTU1Nn0.IgBUCLVea_8C_9ADy1vIiXiqI2SXx7uIGxOqyiZ0iWo";

// Create the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);