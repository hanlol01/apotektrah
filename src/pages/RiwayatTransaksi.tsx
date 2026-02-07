import { Layout } from '@/components/pharmacy/Layout';
import { Header } from '@/components/pharmacy/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Download, Eye, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockHistory = [
  {
    id: '1',
    transactionNumber: 'TRX-2024-001',
    patientName: 'Budi Santoso',
    doctorName: 'dr. Ahmad Santoso, Sp.PD',
    date: '2024-01-15 10:30',
    total: 125000,
    type: 'regular',
    status: 'paid',
    items: 3,
  },
  {
    id: '2',
    transactionNumber: 'TRX-2024-002',
    patientName: 'Siti Aminah',
    doctorName: 'dr. Siti Rahayu, Sp.A',
    date: '2024-01-15 11:15',
    total: 285000,
    type: 'compound',
    status: 'paid',
    items: 2,
  },
  {
    id: '3',
    transactionNumber: 'TRX-2024-003',
    patientName: 'Ahmad Rizki',
    doctorName: 'dr. Budi Pratama',
    date: '2024-01-15 13:45',
    total: 95000,
    type: 'regular',
    status: 'pending',
    items: 2,
  },
  {
    id: '4',
    transactionNumber: 'TRX-2024-004',
    patientName: 'Dewi Lestari',
    doctorName: 'dr. Ahmad Santoso, Sp.PD',
    date: '2024-01-15 14:20',
    total: 450000,
    type: 'compound',
    status: 'paid',
    items: 4,
  },
  {
    id: '5',
    transactionNumber: 'TRX-2024-005',
    patientName: 'Rudi Hermawan',
    doctorName: 'dr. Dewi Anggraini, Sp.KK',
    date: '2024-01-15 15:00',
    total: 75000,
    type: 'regular',
    status: 'cancelled',
    items: 1,
  },
  {
    id: '6',
    transactionNumber: 'TRX-2024-006',
    patientName: 'Indra Wijaya',
    doctorName: 'dr. Budi Pratama',
    date: '2024-01-14 09:00',
    total: 320000,
    type: 'compound',
    status: 'paid',
    items: 3,
  },
  {
    id: '7',
    transactionNumber: 'TRX-2024-007',
    patientName: 'Maya Putri',
    doctorName: 'dr. Siti Rahayu, Sp.A',
    date: '2024-01-14 10:30',
    total: 180000,
    type: 'regular',
    status: 'paid',
    items: 4,
  },
];

const statusStyles = {
  paid: 'badge-success',
  pending: 'badge-warning',
  cancelled: 'bg-destructive/15 text-destructive',
};

const statusLabels = {
  paid: 'Lunas',
  pending: 'Menunggu',
  cancelled: 'Dibatalkan',
};

export default function RiwayatTransaksi() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout>
      <Header
        title="Riwayat Transaksi"
        subtitle="Lihat dan kelola semua transaksi penjualan"
      />

      {/* Filters */}
      <div className="card-pharmacy mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari transaksi, pasien, atau dokter..."
              className="pl-10 input-pharmacy"
            />
          </div>

          <Select defaultValue="all">
            <SelectTrigger className="w-40 input-pharmacy">
              <SelectValue placeholder="Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="regular">Resep Biasa</SelectItem>
              <SelectItem value="compound">Resep Racikan</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-40 input-pharmacy">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="paid">Lunas</SelectItem>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>

          <Input type="date" className="w-40 input-pharmacy" />

          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="card-pharmacy">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="table-pharmacy">
            <thead>
              <tr>
                <th>No. Transaksi</th>
                <th>Pasien</th>
                <th>Dokter</th>
                <th>Tipe</th>
                <th>Item</th>
                <th>Total</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mockHistory.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    <span className="font-mono text-sm">{transaction.transactionNumber}</span>
                  </td>
                  <td>
                    <div>
                      <p className="font-medium">{transaction.patientName}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </td>
                  <td>
                    <p className="text-sm">{transaction.doctorName}</p>
                  </td>
                  <td>
                    <span
                      className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        transaction.type === 'compound' ? 'badge-info' : 'badge-success'
                      )}
                    >
                      {transaction.type === 'compound' ? 'Racikan' : 'Biasa'}
                    </span>
                  </td>
                  <td>{transaction.items} item</td>
                  <td className="font-medium">{formatCurrency(transaction.total)}</td>
                  <td>
                    <span
                      className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        statusStyles[transaction.status as keyof typeof statusStyles]
                      )}
                    >
                      {statusLabels[transaction.status as keyof typeof statusLabels]}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Menampilkan 1-7 dari 156 transaksi
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Sebelumnya
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
