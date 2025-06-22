// filepath: c:\Users\hrdks\OneDrive\Documents\projects\tingting\client\app\api\activity\route.js
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// Helper function to connect to the database
async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db("tingting");
  return db.collection("activities");
}

// GET handler using query parameters instead of path parameters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    console.log('Activity ID query param received:', id);
    
    if (!id) {
      return NextResponse.json({ error: "Activity ID is required" }, { status: 400 });
    }
    
    const collection = await connectToDatabase();
    console.log(`Connected to database, searching for activity with ID: ${id}`);
    
    // Dump a sample record for debugging
    const sampleActivity = await collection.findOne({});
    console.log('Sample activity structure:', JSON.stringify(sampleActivity));try {
      // First try finding by ObjectId
      try {
        const activity = await collection.findOne({ _id: new ObjectId(id) });
        if (activity) {
          return NextResponse.json({ activity }, { status: 200 });
        }
      } catch (objIdErr) {
        console.log('Not a valid ObjectId, trying other lookup methods');
      }
      
      // Try finding using MongoDB extended JSON format
      try {
        const activity = await collection.findOne({ "_id.$oid": id });
        if (activity) {
          return NextResponse.json({ activity }, { status: 200 });
        }
      } catch (extErr) {
        console.log('Extended JSON lookup failed');
      }
        // Also try searching in the entire collection for a matching ID in any format
      const allActivities = await collection.find({}).toArray();
      console.log(`Searching through ${allActivities.length} activities for ID: ${id}`);
      
      // Look for activities with matching IDs in various formats
      for (const activity of allActivities) {
        // Check _id directly
        if (activity._id && activity._id.toString() === id) {
          console.log('Found by _id.toString()');
          return NextResponse.json({ activity }, { status: 200 });
        }
        
        // Check for _id.$oid format
        if (activity._id && activity._id.$oid && activity._id.$oid === id) {
          console.log('Found by _id.$oid');
          return NextResponse.json({ activity }, { status: 200 });
        }
        
        // Check for oid within stringified _id
        const idStr = JSON.stringify(activity._id);
        if (idStr.includes(id)) {
          console.log('Found by id within stringified _id');
          return NextResponse.json({ activity }, { status: 200 });
        }
        
        // Handle the specific format from the example
        if (activity._id && typeof activity._id === 'object' && activity._id.$oid) {
          if (activity._id.$oid === id) {
            console.log('Found by exact match on _id.$oid');
            return NextResponse.json({ activity }, { status: 200 });
          }
        }
      }
      
      console.log(`Activity with ID ${id} not found after exhaustive search`);
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    } catch (err) {
      console.error('ObjectId conversion error:', err);
      return NextResponse.json({ error: "Invalid activity ID format" }, { status: 400 });
    }
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}