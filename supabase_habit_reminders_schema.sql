-- HABIT REMINDERS TABLE
CREATE TABLE IF NOT EXISTS habit_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_time TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id)
);

-- RLS
ALTER TABLE habit_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their reminders"
  ON habit_reminders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert reminders"
  ON habit_reminders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update reminders"
  ON habit_reminders FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete reminders"
  ON habit_reminders FOR DELETE USING (auth.uid() = user_id);
