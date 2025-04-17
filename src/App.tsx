import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ScanPage from "./pages/ScanPage";
import PaymentConfirmPage from "./pages/PaymentConfirmPage";
import TransactionDetailPage from "./pages/TransactionDetailPage";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import { initializeUserProfile } from "./utils/paymentUtils";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize demo data
    initializeUserProfile();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/confirm/:id" element={<PaymentConfirmPage />} />
            <Route path="/transaction/:id" element={<TransactionDetailPage />} />
            <Route path="/history" element={<TransactionHistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
