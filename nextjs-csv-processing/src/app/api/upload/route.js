import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import csvParser from 'csv-parser';
import { Readable } from 'stream';
import { stringify } from 'csv-stringify/sync';

export const config = {
  api: { bodyParser: false }, // Disable default body parsing
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    
    // Check if file is uploaded
    if (!file) {
      return NextResponse.json({ message: 'No file uploaded.' }, { status: 400 });
    }

    // Check if the file is a CSV file
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ message: 'Invalid file type. Please upload a CSV file.' }, { status: 400 });
    }

    // Convert the file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse the CSV file
    const results = await parseCSV(buffer);

    
    // Create the uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(),'public','uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    // Write the file to the uploads directory
    const filePath = path.join(uploadDir, file.name);
    await fs.writeFile(filePath, buffer);

    // Return the response
    return NextResponse.json({
      message: `✅ File "${file.name}" uploaded successfully!`,
      path: `/uploads/${file.name}`,
      data: results,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

async function parseCSV(buffer) {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(buffer);

    stream.pipe(csvParser())
      .on('headers', (headers) => {
        const nameKey = headers.find(h => h.toLowerCase().includes('name'));
        const emailKey = headers.find(h => h.toLowerCase().includes('email'));

        if (!nameKey || !emailKey) {
          stream.destroy();
          return reject(new Error('Name or email column missing in CSV file.'));
        }

        results.nameKey = nameKey;
        results.emailKey = emailKey;
      })
      .on('data', (row) => {
        const name = row[results.nameKey];
        const email = row[results.emailKey];

        if (!name || !email) {
          stream.destroy();
          return reject(new Error('Name or email missing in CSV file.'));
        }

        results.push({ name, email });
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
