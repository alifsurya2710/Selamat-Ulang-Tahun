import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.from('pengaturan').select('*');
    if (error) throw error;
    const settings = data.reduce((acc: any, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    for (const key of Object.keys(body)) {
      const { error } = await supabase.from('pengaturan').upsert({ key, value: body[key] });
      if (error) throw error;
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
