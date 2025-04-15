
import React from "react";
import { Link } from "react-router-dom";
import { Monitor, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-800 text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Welcome to SKN NotesHub
            </h1>
            <p className="text-lg md:text-xl mb-6 text-white/90">
              Your one-stop resource for SPPU exam preparation
            </p>
          </div>
        </div>
      </section>

      {/* Branch Selection */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10 text-gray-800">
            Select Your Branch
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* CS Branch */}
            <Card className="branch-card overflow-hidden border-purple-100 shadow-lg">
              <Link to="/cs">
                <div className="p-6 md:p-8 flex flex-col items-center text-center card-hover">
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-4 rounded-full mb-4">
                    <Monitor className="h-10 w-10 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-900">Computer Science</h3>
                  <p className="text-muted-foreground">
                    Access resources for M3, PPL, SE, DSA, and MP
                  </p>
                </div>
              </Link>
            </Card>
            
            {/* IT Branch */}
            <Card className="branch-card overflow-hidden border-purple-100 shadow-lg">
              <Link to="/it">
                <div className="p-6 md:p-8 flex flex-col items-center text-center card-hover">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-full mb-4">
                    <Monitor className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-purple-900">Information Technology</h3>
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
      <section className="bg-gradient-to-b from-slate-100 to-slate-200 py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10 text-gray-800">
            Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md text-center border border-purple-100">
              <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Monitor className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-indigo-900">Study Materials</h3>
              <p className="text-muted-foreground">
                PDFs, PPTs, and other resources for exam prep
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center border border-purple-100">
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-purple-900">Discussion Groups</h3>
              <p className="text-muted-foreground">
                Connect with other students for doubt solving
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center border border-purple-100">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Monitor className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-pink-900">Subject Notes</h3>
              <p className="text-muted-foreground">
                Access and share notes for all subjects
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-100 to-slate-100 py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} SKN NotesHub - SPPU Resources Hub</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
