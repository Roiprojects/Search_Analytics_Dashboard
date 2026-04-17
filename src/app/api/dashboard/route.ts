import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Note: In Next.js App Router, using fs requires __dirname or process.cwd()
const dataFilePath = path.join(process.cwd(), 'src', 'data', 'db.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading db.json:", error);
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newData = await request.json();
    
    // Validate simple data structure
    if (!newData.keyword || !Array.isArray(newData.locations)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2), 'utf8');
    return NextResponse.json({ success: true, data: newData });
  } catch (error) {
    console.error("Error writing db.json:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
