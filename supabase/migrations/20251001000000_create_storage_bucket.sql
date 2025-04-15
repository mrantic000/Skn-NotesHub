
-- Create a storage bucket for subject files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('subject-files', 'Subject Files', true, 104857600, '{image/png,image/jpeg,image/jpg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation}')
ON CONFLICT (id) DO NOTHING;

-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'User Avatars', true, 5242880, '{image/png,image/jpeg,image/jpg,image/gif}')
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public Access Subject Files" ON storage.objects;
DROP POLICY IF EXISTS "Upload Access Subject Files" ON storage.objects;
DROP POLICY IF EXISTS "Public Access Avatars" ON storage.objects;
DROP POLICY IF EXISTS "Upload Access Avatars" ON storage.objects;

-- Set up storage policy to allow public read access for subject files
CREATE POLICY "Public Access Subject Files" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'subject-files');

-- Allow any authenticated user to upload subject files
CREATE POLICY "Upload Access Subject Files" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'subject-files');

-- Set up storage policy to allow public read access for avatars
CREATE POLICY "Public Access Avatars" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'avatars');

-- Allow any authenticated user to upload avatars
CREATE POLICY "Upload Access Avatars" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'avatars');
