import { Layout } from '@/components/pharmacy/Layout';
import { Header } from '@/components/pharmacy/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LaporanPenjualan } from '@/components/laporan/LaporanPenjualan';
import { LaporanLabaRugi } from '@/components/laporan/LaporanLabaRugi';
import { LaporanNeraca } from '@/components/laporan/LaporanNeraca';

export default function Laporan() {
  return (
    <Layout>
      <Header
        title="Laporan Keuangan"
        subtitle="Lihat laporan penjualan, laba rugi, dan neraca apotek"
      />

      <Tabs defaultValue="penjualan" className="space-y-6">
        <TabsList className="grid w-full max-w-xl grid-cols-3">
          <TabsTrigger value="penjualan">Penjualan</TabsTrigger>
          <TabsTrigger value="labarugi">Laba Rugi</TabsTrigger>
          <TabsTrigger value="neraca">Neraca</TabsTrigger>
        </TabsList>

        <TabsContent value="penjualan">
          <LaporanPenjualan />
        </TabsContent>

        <TabsContent value="labarugi">
          <LaporanLabaRugi />
        </TabsContent>

        <TabsContent value="neraca">
          <LaporanNeraca />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
