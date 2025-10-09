import { createClient } from '@supabase/supabase-js'

// Provide default values if environment variables are not set
const url = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(url, key)
