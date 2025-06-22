import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const data = await request.json();

    const activityId = data['activity id'] || data.activityId;
    const completed = data.completed;
    const details = data.details || '';
    const task = data.task || '';

    if (!activityId || typeof completed === 'undefined') {
      console.log('[400] Invalid payload:', data);
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('tingting');

    const result = await db.collection('records').insertOne({
      activityId,
      completed,
      details,
      task,
      createdAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Record saved successfully',
      id: result.insertedId
    });

  } catch (error) {
    console.error('[500] Error saving record:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save record' },
      { status: 500 }
    );
  }
}
