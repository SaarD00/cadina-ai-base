
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import RouteMiddleware from "./middleware";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Resume from "./pages/Resume";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumeCanvas from "./pages/ResumeCanvas";
import Applications from "./pages/Applications";
import Analytics from "./pages/Analytics";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Blog from "./pages/Blog";
import Marketplace from "./pages/Marketplace";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ResumePDF from "./pages/ResumePDF";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const App = () => (
  <div className="flex min-h-screen flex-col">
    <BrowserRouter>
      <RouteMiddleware>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/sign-in/*" element={<SignIn />} />
            <Route path="/sign-up/*" element={<SignUp />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/blog" element={<Blog />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/resume/builder/:resumeId" element={<ResumeBuilder />} />
            <Route path="/resume/canvas/:resumeId" element={<ResumeCanvas />} />
            <Route path="/resume/pdf/:resumeId" element={<ResumePDF />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account" element={<Account />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <VercelAnalytics />
        </TooltipProvider>
      </RouteMiddleware>
    </BrowserRouter>
  </div>
);

export default App;
