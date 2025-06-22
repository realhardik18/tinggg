import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// Helper function to connect to the database
async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db("tingting");
  return {
    records: db.collection("records"),
    activities: db.collection("activities")
  };
}

// GET handler
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get activity ID from query params if provided
    const activityId = searchParams.get('activityId');
    // Get user ID from query params (in a real app, this would come from auth)
    const userId = searchParams.get('userId') || 'default_user';
    
    const { records, activities } = await connectToDatabase();
    
    // Build the query based on parameters
    let query = { user_id: userId };
    if (activityId) {
      query.activityId = activityId;
    }
    
    // Fetch records
    const recordsData = await records
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    // If we're grouping by activity ID
    if (searchParams.get('groupByActivity') === 'true') {
      // Group records by activity ID
      const groupedRecords = {};
      
      for (const record of recordsData) {
        if (!groupedRecords[record.activityId]) {
          // Fetch the activity details for this record
          const activity = await activities.findOne({ 
            _id: record.activityId.startsWith('a') 
              ? record.activityId 
              : new ObjectId(record.activityId) 
          });
          
          groupedRecords[record.activityId] = {
            activity: activity || { _id: record.activityId, task: 'Unknown Activity' },
            records: []
          };
        }
        
        groupedRecords[record.activityId].records.push(record);
      }
      
      return NextResponse.json({ groupedRecords }, { status: 200 });
    }
    
    return NextResponse.json({ records: recordsData }, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST handler
export async function POST(request) {
  try {
    const record = await request.json();
    
    // Add timestamps
    record.createdAt = new Date();
    record.updatedAt = new Date();
    
    const { records } = await connectToDatabase();
    const result = await records.insertOne(record);
    
    return NextResponse.json({ 
      success: true, 
      record: { ...record, _id: result.insertedId }
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
    const { _id, ...recordData } = data;
    
    if (!_id) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }
    
    // Add update timestamp
    recordData.updatedAt = new Date();
    
    const { records } = await connectToDatabase();
    const result = await records.updateOne(
      { _id: new ObjectId(_id) },
      { $set: recordData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      record: { _id, ...recordData }
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
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }
    
    const { records } = await connectToDatabase();
    const result = await records.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}