import fs from 'fs';
import path from 'path';
import {NextResponse} from 'next/server';
export async function POST(req,res) {
    try {
        //parse JSON body sent from the request for data
        const {email,identifier,firstName,lastName,csvFilePath} = await req.json();
        console.log('Received request data:', { email, identifier, firstName, lastName, csvFilePath });

       // ✅ Resolve the file path correctly
        const absoluteFilePath = path.join(process.cwd(), csvFilePath);
        console.log('Resolved file path:', absoluteFilePath);

        //VALIDATE THE DATA
        if(!firstName || !lastName || !identifier || !email || !csvFilePath){
            return NextResponse.json({ error: 'Please provide all the fields' }, { status: 400 });
        }

        //check if the file exists at the specified path 
        if(!fs.existsSync(absoluteFilePath)){
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        //prepare the user data in csv format
        const userData = `\n${email};${identifier};${firstName};${lastName}`;

        //append the user data to the csv file
        fs.appendFileSync(csvFilePath,userData,'utf-8');

        //return success response
        return NextResponse.json({success:'User added, successfully', userData},{status:200});
    }
    catch(error){
        console.error('Error in adding user:',error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}