import { useState } from 'react';
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
import { Search, Filter, Download, Eye, Printer, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTransactions } from '@/hooks/useTransactions';
import { format } from 'date-fns';

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
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: transactions, isLoading } = useTransactions({
    type: typeFilter,
    status: statusFilter,
    startDate: dateFilter || undefined,
  });

  const filteredTransactions = transactions?.filter((tx) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      tx.transaction_number.toLowerCase().includes(search) ||
      tx.patients?.name?.toLowerCase().includes(search) ||
      tx.doctors?.name?.toLowerCase().includes(search)
    );
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getItemCount = (tx: typeof transactions extends (infer T)[] ? T : never) => {
    return tx.prescription_items.length + tx.compound_prescriptions.length;
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 input-pharmacy">
              <SelectValue placeholder="Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="regular">Resep Biasa</SelectItem>
              <SelectItem value="compound">Resep Racikan</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
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

          <Input
            type="date"
            className="w-40 input-pharmacy"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />

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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Memuat data transaksi...</span>
          </div>
        ) : (
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
                {filteredTransactions?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">
                      Belum ada transaksi
                    </td>
                  </tr>
                ) : (
                  filteredTransactions?.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        <span className="font-mono text-sm">{transaction.transaction_number}</span>
                      </td>
                      <td>
                        <div>
                          <p className="font-medium">{transaction.patients?.name || '-'}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(transaction.date), 'dd/MM/yyyy HH:mm')}
                          </p>
                        </div>
                      </td>
                      <td>
                        <p className="text-sm">{transaction.doctors?.name || '-'}</p>
                      </td>
                      <td>
                        <span
                          className={cn(
                            'text-xs px-2 py-1 rounded-full',
                            transaction.prescription_type === 'compound' ? 'badge-info' : 'badge-success'
                          )}
                        >
                          {transaction.prescription_type === 'compound' ? 'Racikan' : 'Biasa'}
                        </span>
                      </td>
                      <td>{getItemCount(transaction)} item</td>
                      <td className="font-medium">{formatCurrency(Number(transaction.total))}</td>
                      <td>
                        <span
                          className={cn(
                            'text-xs px-2 py-1 rounded-full',
                            statusStyles[transaction.payment_status as keyof typeof statusStyles]
                          )}
                        >
                          {statusLabels[transaction.payment_status as keyof typeof statusLabels]}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredTransactions && filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Menampilkan {filteredTransactions.length} transaksi
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
