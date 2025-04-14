
import React from "react";
import { Link } from "react-router-dom";
import { Book, Monitor, MessageSquare, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
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
            <Button variant="ghost" asChild>
              <Link to="/discussion" className="flex items-center space-x-2">
                <MessageSquare size={20} />
                <span className="hidden md:inline">Discussion</span>
              </Link>
            </Button>
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

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/90 to-primary text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Welcome to SKN NotesHub
            </h1>
            <p className="text-lg md:text-xl mb-6">
              Your one-stop resource for SPPU exam preparation
            </p>
          </div>
        </div>
      </section>

      {/* Branch Selection */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
            Select Your Branch
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* CS Branch */}
            <Card className="branch-card">
              <Link to="/cs">
                <div className="p-6 md:p-8 flex flex-col items-center text-center card-hover">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Monitor className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Computer Science</h3>
                  <p className="text-muted-foreground">
                    Access resources for M3, PPL, SE, DSA, and MP
                  </p>
                </div>
              </Link>
            </Card>
            
            {/* IT Branch */}
            <Card className="branch-card">
              <Link to="/it">
                <div className="p-6 md:p-8 flex flex-col items-center text-center card-hover">
                  <div className="bg-accent/10 p-4 rounded-full mb-4">
                    <Monitor className="h-10 w-10 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Information Technology</h3>
                  <p className="text-muted-foreground">
                    Access resources for CG, PA, DBMS, M3, and SE
                  </p>
                </div>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
            Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-background p-6 rounded-lg shadow-sm text-center">
              <Book className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Subject Notes</h3>
              <p className="text-muted-foreground">
                Access and share notes for all subjects
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm text-center">
              <Monitor className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Study Materials</h3>
              <p className="text-muted-foreground">
                PDFs, PPTs, and other resources for exam prep
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Discussion Groups</h3>
              <p className="text-muted-foreground">
                Connect with other students for doubt solving
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} SKN NotesHub - SPPU Resources Hub</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
