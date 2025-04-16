
import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
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
    <header className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white py-3 px-4 md:px-8 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <div className="flex items-center bg-white/95 p-1.5 rounded-full shadow-md">
            <img 
              src="/lovable-uploads/0747b574-70bb-4021-a6af-20052f48cb3a.png" 
              alt="SKN NotesHub Logo" 
              className="h-10 w-10 rounded-full"
            />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">SKN NotesHub</h1>
            <p className="text-xs text-white/80 hidden md:block">SMART STUDY STARTS HERE</p>
          </div>
        </Link>
        <nav className="flex items-center gap-3 md:gap-4">
          <Link to="/cs" className="text-white hover:text-white/80 transition-colors px-2 py-1 rounded hover:bg-white/10">
            CS
          </Link>
          <Link to="/it" className="text-white hover:text-white/80 transition-colors px-2 py-1 rounded hover:bg-white/10">
            IT
          </Link>
          <Button variant="ghost" asChild className="text-white hover:bg-white/10">
            <Link to="/discussion" className="flex items-center space-x-1">
              <MessageSquare size={18} />
              <span className="hidden md:inline">Discussion</span>
            </Link>
          </Button>
          {user ? (
            <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/10">
              <LogOut size={18} className="mr-0 md:mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          ) : (
            <Button variant="ghost" asChild className="text-white hover:bg-white/10">
              <Link to="/auth" className="flex items-center space-x-1">
                <LogIn size={18} />
                <span className="hidden md:inline">Login</span>
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
