import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const config = {
  api: { bodyParser: false }, // Disable default body parsing
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.name);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      message: `✅ File "${file.name}" uploaded successfully!`,
      path: `/uploads/${file.name}`,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
