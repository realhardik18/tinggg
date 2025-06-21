import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("tingting");
  const collection = db.collection("activities");

  switch (req.method) {
    case 'GET':
      try {
        // Get user ID from query params (in a real app, this would come from auth)
        const userId = req.query.userId || 'default_user';
        
        // Optional pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        
        // Get activities for this user
        const activities = await collection
          .find({ user_id: userId })
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(limit)
          .toArray();
          
        const total = await collection.countDocuments({ user_id: userId });
        
        res.status(200).json({ 
          activities, 
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
          }
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
      
    case 'POST':
      try {
        // Create a new activity
        const activity = req.body;
        
        // Add timestamps
        activity.createdAt = new Date();
        activity.updatedAt = new Date();
        
        const result = await collection.insertOne(activity);
        
        res.status(201).json({ 
          success: true, 
          activity: { ...activity, _id: result.insertedId }
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
      
    case 'PUT':
      try {
        // Update an existing activity
        const { _id, ...activityData } = req.body;
        
        if (!_id) {
          return res.status(400).json({ error: "Activity ID is required" });
        }
        
        // Add update timestamp
        activityData.updatedAt = new Date();
        
        const result = await collection.updateOne(
          { _id: new ObjectId(_id) },
          { $set: activityData }
        );
        
        if (result.matchedCount === 0) {
          return res.status(404).json({ error: "Activity not found" });
        }
        
        res.status(200).json({ 
          success: true, 
          activity: { _id, ...activityData }
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
      
    case 'DELETE':
      try {
        // Delete an activity
        const { id } = req.query;
        
        if (!id) {
          return res.status(400).json({ error: "Activity ID is required" });
        }
        
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Activity not found" });
        }
        
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}