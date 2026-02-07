import { FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  transactionNumber: string;
  patientName: string;
  date: string;
  total: number;
  type: 'regular' | 'compound';
  status: 'pending' | 'paid' | 'cancelled';
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    transactionNumber: 'TRX-2024-001',
    patientName: 'Budi Santoso',
    date: '2024-01-15 10:30',
    total: 125000,
    type: 'regular',
    status: 'paid',
  },
  {
    id: '2',
    transactionNumber: 'TRX-2024-002',
    patientName: 'Siti Aminah',
    date: '2024-01-15 11:15',
    total: 285000,
    type: 'compound',
    status: 'paid',
  },
  {
    id: '3',
    transactionNumber: 'TRX-2024-003',
    patientName: 'Ahmad Rizki',
    date: '2024-01-15 13:45',
    total: 95000,
    type: 'regular',
    status: 'pending',
  },
  {
    id: '4',
    transactionNumber: 'TRX-2024-004',
    patientName: 'Dewi Lestari',
    date: '2024-01-15 14:20',
    total: 450000,
    type: 'compound',
    status: 'paid',
  },
  {
    id: '5',
    transactionNumber: 'TRX-2024-005',
    patientName: 'Rudi Hermawan',
    date: '2024-01-15 15:00',
    total: 75000,
    type: 'regular',
    status: 'cancelled',
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

export function RecentTransactions() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="card-pharmacy">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Transaksi Terbaru
        </h3>
        <Link to="/riwayat">
          <Button variant="ghost" size="sm" className="text-primary">
            Lihat Semua
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="table-pharmacy">
          <thead>
            <tr>
              <th>No. Transaksi</th>
              <th>Pasien</th>
              <th>Tipe</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockTransactions.map((transaction) => (
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
                  <span className={cn(
                    'text-xs px-2 py-1 rounded-full',
                    transaction.type === 'compound' ? 'badge-info' : 'badge-success'
                  )}>
                    {transaction.type === 'compound' ? 'Racikan' : 'Biasa'}
                  </span>
                </td>
                <td className="font-medium">{formatCurrency(transaction.total)}</td>
                <td>
                  <span className={cn('text-xs px-2 py-1 rounded-full', statusStyles[transaction.status])}>
                    {statusLabels[transaction.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
