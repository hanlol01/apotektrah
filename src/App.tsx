import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ResepBiasa from "./pages/ResepBiasa";
import ResepRacikan from "./pages/ResepRacikan";
import RiwayatTransaksi from "./pages/RiwayatTransaksi";
import StokObat from "./pages/StokObat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/resep-biasa" element={<ResepBiasa />} />
          <Route path="/resep-racikan" element={<ResepRacikan />} />
          <Route path="/riwayat" element={<RiwayatTransaksi />} />
          <Route path="/stok" element={<StokObat />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
