-- Supabase Table Setup for Dumbify
-- Run this in your Supabase SQL Editor

-- Create explanations table
CREATE TABLE explanations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  tone TEXT NOT NULL CHECK (tone IN ('baby', 'sarcastic', 'influencer', 'professor')),
  explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE explanations ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own explanations
CREATE POLICY "Users can view their own explanations" ON explanations
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy: Users can only insert their own explanations
CREATE POLICY "Users can insert their own explanations" ON explanations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can only update their own explanations
CREATE POLICY "Users can update their own explanations" ON explanations
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy: Users can only delete their own explanations
CREATE POLICY "Users can delete their own explanations" ON explanations
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_explanations_user_id_created_at ON explanations(user_id, created_at DESC);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_explanations_updated_at BEFORE UPDATE ON explanations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 