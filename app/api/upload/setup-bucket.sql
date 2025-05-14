-- Create a function to create the bucket if it doesn't exist
CREATE OR REPLACE FUNCTION create_bucket_if_not_exists(bucket_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  -- Check if bucket exists
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = bucket_name
  ) INTO bucket_exists;
  
  -- Create bucket if it doesn't exist
  IF NOT bucket_exists THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES (bucket_name, bucket_name, TRUE);
    
    -- Set up public access policy
    INSERT INTO storage.policies (name, definition, bucket_id)
    VALUES 
      ('Public Read', '(bucket_id = '''||bucket_name||''' AND operation = ''SELECT'')', bucket_name),
      ('Authenticated Users Upload', '(bucket_id = '''||bucket_name||''' AND operation IN (''INSERT'', ''UPDATE'') AND auth.role() = ''authenticated'')', bucket_name),
      ('Public Upload', '(bucket_id = '''||bucket_name||''' AND operation IN (''INSERT'', ''UPDATE''))', bucket_name);
      
    RETURN 'Bucket created: ' || bucket_name;
  ELSE
    RETURN 'Bucket already exists: ' || bucket_name;
  END IF;
END;
$$;

-- Create the bucket using the function
SELECT create_bucket_if_not_exists('dessert-print-uploads');
