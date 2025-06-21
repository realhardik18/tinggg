'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Calendar } from '@phosphor-icons/react';

export default function TaskForm({ onClose, onSave, task = null }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isRecurring: false,
    recurrenceDays: [],
    recurrenceTime: '09:00',
    feedbackPrompt: 'Did you complete this task?',
    expiryDate: ''
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // If we're editing a task, populate the form with existing data
  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        description: task.description || '',
        isRecurring: task.recurrence?.isRecurring || false,
        recurrenceDays: task.recurrence?.days || [],
        recurrenceTime: task.recurrence?.time || '09:00',
        feedbackPrompt: task.feedback_prompt || 'Did you complete this task?',
        expiryDate: task.expiry_date ? new Date(task.expiry_date).toISOString().split('T')[0] : ''
      });
    }
  }, [task]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'isRecurring') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'checkbox' && name.startsWith('day-')) {
      const day = name.replace('day-', '');
      setFormData(prev => {
        const newDays = prev.recurrenceDays.includes(day)
          ? prev.recurrenceDays.filter(d => d !== day)
          : [...prev.recurrenceDays, day];
        return { ...prev, recurrenceDays: newDays };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Determine if we're creating or updating
      const url = task ? `/api/tasks/${task._id}` : '/api/tasks';
      const method = task ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        onSave(data.data);
      } else {
        console.error('Error saving task:', data.error);
        // You might want to add error handling UI here
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // You might want to add error handling UI here
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">        <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{task ? 'Edit Task' : 'Add New Task'}</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Task Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">
                Task Name *
              </label>
              <input
                type="text"                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-transparent"
                placeholder="What do you want to track?"
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">
                Description
              </label>              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-transparent"
                placeholder="Add details about this task..."
              />
            </div>
            
            {/* Recurring Toggle */}
            <div className="flex items-center">
              <input                type="checkbox"
                id="isRecurring"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-zinc-700 rounded"
              />
              <label htmlFor="isRecurring" className="ml-2 block text-sm text-zinc-300">
                This is a recurring task
              </label>
            </div>
            
            {/* Recurring Options - only show if isRecurring is true */}
            {task.isRecurring && (
              <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
                <h3 className="text-sm font-medium text-zinc-300 mb-3">Recurrence Schedule</h3>
                
                {/* Days of Week */}
                <div className="mb-4">
                  <label className="block text-sm text-zinc-400 mb-2">Days of the week</label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <label
                        key={day}
                        className={`px-3 py-2 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                          task.recurrenceDays.includes(day)
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          name={`day-${day}`}
                          checked={task.recurrenceDays.includes(day)}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        {day.substring(0, 3)}
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Time */}
                <div>
                  <label htmlFor="recurrenceTime" className="block text-sm text-zinc-400 mb-2">
                    Time of day
                  </label>
                  <input
                    type="time"
                    id="recurrenceTime"
                    name="recurrenceTime"
                    value={task.recurrenceTime}
                    onChange={handleChange}
                    className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-transparent"
                  />
                </div>
              </div>
            )}
            
            {/* Feedback Prompt */}
            <div>
              <label htmlFor="feedbackPrompt" className="block text-sm font-medium text-zinc-300 mb-1">
                Feedback Prompt
              </label>
              <input
                type="text"
                id="feedbackPrompt"
                name="feedbackPrompt"
                value={task.feedbackPrompt}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-transparent"
                placeholder="What feedback do you want to collect?"
              />
              <p className="mt-1 text-xs text-zinc-500">
                This will be asked when users log their progress
              </p>
            </div>
            
            {/* Expiry Date */}
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-zinc-300 mb-1">
                Expiry Date (Optional)
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={task.expiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-transparent"
                />
                <Calendar 
                  size={20} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500" 
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-8 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-orange-500/20 flex items-center"
            >
              <Plus size={18} className="mr-1" />
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
