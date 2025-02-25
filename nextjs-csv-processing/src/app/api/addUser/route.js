import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import csvParser from 'csv-parser';
import { Readable } from 'stream';
import { stringify } from 'csv-stringify/sync';

export async function POST(req) {
  try {
    // Parse JSON body sent from the request for data
    const { email, identifier, firstName, lastName, csvFilePath } = await req.json();
    console.log('Received request data:', { email, identifier, firstName, lastName, csvFilePath });

    const fileName = path.basename(csvFilePath);
    console.log('File name:', fileName);

    // Resolve the file path correctly
    const absoluteFilePath = path.join(process.cwd(), 'public', csvFilePath);
    console.log('Resolved file path:', absoluteFilePath);

    // Validate the data
    if (!firstName || !lastName || !identifier || !email || !csvFilePath) {
      return NextResponse.json({ error: 'Please provide all the fields' }, { status: 400 });
    }

    // Check if the file exists at the specified path
    if (!fs.existsSync(absoluteFilePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read the existing CSV file
    const fileContent = await fs.promises.readFile(absoluteFilePath, 'utf-8');
    const rows = [];
    const stream = Readable.from(fileContent);

    let csvHeaders = [];

    await new Promise((resolve, reject) => {
      stream.pipe(csvParser({ separator: ';' }))
        .on('headers', (headerList) => {
          csvHeaders = headerList;
        })
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Add the new user data to the rows
    const newUser = {};
    csvHeaders.forEach(header => {
      if (header.toLowerCase().includes('email')) {
        newUser[header] = email;
      } else if (header.toLowerCase().includes('identifier')) {
        newUser[header] = identifier;
      } else if (header.toLowerCase().includes('first name')) {
        newUser[header] = firstName;
      } else if (header.toLowerCase().includes('last name')) {
        newUser[header] = lastName;
      } else {
        newUser[header] = ''; // Fill other columns with empty values
      }
    });
    rows.push(newUser);

    // Convert the rows back to CSV format
    const updatedCsv = stringify(rows, { header: true, delimiter: ';' });

    // Write the updated CSV back to the file
    await fs.promises.writeFile(absoluteFilePath, updatedCsv, 'utf-8');

    const downloadLink = `/uploads/${fileName}`;
    console.log('Download link:', downloadLink);

    // Return success response
    return NextResponse.json({ success: 'User added successfully', userData: newUser, downloadLink }, { status: 200 });
  } catch (error) {
    console.error('Error in adding user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}