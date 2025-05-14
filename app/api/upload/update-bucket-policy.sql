-- Create a function to update bucket policies
CREATE OR REPLACE FUNCTION update_bucket_policy(bucket_name TEXT)
RETURNS VOID AS $$
BEGIN
  -- Make sure the bucket exists
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = bucket_name
  ) THEN
    RAISE EXCEPTION 'Bucket % does not exist', bucket_name;
  END IF;

  -- Update the bucket to be public
  UPDATE storage.buckets
  SET public = TRUE
  WHERE name = bucket_name;
  
  -- Create a policy to allow anonymous uploads
  INSERT INTO storage.policies (name, bucket_id, operation, definition)
  VALUES 
    ('Allow Public Select', 
     (SELECT id FROM storage.buckets WHERE name = bucket_name), 
     'SELECT', 
     '{"statement":"SELECT", "effect":"ALLOW", "principal":"*"}'::JSONB)
  ON CONFLICT (name, bucket_id, operation) DO NOTHING;
  
  -- Create a policy to allow authenticated uploads
  INSERT INTO storage.policies (name, bucket_id, operation, definition)
  VALUES 
    ('Allow Authenticated Inserts', 
     (SELECT id FROM storage.buckets WHERE name = bucket_name), 
     'INSERT', 
     '{"statement":"INSERT", "effect":"ALLOW", "principal":"authenticated"}'::JSONB)
  ON CONFLICT (name, bucket_id, operation) DO NOTHING;
  
  -- Create a policy to allow anonymous uploads (for demo purposes)
  INSERT INTO storage.policies (name, bucket_id, operation, definition)
  VALUES 
    ('Allow Anonymous Inserts', 
     (SELECT id FROM storage.buckets WHERE name = bucket_name), 
     'INSERT', 
     '{"statement":"INSERT", "effect":"ALLOW", "principal":"*"}'::JSONB)
  ON CONFLICT (name, bucket_id, operation) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to the function
GRANT EXECUTE ON FUNCTION update_bucket_policy(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION update_bucket_policy(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION update_bucket_policy(TEXT) TO authenticated;
