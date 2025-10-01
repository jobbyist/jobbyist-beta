import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

import { ChatbotButton } from "@/components/ChatbotButton";
import Preloader from "@/components/Preloader";

import AnimatedBackground from "@/components/AnimatedBackground";

import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import JobbyistPro from "./pages/JobbyistPro";
import Builder from "./pages/Builder";
import CompanyProfile from "./pages/CompanyProfile";
import AdminAudioUpload from "./pages/AdminAudioUpload";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import DataProtection from "./pages/DataProtection";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if this is the first visit in this session
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (hasVisited) {
      setIsLoading(false);
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem('hasVisited', 'true');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />

            {isLoading && <Preloader onLoadingComplete={handleLoadingComplete} />}

            <AnimatedBackground>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/pro" element={<JobbyistPro />} />
                  <Route path="/builder" element={<Builder />} />
                  <Route path="/company/:companyId" element={<CompanyProfile />} />
                  <Route path="/admin/audio-upload" element={<AdminAudioUpload />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/cookie-policy" element={<CookiePolicy />} />
                  <Route path="/data-protection" element={<DataProtection />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
                {/* AI Chatbot - Available on all pages */}
                <ChatbotButton />
              </BrowserRouter>
            </AnimatedBackground>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
