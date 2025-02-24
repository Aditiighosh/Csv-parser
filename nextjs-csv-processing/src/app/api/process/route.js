import { NextResponse } from 'next/server';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import Queue from 'bull';

const userQueue = new Queue('userQueue', 'redis://127.0.0.1:6379');

userQueue.process(async (job) => {
  const axios = require('axios');
  try {
    const { name, email } = job.data;
    await axios.post('https://jsonplaceholder.typicode.com/users', { name, email });
  } catch (error) {
    throw new Error(`Failed for user ${name}`);
  }
});

export const processHandler = async (req) => {
  const { filename } = await req.json();
  const filePath = path.join(process.cwd(), 'uploads', filename);

  return new Promise((resolve) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        if (data.name && data.email) userQueue.add(data);
      })
      .on('end', () => resolve(NextResponse.json({ message: 'CSV processing started' }, { status: 200 })));
  });
};

// 3. **API Route Export Handlers**

export { uploadHandler as POST } from '../upload/route';
export { processHandler as POST } from './route';
