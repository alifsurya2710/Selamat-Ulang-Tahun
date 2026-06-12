import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yepcbwziequfidgyixbc.supabase.co';
const supabaseAnonKey = 'sb_publishable_kC93b1M2SABknywra0hOdg_t2TKg-0h';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('pesan').select('*').limit(1);
  if (error) {
    console.error('Error fetching pesan:', error);
  } else {
    console.log('Pesan data:', data);
  }
}

test();
