import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// Helper function to connect to the database
async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db("tingting");
  return db.collection("activities");
}

// GET handler
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get user ID from query params (in a real app, this would come from auth)
    const userId = searchParams.get('userId') || 'default_user';
    
    // Optional pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    const collection = await connectToDatabase();
    
    // Get activities for this user
    const activities = await collection
      .find({ user_id: userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
      
    const total = await collection.countDocuments({ user_id: userId });
    
    return NextResponse.json({ 
      activities, 
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST handler
export async function POST(request) {
  try {
    const activity = await request.json();
    
    // Add timestamps
    activity.createdAt = new Date();
    activity.updatedAt = new Date();
    
    const collection = await connectToDatabase();
    const result = await collection.insertOne(activity);
    
    return NextResponse.json({ 
      success: true, 
      activity: { ...activity, _id: result.insertedId }
    }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT handler
export async function PUT(request) {
  try {
    const data = await request.json();
    const { _id, ...activityData } = data;
    
    if (!_id) {
      return NextResponse.json({ error: "Activity ID is required" }, { status: 400 });
    }
    
    // Add update timestamp
    activityData.updatedAt = new Date();
    
    const collection = await connectToDatabase();
    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: activityData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      activity: { _id, ...activityData }
    }, { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE handler
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "Activity ID is required" }, { status: 400 });
    }
    
    const collection = await connectToDatabase();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}