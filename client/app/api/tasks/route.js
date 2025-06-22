import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// Helper function to connect to the database
async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db("tingting");
  return db.collection("tasks");
}

// GET handler for fetching tasks
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get user ID from query params
    const userId = searchParams.get('userId') || 'default_user';
    const id = searchParams.get('id');
    
    // Optional pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    const collection = await connectToDatabase();
    
    // If an ID is provided, fetch a single task
    if (id) {
      let task;
      
      try {
        task = await collection.findOne({ _id: new ObjectId(id) });
      } catch (error) {
        // If the ID is not a valid ObjectId, try searching by a custom id field
        task = await collection.findOne({ id: id });
      }
      
      if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }
      
      return NextResponse.json({ task }, { status: 200 });
    }
    
    // Otherwise, get tasks for this user
    const query = { user_id: userId };
    
    // Add filters based on query parameters
    if (searchParams.get('completed') !== null) {
      query.completed = searchParams.get('completed') === 'true';
    }
    
    if (searchParams.get('priority')) {
      query.priority = searchParams.get('priority');
    }
    
    // Get tasks with pagination
    const tasks = await collection
      .find(query)
      .sort({ dueDate: 1, priority: -1, createdAt: -1 }) // Sort by due date, then priority, then creation date
      .skip(skip)
      .limit(limit)
      .toArray();
      
    const total = await collection.countDocuments(query);
    
    return NextResponse.json({ 
      tasks, 
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

// POST handler for creating a task
export async function POST(request) {
  try {
    const task = await request.json();
    
    // Required fields
    if (!task.title) {
      return NextResponse.json({ error: "Task title is required" }, { status: 400 });
    }
    
    // Add timestamps
    task.createdAt = new Date();
    task.updatedAt = new Date();
    
    // Default values
    task.user_id = task.user_id || 'default_user';
    task.completed = task.completed || false;
    task.priority = task.priority || 'Medium';
    
    const collection = await connectToDatabase();
    const result = await collection.insertOne(task);
    
    return NextResponse.json({ 
      success: true, 
      task: { ...task, _id: result.insertedId }
    }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT handler for updating a task
export async function PUT(request) {
  try {
    const data = await request.json();
    const { _id, ...taskData } = data;
    
    if (!_id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }
    
    // Add update timestamp
    taskData.updatedAt = new Date();
    
    const collection = await connectToDatabase();
    
    // Try to update by ObjectId first
    let result;
    try {
      result = await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: taskData }
      );
    } catch (error) {
      // If not a valid ObjectId, try updating by a custom id field
      result = await collection.updateOne(
        { id: _id },
        { $set: taskData }
      );
    }
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      task: { _id, ...taskData }
    }, { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE handler for removing a task
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }
    
    const collection = await connectToDatabase();
    
    // Try to delete by ObjectId first
    let result;
    try {
      result = await collection.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      // If not a valid ObjectId, try deleting by a custom id field
      result = await collection.deleteOne({ id: id });
    }
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
