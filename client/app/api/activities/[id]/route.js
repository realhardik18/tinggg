import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// Helper function to connect to the database
async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db("tingting");
  return db.collection("activities");
}

// GET handler for a specific activity by ID
export async function GET(request, { params }) {
  try {
    // Make sure to properly await or handle the params object correctly
    const id = params?.id;
    console.log('Activity ID param received:', id);
    
    if (!id) {
      return NextResponse.json({ error: "Activity ID is required" }, { status: 400 });
    }
    
    const collection = await connectToDatabase();
      try {
      // Try multiple ways to find the activity
      let activity = null;
      
      // First try finding by ObjectId
      try {
        const objectId = new ObjectId(id);
        activity = await collection.findOne({ _id: objectId });
        
        if (activity) {
          return NextResponse.json({ activity }, { status: 200 });
        }
      } catch (objIdErr) {
        console.log('Not a valid ObjectId, trying string ID lookup');
      }
      
      // If not found or not a valid ObjectId, try finding by string ID
      activity = await collection.findOne({ _id: id });
      
      if (activity) {
        return NextResponse.json({ activity }, { status: 200 });
      }
      
      // Also try finding by ID stored as string property
      activity = await collection.findOne({ id: id });
      
      if (activity) {
        return NextResponse.json({ activity }, { status: 200 });
      }
      
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    } catch (err) {
      // Handle invalid ObjectId format
      console.error('ObjectId conversion error:', err);
      return NextResponse.json({ error: "Invalid activity ID format" }, { status: 400 });
    }
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}