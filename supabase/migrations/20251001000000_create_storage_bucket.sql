
-- Create a storage bucket for subject files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('subject-files', 'Subject Files', true, 104857600, '{image/png,image/jpeg,image/jpg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation}');

-- Set up storage policy to allow public read access
CREATE POLICY "Public Access" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'subject-files');

-- Allow any authenticated user to upload files
CREATE POLICY "Upload Access" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'subject-files');
