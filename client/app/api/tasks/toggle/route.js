import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// Helper function to connect to the database
async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db("tingting");
  return db.collection("tasks");
}

// PUT handler for toggling task completion status
export async function PUT(request) {
  try {
    const data = await request.json();
    const { id } = data;
    
    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }
    
    const collection = await connectToDatabase();
    
    // Find the task first to get its current completed status
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
    
    // Toggle the completed status
    const completed = !task.completed;
    
    // Update the task with the new completed status
    let result;
    try {
      result = await collection.updateOne(
        { _id: task._id },
        { 
          $set: { 
            completed, 
            updatedAt: new Date(),
            completedAt: completed ? new Date() : null
          }
        }
      );
    } catch (error) {
      console.error('Error updating task:', error);
      return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      task: { 
        ...task, 
        completed,
        updatedAt: new Date(),
        completedAt: completed ? new Date() : null
      }
    }, { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
