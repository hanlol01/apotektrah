import { Layout } from '@/components/pharmacy/Layout';
import { Header } from '@/components/pharmacy/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Plus, AlertTriangle, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockMedicines } from '@/data/mockData';

const categoryBadges: Record<string, { label: string; className: string }> = {
  'obat-keras': { label: 'Obat Keras', className: 'badge-warning' },
  'obat-bebas': { label: 'Bebas', className: 'badge-success' },
  'obat-bebas-terbatas': { label: 'Bebas Terbatas', className: 'badge-info' },
  narkotika: { label: 'Narkotika', className: 'bg-destructive/15 text-destructive' },
  psikotropika: { label: 'Psikotropika', className: 'bg-destructive/15 text-destructive' },
};

export default function StokObat() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 50) return { label: 'Menipis', className: 'bg-destructive/15 text-destructive' };
    if (stock <= 100) return { label: 'Sedang', className: 'badge-warning' };
    return { label: 'Aman', className: 'badge-success' };
  };

  const lowStockMedicines = mockMedicines.filter((m) => m.stock <= 100);

  return (
    <Layout>
      <Header
        title="Stok Obat"
        subtitle="Kelola inventaris dan stok obat apotek"
      />

      {/* Low Stock Alert */}
      {lowStockMedicines.length > 0 && (
        <div className="card-pharmacy mb-6 border-warning/30 bg-warning/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Peringatan Stok Menipis</p>
              <p className="text-sm text-muted-foreground mt-1">
                {lowStockMedicines.length} obat memiliki stok di bawah batas minimum.
                Segera lakukan pengadaan untuk menghindari kehabisan stok.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card-pharmacy mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama obat atau nama generik..."
              className="pl-10 input-pharmacy"
            />
          </div>

          <Select defaultValue="all">
            <SelectTrigger className="w-48 input-pharmacy">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="obat-keras">Obat Keras</SelectItem>
              <SelectItem value="obat-bebas">Obat Bebas</SelectItem>
              <SelectItem value="obat-bebas-terbatas">Obat Bebas Terbatas</SelectItem>
              <SelectItem value="narkotika">Narkotika</SelectItem>
              <SelectItem value="psikotropika">Psikotropika</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-40 input-pharmacy">
              <SelectValue placeholder="Status Stok" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="low">Menipis</SelectItem>
              <SelectItem value="medium">Sedang</SelectItem>
              <SelectItem value="safe">Aman</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>

          <Button className="btn-primary-gradient flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tambah Obat
          </Button>
        </div>
      </div>

      {/* Stock Table */}
      <div className="card-pharmacy">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="table-pharmacy">
            <thead>
              <tr>
                <th>Nama Obat</th>
                <th>Nama Generik</th>
                <th>Kategori</th>
                <th>Satuan</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockMedicines.map((medicine) => {
                const stockStatus = getStockStatus(medicine.stock);
                return (
                  <tr key={medicine.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium">{medicine.name}</span>
                      </div>
                    </td>
                    <td className="text-muted-foreground">{medicine.genericName}</td>
                    <td>
                      <span
                        className={cn(
                          'text-xs px-2 py-1 rounded-full',
                          categoryBadges[medicine.category].className
                        )}
                      >
                        {categoryBadges[medicine.category].label}
                      </span>
                    </td>
                    <td>{medicine.unit}</td>
                    <td className="font-medium">{formatCurrency(medicine.price)}</td>
                    <td className="font-medium">{medicine.stock}</td>
                    <td>
                      <span
                        className={cn('text-xs px-2 py-1 rounded-full', stockStatus.className)}
                      >
                        {stockStatus.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
