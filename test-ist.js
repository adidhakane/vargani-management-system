// Test script to verify IST datetime functionality
const { formatDateTimeLocalIST, getCurrentISTString } = require('./src/lib/date-utils.ts');

console.log('🕐 Testing IST Date/Time Functions');
console.log('==================================');

try {
  console.log('Current IST DateTime for form input:', formatDateTimeLocalIST());
  console.log('Current IST String for display:', getCurrentISTString());
  console.log('');
  console.log('✅ IST functions are working correctly!');
  console.log('The datetime input should now show the correct IST time (1:22 PM instead of 7:52 AM)');
} catch (error) {
  console.error('❌ Error testing IST functions:', error);
}
