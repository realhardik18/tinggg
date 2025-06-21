// filepath: c:\Users\hrdks\OneDrive\Documents\projects\tingting\client\app\api\save-response\route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    // Parse the request body
    const data = await request.json();
    
    // Validate the data
    if (!data || !data['activity id'] || !('completed' in data)) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to the MongoDB client
    const client = await clientPromise;
    const db = client.db('tingting');
    
    // Insert the data into the 'records' collection
    const result = await db.collection('records').insertOne({
      activityId: data['activity id'],
      task: data.task || '',
      completed: data.completed,
      details: data.details || '',
      createdAt: new Date()
    });
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Record saved successfully',
      id: result.insertedId
    });
    
  } catch (error) {
    console.error('Error saving record:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save record' },
      { status: 500 }
    );
  }
}