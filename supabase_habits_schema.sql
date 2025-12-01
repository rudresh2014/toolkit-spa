-- HABITS TABLE
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  frequency TEXT CHECK (frequency IN ('daily','weekly','monthly')) NOT NULL,
  icon TEXT DEFAULT 'Target',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HABIT LOGS TABLE
CREATE TABLE IF NOT EXISTS habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, date)
);

-- RLS
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their habits"
  ON habits FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert habits"
  ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update habits"
  ON habits FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete habits"
  ON habits FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their logs"
  ON habit_logs FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM habits WHERE habits.id = habit_logs.habit_id)
  );

CREATE POLICY "Users can insert logs"
  ON habit_logs FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM habits WHERE habits.id = habit_logs.habit_id)
  );
