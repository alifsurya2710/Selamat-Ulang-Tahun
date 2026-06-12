/**
 * Create 'lagu' table in Supabase via direct PostgreSQL connection.
 * Requires DATABASE_URL in .env.local or falls back to Supabase pooler.
 */
const { Client } = require('pg');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => env.match(new RegExp(`${key}=(.+)`))?.[1]?.trim();

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
const projectRef = supabaseUrl?.replace('https://', '').replace('.supabase.co', '');
const dbPassword = getEnv('SUPABASE_DB_PASSWORD') || getEnv('DB_PASSWORD');

const sql = `
CREATE TABLE IF NOT EXISTS lagu (
  id BIGSERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  judul TEXT NOT NULL DEFAULT 'Untitled',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE lagu ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON lagu FOR ALL USING (true);
`;

async function main() {
  // Try direct connection (requires DATABASE_URL or SUPABASE_DB_PASSWORD in .env.local)
  const connectionString = getEnv('DATABASE_URL') || 
    (dbPassword ? `postgresql://postgres.yepcbwziequfidgyixbc:${dbPassword}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres` : null);

  if (!connectionString) {
    console.log('No database credentials found in .env.local');
    console.log('');
    console.log('To create the table automatically, add one of these to .env.local:');
    console.log('  DATABASE_URL=postgresql://postgres.yepcbwziequfidgyixbc:YOUR_DB_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres');
    console.log('  SUPABASE_DB_PASSWORD=your_database_password');
    console.log('');
    console.log('OR run this SQL manually in Supabase Dashboard > SQL Editor:');
    console.log('https://supabase.com/dashboard/project/yepcbwziequfidgyixbc/editor');
    console.log('');
    console.log(sql);
    return;
  }

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    await client.query(sql);
    console.log('Table "lagu" created successfully!');
  } catch (err) {
    console.error('Failed to create table:', err.message);
    console.log('');
    console.log('Run this SQL manually in Supabase Dashboard > SQL Editor:');
    console.log(sql);
  } finally {
    await client.end();
  }
}

main();
