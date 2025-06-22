import clientPromise from '../../../lib/mongodb';
import { NextResponse } from 'next/server';

// Helper function to connect to the database
async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db("tingting");
  return db.collection("records");
}

// GET handler for fetching all records
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Optional pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = (page - 1) * limit;
    
    const collection = await connectToDatabase();
    
    // Get all records with pagination
    const records = await collection
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
      
    const count = await collection.countDocuments({});
    
    console.log(`Fetched ${records.length} records out of ${count} total`);
    
    return NextResponse.json({ 
      records, 
      count,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}