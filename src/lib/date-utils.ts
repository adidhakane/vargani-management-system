// Utility functions for date and time handling with IST timezone

/**
 * Get current date and time in IST timezone formatted for datetime-local input
 * @returns string in format "YYYY-MM-DDTHH:mm" in IST
 */
export function getCurrentISTDateTime(): string {
  const now = new Date()
  
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000 // 5.5 hours in milliseconds
  const istTime = new Date(now.getTime() + istOffset)
  
  // Format for datetime-local input: YYYY-MM-DDTHH:mm
  return istTime.toISOString().slice(0, 16)
}

/**
 * Convert a date to IST timezone
 * @param date - Date to convert
 * @returns Date object adjusted to IST
 */
export function toIST(date: Date): Date {
  const istOffset = 5.5 * 60 * 60 * 1000 // 5.5 hours in milliseconds
  return new Date(date.getTime() + istOffset)
}

/**
 * Get current date and time in IST as a formatted string
 * @returns string in IST timezone
 */
export function getCurrentISTString(): string {
  const now = new Date()
  return now.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

/**
 * Format date for datetime-local input in IST
 * @param date - Date to format (optional, defaults to current time)
 * @returns string formatted for datetime-local input in IST
 */
export function formatDateTimeLocalIST(date?: Date): string {
  const targetDate = date || new Date()
  
  // Create a new date in IST
  const istDate = new Date(targetDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  
  // Format as YYYY-MM-DDTHH:mm
  const year = istDate.getFullYear()
  const month = String(istDate.getMonth() + 1).padStart(2, '0')
  const day = String(istDate.getDate()).padStart(2, '0')
  const hours = String(istDate.getHours()).padStart(2, '0')
  const minutes = String(istDate.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hours}:${minutes}`
}
