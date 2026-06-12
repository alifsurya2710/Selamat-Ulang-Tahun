import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';

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
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

    await writeFile(filepath, buffer);
    const url = `/uploads/${filename}`;

    const [result] = await db.query('INSERT INTO foto (url, caption) VALUES (?, ?)', [url, caption]);

    return NextResponse.json({ success: true, id: (result as any).insertId, url, caption });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
