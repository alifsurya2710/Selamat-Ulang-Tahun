import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;
    const caption = data.get('caption') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = Date.now() + '-' + file.name.replace(/\s/g, '_');
    
    // Upload ke Supabase Storage (pastikan Anda sudah membuat bucket bernama 'uploads' yang bersifat public)
    const { data: storageData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filename, buffer, {
        contentType: file.type || 'image/jpeg',
      });

    if (uploadError) {
      throw new Error('Gagal upload gambar ke storage: ' + uploadError.message);
    }

    // Dapatkan public URL
    const { data: publicUrlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(filename);

    const url = publicUrlData.publicUrl;

    const { data: insertData, error } = await supabase.from('foto').insert([{ url, caption }]).select('id').single();
    
    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, id: insertData.id, url, caption });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
