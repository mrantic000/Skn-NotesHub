
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";

const subjects = [
  {
    id: "cg",
    name: "Computer Graphics (CG)",
    description: "2D & 3D Graphics, Algorithms and Visualization",
    icon: "🎨",
    colorClass: "bg-gradient-to-br from-purple-50 to-indigo-100",
    textClass: "text-purple-700"
  },
  {
    id: "pa",
    name: "Programming and Applications (PA)",
    description: "Advanced programming concepts and applications",
    icon: "📱",
    colorClass: "bg-gradient-to-br from-indigo-50 to-blue-100",
    textClass: "text-indigo-700"
  },
  {
    id: "dbms",
    name: "Database Management Systems (DBMS)",
    description: "SQL, Normalization, Transactions and Database Design",
    icon: "🗄️",
    colorClass: "bg-gradient-to-br from-blue-50 to-cyan-100",
    textClass: "text-blue-700"
  },
  {
    id: "m3",
    name: "Mathematics 3 (M3)",
    description: "Calculus, Differential Equations, and more",
    icon: "📊",
    colorClass: "bg-gradient-to-br from-cyan-50 to-teal-100",
    textClass: "text-cyan-700"
  },
  {
    id: "se",
    name: "Software Engineering (SE)",
    description: "SDLC, Design Patterns, and Development Methodologies",
    icon: "🔧",
    colorClass: "bg-gradient-to-br from-teal-50 to-green-100",
    textClass: "text-teal-700"
  },
];

const IT = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-8 px-4 bg-gradient-to-b from-slate-50 to-slate-100">
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

        <h1 className="text-3xl font-bold text-gradient-to-r from-purple-700 to-indigo-800 mb-2">Information Technology (IT)</h1>
        <h2 className="text-xl text-muted-foreground mb-8">
          Savitribai Phule Pune University (SPPU)
        </h2>

        {/* Subject Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card key={subject.id} className="subject-card border border-purple-100 shadow-md overflow-hidden">
              <Link to={`/it/${subject.id}`}>
                <div className="flex flex-col h-full">
                  <div className={`text-4xl mb-4 p-3 rounded-full w-16 h-16 flex items-center justify-center ${subject.colorClass}`}>
                    {subject.icon}
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${subject.textClass}`}>{subject.name}</h3>
                  <p className="text-muted-foreground mb-4 flex-grow">
                    {subject.description}
                  </p>
                  <div className="flex justify-end">
                    <span className={`${subject.textClass} flex items-center`}>
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
      <footer className="bg-gradient-to-r from-gray-100 to-slate-100 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} SKN NotesHub - SPPU Resources Hub</p>
        </div>
      </footer>
    </div>
  );
};

export default IT;
