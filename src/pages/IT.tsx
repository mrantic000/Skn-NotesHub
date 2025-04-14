
import React from "react";
import { Link } from "react-router-dom";
import { Book, ChevronRight, Home } from "lucide-react";
import { Card } from "@/components/ui/card";

const subjects = [
  {
    id: "cg",
    name: "Computer Graphics (CG)",
    description: "2D & 3D Graphics, Algorithms and Visualization",
    icon: "🎨",
  },
  {
    id: "pa",
    name: "Programming and Applications (PA)",
    description: "Advanced programming concepts and applications",
    icon: "📱",
  },
  {
    id: "dbms",
    name: "Database Management Systems (DBMS)",
    description: "SQL, Normalization, Transactions and Database Design",
    icon: "🗄️",
  },
  {
    id: "m3",
    name: "Mathematics 3 (M3)",
    description: "Calculus, Differential Equations, and more",
    icon: "📊",
  },
  {
    id: "se",
    name: "Software Engineering (SE)",
    description: "SDLC, Design Patterns, and Development Methodologies",
    icon: "🔧",
  },
];

const IT = () => {
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
          <span>Information Technology</span>
        </div>

        <h1 className="page-title">Information Technology (IT)</h1>
        <h2 className="text-xl text-muted-foreground mb-8">
          Savitribai Phule Pune University (SPPU)
        </h2>

        {/* Subject Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card key={subject.id} className="subject-card">
              <Link to={`/it/${subject.id}`}>
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

export default IT;
