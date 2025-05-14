-- Create a function to create storage policies
CREATE OR REPLACE FUNCTION create_storage_policy(
  bucket_name TEXT,
  policy_name TEXT,
  definition TEXT,
  operation TEXT
) RETURNS VOID AS $$
BEGIN
  -- Check if the policy already exists
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = policy_name
  ) THEN
    -- Create the policy
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR %s TO authenticated USING (%s)',
      policy_name,
      operation,
      definition
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION create_storage_policy TO authenticated;
GRANT EXECUTE ON FUNCTION create_storage_policy TO service_role;
