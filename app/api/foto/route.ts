import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase.from('foto').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const urlParams = new URL(req.url);
    const id = urlParams.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const { data, error: selectError } = await supabase.from('foto').select('url').eq('id', id).single();
    if (!selectError && data) {
      const photoUrl = data.url;
      // Extract filename from the URL
      const urlParts = photoUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      
      if (filename) {
        await supabase.storage.from('uploads').remove([filename]);
      }
    }

    const { error: deleteError } = await supabase.from('foto').delete().eq('id', id);
    if (deleteError) throw deleteError;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
