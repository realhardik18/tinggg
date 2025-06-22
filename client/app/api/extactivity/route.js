// filepath: c:\Users\hrdks\OneDrive\Documents\projects\tingting\client\app\api\extactivity\route.js
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// Helper function to connect to the database
async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db("tingting");
  return db.collection("activities");
}

// This version is specifically for MongoDB extended JSON format
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    console.log('Extended Activity API - ID received:', id);
    
    if (!id) {
      return NextResponse.json({ error: "Activity ID is required" }, { status: 400 });
    }
    
    const collection = await connectToDatabase();
    console.log(`Connected to database, searching with extended JSON approach`);
    
    // Get all activities and search manually
    const allActivities = await collection.find({}).toArray();
    console.log(`Found ${allActivities.length} total activities`);
    
    // Manual search for matching ID in extended JSON format
    for (const activity of allActivities) {
      // Convert activity to JSON string to parse nested structures
      const activityString = JSON.stringify(activity);
      
      // Parse the activity to handle MongoDB extended JSON format
      try {
        const parsedActivity = JSON.parse(activityString);
        
        // Check if _id has $oid
        if (parsedActivity._id && parsedActivity._id.$oid === id) {
          console.log('Found exact match by _id.$oid');
          return NextResponse.json({ activity }, { status: 200 });
        }
        
        // Check if the ID appears anywhere in the object
        if (activityString.includes(id)) {
          console.log('Found by ID inclusion in stringified object');
          return NextResponse.json({ activity }, { status: 200 });
        }
      } catch (err) {
        console.error('Error parsing activity:', err);
      }
    }
    
    // If no match found
    return NextResponse.json({ 
      error: "Activity not found with extended search",
      searchedId: id
    }, { status: 404 });
  } catch (error) {
    console.error('Extended Activity API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}