from pymongo import MongoClient
from dotenv import load_dotenv
import os
import json
from bson import json_util

load_dotenv()

client = MongoClient(os.getenv('MONGODB_URI'))
db = client['tasks']
collections = db['collections']

def fetch_all_activities():
    """Fetch all activities from the MongoDB collection
    
    Returns:
        List of all activity documents in the collection
    """
    try:
        # Retrieve all documents from the collection
        cursor = collections.find({})
        
        # Convert cursor to list of dictionaries
        activities = list(cursor)
        
        # Convert MongoDB ObjectId to string for JSON serialization
        for activity in activities:
            if '_id' in activity:
                activity['_id'] = str(activity['_id'])
                
        return activities
    except Exception as e:
        print(f"Error fetching activities: {e}")
        return []

def update_activity(activity_json):
    """Update or insert an activity in the MongoDB collection
    
    Args:
        activity_json: JSON object representing the activity
        
    Returns:
        Dictionary with status and message
    """
    try:
        # Check if the activity has an ID
        if 'activity_id' not in activity_json:
            return {
                'status': 'error',
                'message': 'Missing activity_id in the provided data'
            }
            
        activity_id = activity_json['activity_id']
        
        # Use upsert to either insert a new document or update an existing one
        result = collections.update_one(
            {'activity_id': activity_id},  # Filter by activity_id
            {'$set': activity_json},       # Set document to the provided JSON
            upsert=True                    # Create if it doesn't exist
        )
        
        if result.modified_count > 0:
            return {
                'status': 'updated',
                'message': f'Activity {activity_id} updated successfully'
            }
        elif result.upserted_id:
            return {
                'status': 'inserted',
                'message': f'Activity {activity_id} inserted successfully'
            }
        else:
            return {
                'status': 'unchanged',
                'message': f'Activity {activity_id} already exists with the same data'
            }
    except Exception as e:
        print(f"Error updating activity: {e}")
        return {
            'status': 'error',
            'message': f'Database error: {str(e)}'
        }

def fetch_all_collections():
    """Fetch all collection names from the MongoDB database
    
    Returns:
        List of all collection names in the database
    """
    try:
        # Get all collection names from the database
        collection_names = db.list_collection_names()
        return collection_names
    except Exception as e:
        print(f"Error fetching collections: {e}")
        return []

def update_collection(collection_name, data_json):
    """Add or update a document in a specific collection
    
    Args:
        collection_name: Name of the collection to update
        data_json: JSON object representing the data to add/update
        
    Returns:
        Dictionary with status and message
    """
    try:
        # Check if collection exists, if not create it
        if collection_name not in db.list_collection_names():
            db.create_collection(collection_name)
            
        collection = db[collection_name]
        
        # Check if the data has an ID field
        id_field = data_json.get('id') or data_json.get('_id') or data_json.get(f'{collection_name}_id')
        
        if not id_field:
            # Generate a unique ID if none exists
            from uuid import uuid4
            id_field = str(uuid4())
            data_json['_id'] = id_field
            
            # Insert new document
            result = collection.insert_one(data_json)
            return {
                'status': 'inserted',
                'message': f'Document inserted successfully with ID: {result.inserted_id}',
                'id': str(result.inserted_id)
            }
        else:
            # Update existing document by ID
            query = {}
            
            # Figure out which ID field to use
            if '_id' in data_json:
                query['_id'] = data_json['_id']
            elif 'id' in data_json:
                query['id'] = data_json['id']
            else:
                query[f'{collection_name}_id'] = id_field
            
            result = collection.update_one(
                query,
                {'$set': data_json},
                upsert=True
            )
            
            if result.modified_count > 0:
                return {
                    'status': 'updated',
                    'message': f'Document updated successfully',
                    'id': id_field
                }
            elif result.upserted_id:
                return {
                    'status': 'inserted',
                    'message': f'Document inserted successfully',
                    'id': str(result.upserted_id)
                }
            else:
                return {
                    'status': 'unchanged',
                    'message': f'Document already exists with the same data',
                    'id': id_field
                }
    except Exception as e:
        print(f"Error updating collection {collection_name}: {e}")
        return {
            'status': 'error',
            'message': f'Database error: {str(e)}'
        }

