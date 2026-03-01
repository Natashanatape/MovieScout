const cron = require('node-cron');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Send email notification (placeholder - integrate with SendGrid)
const sendEmail = async (email, subject, body) => {
  console.log(`📧 Sending email to ${email}: ${subject}`);
  // TODO: Integrate SendGrid
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // await sgMail.send({ to: email, from: process.env.FROM_EMAIL, subject, html: body });
};

// Send push notification (placeholder)
const sendPushNotification = async (userId, title, body) => {
  console.log(`🔔 Sending push to user ${userId}: ${title}`);
  // TODO: Integrate Firebase Cloud Messaging
};

// Main reminder job - runs daily at 9 AM
const sendReleaseReminders = async () => {
  try {
    console.log('🔄 Running release reminders job...');

    const result = await pool.query(`
      SELECT rr.*, u.email, u.username, m.title, m.poster_path
      FROM release_reminders rr
      JOIN users u ON rr.user_id = u.id
      JOIN movies m ON rr.movie_id = m.id
      WHERE rr.remind_date = CURRENT_DATE 
      AND rr.notified = false
    `);

    console.log(`📬 Found ${result.rows.length} reminders to send`);

    for (const reminder of result.rows) {
      try {
        // Send email if enabled
        if (['email', 'both'].includes(reminder.notification_type)) {
          await sendEmail(
            reminder.email,
            `${reminder.title} releases today!`,
            `<h2>Hi ${reminder.username}!</h2><p>The movie "${reminder.title}" that you wanted to watch is releasing today!</p>`
          );
          
          await pool.query(
            'UPDATE release_reminders SET email_sent = true WHERE id = $1',
            [reminder.id]
          );
        }

        // Send push notification if enabled
        if (['push', 'both'].includes(reminder.notification_type)) {
          await sendPushNotification(
            reminder.user_id,
            'Movie Release Reminder',
            `${reminder.title} releases today!`
          );
          
          await pool.query(
            'UPDATE release_reminders SET push_sent = true WHERE id = $1',
            [reminder.id]
          );
        }

        // Mark as notified
        await pool.query(
          'UPDATE release_reminders SET notified = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
          [reminder.id]
        );

        console.log(`✅ Sent reminder for: ${reminder.title} to ${reminder.email}`);
      } catch (error) {
        console.error(`❌ Failed to send reminder ${reminder.id}:`, error);
      }
    }

    console.log('✅ Release reminders job completed');
  } catch (error) {
    console.error('❌ Release reminders job failed:', error);
  }
};

// Cleanup old reminders - runs daily at midnight
const cleanupOldReminders = async () => {
  try {
    console.log('🧹 Cleaning up old reminders...');
    
    const result = await pool.query(`
      DELETE FROM release_reminders 
      WHERE remind_date < CURRENT_DATE - INTERVAL '7 days'
      RETURNING id
    `);

    console.log(`🗑️ Deleted ${result.rows.length} old reminders`);
  } catch (error) {
    console.error('❌ Cleanup job failed:', error);
  }
};

// Initialize cron jobs
const initReminderJobs = () => {
  // Run daily at 9:00 AM
  cron.schedule('0 9 * * *', sendReleaseReminders);
  console.log('⏰ Reminder job scheduled: Daily at 9:00 AM');

  // Run daily at midnight
  cron.schedule('0 0 * * *', cleanupOldReminders);
  console.log('⏰ Cleanup job scheduled: Daily at 12:00 AM');
};

module.exports = { initReminderJobs, sendReleaseReminders };
