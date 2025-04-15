import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home, Upload, Download, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";

interface SubjectPageProps {
  branch: string;
  subjectId: string;
  subjectName: string;
  description: string;
}

interface SubjectContent {
  id: string;
  file_name: string;
  file_type: string;
  file_size: string;
  tag: string;
  file_url: string;
}

const SubjectPage: React.FC<SubjectPageProps> = ({
  branch,
  subjectId,
  subjectName,
  description,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [tag, setTag] = useState("Endsem");
  const [filter, setFilter] = useState("All");
  const [uploads, setUploads] = useState<SubjectContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    fetchSubjectContent();
  }, [branch, subjectId, filter]);
  
  const fetchSubjectContent = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('subject_content')
        .select('*')
        .eq('branch', branch)
        .eq('subject_id', subjectId);
        
      if (filter !== 'All') {
        query = query.eq('tag', filter);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setUploads(data as SubjectContent[]);
      }
    } catch (error) {
      console.error('Error fetching subject content:', error);
      toast.error('Failed to load resources. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${subjectId}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${branch}/${subjectId}/${fileName}`;
      
      const { data: storageData, error: storageError } = await supabase.storage
        .from('subject-files')
        .upload(filePath, file);
        
      if (storageError) throw storageError;
      
      const { data: urlData } = await supabase.storage
        .from('subject-files')
        .getPublicUrl(filePath);
        
      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL for the file');
      }
      
      const { error: dbError } = await supabase.from('subject_content').insert({
        branch: branch,
        subject_id: subjectId,
        file_name: file.name,
        file_type: fileExt?.toUpperCase() || 'DOC',
        file_size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        file_url: urlData.publicUrl,
        tag: tag
      });
      
      if (dbError) throw dbError;
      
      toast.success(`${file.name} uploaded successfully!`);
      setFile(null);
      
      fetchSubjectContent();
      
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(`Upload failed: ${error.message || 'Please try again'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Downloading ${fileName}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto py-8 px-4 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-item flex items-center">
            <Home size={16} className="mr-1" /> Home
          </Link>
          <span className="breadcrumb-separator">
            <ChevronRight size={16} />
          </span>
          <Link to={`/${branch.toLowerCase()}`} className="breadcrumb-item">
            {branch === "cs" ? "Computer Science" : "Information Technology"}
          </Link>
          <span className="breadcrumb-separator">
            <ChevronRight size={16} />
          </span>
          <span>{subjectName}</span>
        </div>

        <h1 className="text-3xl font-bold text-gradient-to-r from-indigo-700 to-purple-800 mb-2">{subjectName}</h1>
        <p className="text-lg text-muted-foreground mb-8">{description}</p>

        <Tabs defaultValue="view" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2 bg-slate-100 p-1">
            <TabsTrigger value="view" className="flex items-center data-[state=active]:bg-gradient-to-r from-indigo-600 to-purple-600 data-[state=active]:text-white">
              <Download className="mr-2 h-4 w-4" /> View Resources
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center data-[state=active]:bg-gradient-to-r from-indigo-600 to-purple-600 data-[state=active]:text-white">
              <Upload className="mr-2 h-4 w-4" /> Upload Resources
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="py-4">
            <Card className="p-6 border border-purple-100 shadow-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h3 className="text-xl font-semibold mb-2 md:mb-0 text-indigo-800">Available Resources</h3>
                <div className="flex items-center">
                  <Tag className="mr-2 h-4 w-4 text-purple-600" />
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px] border-purple-200">
                      <SelectValue placeholder="Filter by tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Resources</SelectItem>
                      <SelectItem value="Endsem">Endsem</SelectItem>
                      <SelectItem value="Midterm">Midterm</SelectItem>
                      <SelectItem value="Imp Questions">Important Questions</SelectItem>
                      <SelectItem value="Tutorial">Tutorial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-muted-foreground mt-4">Loading resources...</p>
                </div>
              ) : uploads.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-purple-100">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-100 to-purple-50 text-left">
                        <th className="py-3 px-4 font-semibold text-indigo-900">Name</th>
                        <th className="py-3 px-4 font-semibold text-indigo-900">Type</th>
                        <th className="py-3 px-4 font-semibold text-indigo-900">Size</th>
                        <th className="py-3 px-4 font-semibold text-indigo-900">Tag</th>
                        <th className="text-right py-3 px-4 font-semibold text-indigo-900">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-100">
                      {uploads.map((upload) => (
                        <tr key={upload.id} className="hover:bg-purple-50 transition-colors">
                          <td className="py-3 px-4">{upload.file_name}</td>
                          <td className="py-3 px-4">{upload.file_type}</td>
                          <td className="py-3 px-4">{upload.file_size}</td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2 py-1 text-xs rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 font-medium">
                              {upload.tag}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(upload.file_url, upload.file_name)}
                              className="text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                            >
                              <Download className="mr-1 h-4 w-4" /> Download
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-purple-200">
                  <p className="text-muted-foreground">No resources found with the selected filter.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 border-purple-200 text-purple-700 hover:bg-purple-50"
                    onClick={() => setFilter("All")}
                  >
                    View all resources
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="upload" className="py-4">
            <Card className="p-6 border border-purple-100 shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-indigo-800">Upload New Resource</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="file-upload" className="block text-sm font-medium text-foreground mb-2">
                    Select File
                  </label>
                  <Input
                    id="file-upload"
                    type="file"
                    className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 border-purple-200"
                    onChange={handleFileChange}
                  />
                  {file && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="tag-select" className="block text-sm font-medium text-foreground mb-2">
                    Tag
                  </label>
                  <Select value={tag} onValueChange={setTag}>
                    <SelectTrigger className="w-full border-purple-200" id="tag-select">
                      <SelectValue placeholder="Select a tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Endsem">End Semester</SelectItem>
                      <SelectItem value="Midterm">Mid Term</SelectItem>
                      <SelectItem value="Imp Questions">Important Questions</SelectItem>
                      <SelectItem value="Tutorial">Tutorial</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={handleUpload} 
                    className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800" 
                    disabled={!file || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" /> Upload Resource
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-gradient-to-r from-gray-100 to-slate-100 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} SKN NotesHub - SPPU Resources Hub</p>
        </div>
      </footer>
    </div>
  );
};

export default SubjectPage;
