import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, TrendingUp, ShoppingCart, Receipt, Users, Loader2 } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useSalesReport } from '@/hooks/useReports';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatShortCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}jt`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}rb`;
  }
  return formatCurrency(amount);
};

export function LaporanPenjualan() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const { data: report, isLoading } = useSalesReport(period);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Memuat data laporan...</span>
      </div>
    );
  }

  const totalPenjualan = report?.totalSales || 0;
  const totalTransaksi = report?.totalTransactions || 0;
  const rataRata = report?.averageTransaction || 0;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Periode:</span>
              <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">7 Hari Terakhir</SelectItem>
                  <SelectItem value="month">Bulan Ini</SelectItem>
                  <SelectItem value="year">Tahun Ini</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="ml-auto flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Penjualan</p>
                <p className="text-2xl font-bold">{formatCurrency(totalPenjualan)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <Receipt className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transaksi</p>
                <p className="text-2xl font-bold">{totalTransaksi}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                <ShoppingCart className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resep Biasa</p>
                <p className="text-2xl font-bold">{report?.regularPrescriptions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                <Users className="h-6 w-6 text-violet-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rata-rata/Transaksi</p>
                <p className="text-2xl font-bold">{formatCurrency(rataRata)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Grafik Penjualan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {report?.dailySales && report.dailySales.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={report.dailySales}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      className="text-xs"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                    />
                    <YAxis 
                      tickFormatter={formatShortCurrency}
                      className="text-xs"
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), 'Penjualan']}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString('id-ID');
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary) / 0.2)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Belum ada data penjualan
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Jumlah Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {report?.dailySales && report.dailySales.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={report.dailySales}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      className="text-xs"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                    />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      formatter={(value: number) => [value, 'Transaksi']}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString('id-ID');
                      }}
                    />
                    <Bar
                      dataKey="transactions"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Belum ada data transaksi
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Produk Terlaris</CardTitle>
        </CardHeader>
        <CardContent>
          {report?.topProducts && report.topProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Obat</TableHead>
                  <TableHead className="text-right">Qty Terjual</TableHead>
                  <TableHead className="text-right">Pendapatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.topProducts.map((product, index) => (
                  <TableRow key={product.name}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">{product.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada data produk terjual
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
