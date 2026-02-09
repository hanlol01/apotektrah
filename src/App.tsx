import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResepBiasa from "./pages/ResepBiasa";
import ResepRacikan from "./pages/ResepRacikan";
import RiwayatTransaksi from "./pages/RiwayatTransaksi";
import StokObat from "./pages/StokObat";
import StokOpname from "./pages/StokOpname";
import Laporan from "./pages/Laporan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/resep-biasa" element={<ProtectedRoute><ResepBiasa /></ProtectedRoute>} />
            <Route path="/resep-racikan" element={<ProtectedRoute><ResepRacikan /></ProtectedRoute>} />
            <Route path="/riwayat" element={<ProtectedRoute><RiwayatTransaksi /></ProtectedRoute>} />
            <Route path="/stok" element={<ProtectedRoute><StokObat /></ProtectedRoute>} />
            <Route path="/stok-opname" element={<ProtectedRoute><StokOpname /></ProtectedRoute>} />
            <Route path="/laporan" element={<ProtectedRoute><Laporan /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
