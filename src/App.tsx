
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import CS from "./pages/CS";
import IT from "./pages/IT";
import Discussion from "./pages/Discussion";
import Auth from "./pages/Auth";

// CS Subject Pages
import M3CS from "./pages/CSSubjects/M3";
import PPL from "./pages/CSSubjects/PPL";
import SECS from "./pages/CSSubjects/SE";
import DSA from "./pages/CSSubjects/DSA";
import MP from "./pages/CSSubjects/MP";

// IT Subject Pages
import CG from "./pages/ITSubjects/CG";
import PA from "./pages/ITSubjects/PA";
import DBMS from "./pages/ITSubjects/DBMS";
import M3IT from "./pages/ITSubjects/M3";
import SEIT from "./pages/ITSubjects/SE";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Branch Routes */}
            <Route path="/cs" element={<CS />} />
            <Route path="/it" element={<IT />} />
            
            {/* CS Subject Routes */}
            <Route path="/cs/m3" element={<M3CS />} />
            <Route path="/cs/ppl" element={<PPL />} />
            <Route path="/cs/se" element={<SECS />} />
            <Route path="/cs/dsa" element={<DSA />} />
            <Route path="/cs/mp" element={<MP />} />
            
            {/* IT Subject Routes */}
            <Route path="/it/cg" element={<CG />} />
            <Route path="/it/pa" element={<PA />} />
            <Route path="/it/dbms" element={<DBMS />} />
            <Route path="/it/m3" element={<M3IT />} />
            <Route path="/it/se" element={<SEIT />} />
            
            {/* Discussion Route */}
            <Route path="/discussion" element={<Discussion />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
