import { createClient } from '@supabase/supabase-js';

// publishable key는 브라우저에 공개돼도 안전한 키다. (데이터 보호는 RLS가 담당)
const SUPABASE_URL = 'https://jvjzvwkppcmlkogscjdv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_eVU9K6GyPj4NQYRhry8puA_S7esLTFV';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
