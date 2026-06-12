import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM foto ORDER BY created_at ASC');
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const urlParams = new URL(req.url);
    const id = urlParams.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const [rows]: any = await db.query('SELECT url FROM foto WHERE id = ?', [id]);
    if (rows.length > 0) {
      const photoUrl = rows[0].url;
      const filepath = path.join(process.cwd(), 'public', photoUrl);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    await db.query('DELETE FROM foto WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
