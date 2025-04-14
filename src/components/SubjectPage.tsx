
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Book, ChevronRight, Home, Upload, Download, Tag } from "lucide-react";
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

interface SubjectPageProps {
  branch: string;
  subjectId: string;
  subjectName: string;
  description: string;
}

// Mock data for existing uploads
const mockUploads = [
  { id: 1, name: "End Sem Notes 2024.pdf", size: "2.4 MB", type: "PDF", tag: "Endsem" },
  { id: 2, name: "Mid Term Question Paper.pdf", size: "1.1 MB", type: "PDF", tag: "Midterm" },
  { id: 3, name: "Important Questions.docx", size: "890 KB", type: "DOCX", tag: "Imp Questions" },
  { id: 4, name: "Tutorial Solutions.pdf", size: "3.2 MB", type: "PDF", tag: "Tutorial" },
];

const SubjectPage: React.FC<SubjectPageProps> = ({
  branch,
  subjectId,
  subjectName,
  description,
}) => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [tag, setTag] = useState("Endsem");
  const [filter, setFilter] = useState("All");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }
    
    // Here we would normally upload to Supabase storage
    // Since we don't have Supabase connected yet, we'll just show a success message
    toast.success(`${file.name} uploaded successfully!`);
    setFile(null);
    
    // Reset the file input
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };
  
  const handleDownload = (fileName: string) => {
    // Here we would normally download from Supabase storage
    toast.success(`Downloading ${fileName}`);
  };
  
  const filteredUploads = filter === "All" 
    ? mockUploads 
    : mockUploads.filter(upload => upload.tag === filter);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white py-4 px-4 md:px-8 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <Book size={28} />
            <h1 className="text-xl md:text-2xl font-bold">SKN NotesHub</h1>
          </Link>
          <nav>
            <Link to="/discussion" className="text-white hover:text-white/80">
              Discussion
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-8 px-4">
        {/* Breadcrumbs */}
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

        <h1 className="page-title">{subjectName}</h1>
        <p className="text-lg text-muted-foreground mb-8">{description}</p>

        <Tabs defaultValue="view" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="view" className="flex items-center">
              <Download className="mr-2 h-4 w-4" /> View Resources
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center">
              <Upload className="mr-2 h-4 w-4" /> Upload Resources
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="py-4">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h3 className="text-xl font-semibold mb-2 md:mb-0">Available Resources</h3>
                <div className="flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px]">
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
              
              {filteredUploads.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Name</th>
                        <th className="text-left py-3 px-2">Type</th>
                        <th className="text-left py-3 px-2">Size</th>
                        <th className="text-left py-3 px-2">Tag</th>
                        <th className="text-right py-3 px-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUploads.map((upload) => (
                        <tr key={upload.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-2">{upload.name}</td>
                          <td className="py-3 px-2">{upload.type}</td>
                          <td className="py-3 px-2">{upload.size}</td>
                          <td className="py-3 px-2">
                            <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                              {upload.tag}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(upload.name)}
                              className="text-primary"
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
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No resources found with the selected filter.</p>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="upload" className="py-4">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Upload New Resource</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="file-upload" className="block text-sm font-medium text-foreground mb-2">
                    Select File
                  </label>
                  <Input
                    id="file-upload"
                    type="file"
                    className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
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
                    <SelectTrigger className="w-full" id="tag-select">
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
                  <Button onClick={handleUpload} className="w-full sm:w-auto" disabled={!file}>
                    <Upload className="mr-2 h-4 w-4" /> Upload Resource
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-background py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} SKN NotesHub - SPPU Resources Hub</p>
        </div>
      </footer>
    </div>
  );
};

export default SubjectPage;
