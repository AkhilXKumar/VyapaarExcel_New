import { createClient } from '@supabase/supabase-js';

// Project ID extracted from the JWT provided: rnduishpdlciucipreqk
const SUPABASE_URL = 'https://rnduishpdlciucipreqk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZHVpc2hwZGxjaXVjaXByZXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTUxMTIsImV4cCI6MjA4MTI5MTExMn0.bB9QSfyeDgcTkojfh_hHeaWnELx5tgx-mDUgPY5tf78';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);