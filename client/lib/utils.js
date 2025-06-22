import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string or object into a readable format
 */
export function formatDate(dateString) {
  if (!dateString) return '-';
  
  const date = typeof dateString === 'string' 
    ? new Date(dateString) 
    : dateString;
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format a date to just show time
 */
export function formatTime(dateString) {
  if (!dateString) return '-';
  
  const date = typeof dateString === 'string' 
    ? new Date(dateString) 
    : dateString;
  
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Calculate time difference between two dates and format it
 */
export function formatDuration(startDate, endDate) {
  if (!startDate || !endDate) return '-';
  
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const diffMs = end - start;
  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  return `${hours}h ${mins}m`;
}
