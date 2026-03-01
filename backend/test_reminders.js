require('dotenv').config();
const { sendReleaseReminders } = require('./src/utils/reminderCron');

console.log('🧪 Testing Release Reminders...\n');

sendReleaseReminders().then(() => {
  console.log('\n✅ Test completed');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});
