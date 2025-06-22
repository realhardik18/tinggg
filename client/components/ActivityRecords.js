'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

export default function ActivityRecords({ userId = 'default_user' }) {
  const [groupedRecords, setGroupedRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecords() {
      try {
        setLoading(true);
        const response = await fetch(`/api/records?userId=${userId}&groupByActivity=true`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch records');
        }
        
        const data = await response.json();
        setGroupedRecords(data.groupedRecords || {});
      } catch (err) {
        console.error('Error fetching records:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRecords();
  }, [userId]);

  if (loading) return <div>Loading records...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Activity Records</h1>
      
      {Object.keys(groupedRecords).length === 0 ? (
        <p>No records found.</p>
      ) : (
        Object.entries(groupedRecords).map(([activityId, { activity, records }]) => (
          <Card key={activityId} className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">{activity.task}</h2>
              <p className="text-sm text-gray-500">Activity ID: {activity._id}</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record._id}>
                      <TableCell>{formatDate(record.createdAt)}</TableCell>
                      <TableCell>{record.completed ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{record.details || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}