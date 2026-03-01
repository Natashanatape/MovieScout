-- Phase 4: Release Reminders Table
CREATE TABLE IF NOT EXISTS release_reminders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  remind_date DATE NOT NULL,
  notification_type VARCHAR(20) DEFAULT 'both',
  notified BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false,
  push_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, movie_id)
);

CREATE INDEX idx_release_reminders_user ON release_reminders(user_id);
CREATE INDEX idx_release_reminders_date ON release_reminders(remind_date);
CREATE INDEX idx_release_reminders_notified ON release_reminders(notified);
