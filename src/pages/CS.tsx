
import React from "react";
import { Link } from "react-router-dom";
import { Book, ChevronRight, Home, LogIn, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const subjects = [
  {
    id: "m3",
    name: "Mathematics 3 (M3)",
    description: "Calculus, Differential Equations, and more",
    icon: "📊",
  },
  {
    id: "ppl",
    name: "Principles of Programming Languages (PPL)",
    description: "Programming paradigms and language features",
    icon: "💻",
  },
  {
    id: "se",
    name: "Software Engineering (SE)",
    description: "SDLC, Design Patterns, and Development Methodologies",
    icon: "🔧",
  },
  {
    id: "dsa",
    name: "Data Structures and Algorithms (DSA)",
    description: "Arrays, Linked Lists, Trees, Graphs, and Algorithms",
    icon: "🔍",
  },
  {
    id: "mp",
    name: "Microprocessors (MP)",
    description: "Architecture, Assembly Programming, and Interfacing",
    icon: "🖥️",
  },
];

const CS = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white py-4 px-4 md:px-8 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <Book size={28} />
            <h1 className="text-xl md:text-2xl font-bold">SKN NotesHub</h1>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/discussion" className="text-white hover:text-white/80">
              Discussion
            </Link>
            {user ? (
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut size={20} className="mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            ) : (
              <Button variant="ghost" asChild>
                <Link to="/auth" className="flex items-center space-x-2">
                  <LogIn size={20} />
                  <span className="hidden md:inline">Login</span>
                </Link>
              </Button>
            )}
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
          <span>Computer Science</span>
        </div>

        <h1 className="page-title">Computer Science (CS)</h1>
        <h2 className="text-xl text-muted-foreground mb-8">
          Savitribai Phule Pune University (SPPU)
        </h2>

        {/* Subject Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card key={subject.id} className="subject-card">
              <Link to={`/cs/${subject.id}`}>
                <div className="flex flex-col h-full">
                  <div className="text-4xl mb-4">{subject.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{subject.name}</h3>
                  <p className="text-muted-foreground mb-4 flex-grow">
                    {subject.description}
                  </p>
                  <div className="flex justify-end">
                    <span className="text-primary flex items-center">
                      View Resources <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
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

export default CS;
