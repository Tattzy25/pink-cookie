-- Add saved_designs table for user dashboard functionality

-- Create saved_designs table if it doesn't exist
CREATE TABLE IF NOT EXISTS saved_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  name TEXT NOT NULL,
  elements JSONB,
  preview_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE saved_designs ENABLE ROW LEVEL SECURITY;

-- Create policies for saved_designs
CREATE POLICY "Users can view and edit their own saved designs" ON saved_designs
  FOR ALL USING (auth.uid() = user_id);
  
CREATE POLICY "Admins can view all saved designs" ON saved_designs
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS saved_designs_user_id_idx ON saved_designs(user_id);

-- Ensure storage bucket exists for user uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-uploads', 'user-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy for user uploads
CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'user-uploads' AND auth.uid() = (storage.foldername(name))[1]::uuid);

CREATE POLICY "Users can update their own files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'user-uploads' AND auth.uid() = (storage.foldername(name))[1]::uuid);

CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE USING (bucket_id = 'user-uploads' AND auth.uid() = (storage.foldername(name))[1]::uuid);

CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-uploads' AND auth.uid() = (storage.foldername(name))[1]::uuid);

CREATE POLICY "Public can view user files" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-uploads');