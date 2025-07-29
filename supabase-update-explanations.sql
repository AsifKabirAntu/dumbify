-- Update explanations table to reference users table properly
ALTER TABLE explanations 
DROP CONSTRAINT IF EXISTS explanations_user_id_fkey;

-- Add foreign key constraint to users table
ALTER TABLE explanations 
ADD CONSTRAINT explanations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Update RLS policies for explanations
DROP POLICY IF EXISTS "Users can view their own explanations" ON explanations;
DROP POLICY IF EXISTS "Users can insert their own explanations" ON explanations;
DROP POLICY IF EXISTS "Users can update their own explanations" ON explanations;
DROP POLICY IF EXISTS "Users can delete their own explanations" ON explanations;

-- Create new policies
CREATE POLICY "Users can view their own explanations" ON explanations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own explanations" ON explanations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own explanations" ON explanations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own explanations" ON explanations
  FOR DELETE USING (auth.uid() = user_id); 