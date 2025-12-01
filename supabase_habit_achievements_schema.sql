-- HABIT ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS habit_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id UUID NULL REFERENCES habits(id) ON DELETE CASCADE,
  achievement_key TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- RLS
ALTER TABLE habit_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view achievements"
  ON habit_achievements FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert achievements"
  ON habit_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update achievements"
  ON habit_achievements FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete achievements"
  ON habit_achievements FOR DELETE USING (auth.uid() = user_id);
