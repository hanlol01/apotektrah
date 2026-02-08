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
import { Download, TrendingUp, TrendingDown, Wallet, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfitLossReport } from '@/hooks/useReports';
import { format, subMonths } from 'date-fns';
import { id } from 'date-fns/locale';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export function LaporanLabaRugi() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { data: report, isLoading } = useProfitLossReport(selectedMonth);

  // Generate last 12 months options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      value: date.toISOString(),
      label: format(date, 'MMMM yyyy', { locale: id }),
    };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Memuat data laporan...</span>
      </div>
    );
  }

  const totalPendapatan = report?.revenue || 0;
  const totalHPP = report?.cogs || 0;
  const labaKotor = report?.grossProfit || 0;
  const totalBebanOperasional = report?.operatingExpenses || 0;
  const labaBersih = report?.netProfit || 0;
  const marginLabaBersih = report?.netMargin || 0;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Bulan:</span>
              <Select
                value={selectedMonth.toISOString()}
                onValueChange={(v) => setSelectedMonth(new Date(v))}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                <p className="text-2xl font-bold">{formatCurrency(totalPendapatan)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                <TrendingDown className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Beban</p>
                <p className="text-2xl font-bold">{formatCurrency(totalHPP + totalBebanOperasional)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl",
                labaBersih >= 0 ? "bg-emerald-500/10" : "bg-destructive/10"
              )}>
                <Wallet className={cn(
                  "h-6 w-6",
                  labaBersih >= 0 ? "text-emerald-500" : "text-destructive"
                )} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Laba Bersih</p>
                <p className={cn(
                  "text-2xl font-bold",
                  labaBersih >= 0 ? "text-emerald-600" : "text-destructive"
                )}>
                  {formatCurrency(labaBersih)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Margin: {marginLabaBersih.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income Statement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Laporan Laba Rugi</CardTitle>
          <p className="text-sm text-muted-foreground">
            Periode: {format(selectedMonth, 'MMMM yyyy', { locale: id })}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Pendapatan */}
            <div>
              <h3 className="font-semibold text-base mb-3 text-primary">PENDAPATAN</h3>
              <div className="space-y-2 pl-4">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Penjualan Obat</span>
                  <span>{formatCurrency(totalPendapatan)}</span>
                </div>
              </div>
              <div className="flex justify-between py-2 mt-2 border-t font-semibold">
                <span>Total Pendapatan</span>
                <span>{formatCurrency(totalPendapatan)}</span>
              </div>
            </div>

            {/* HPP */}
            <div>
              <h3 className="font-semibold text-base mb-3 text-primary">HARGA POKOK PENJUALAN</h3>
              <div className="space-y-2 pl-4">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Pembelian Obat (estimasi 70%)</span>
                  <span className="text-destructive">({formatCurrency(totalHPP)})</span>
                </div>
              </div>
              <div className="flex justify-between py-2 mt-2 border-t font-semibold">
                <span>Total HPP</span>
                <span className="text-destructive">({formatCurrency(totalHPP)})</span>
              </div>
            </div>

            {/* Laba Kotor */}
            <div className="flex justify-between py-3 bg-muted/50 px-4 rounded-lg font-semibold">
              <span>LABA KOTOR</span>
              <span className="text-emerald-600">{formatCurrency(labaKotor)}</span>
            </div>

            {/* Beban Operasional */}
            <div>
              <h3 className="font-semibold text-base mb-3 text-primary">BEBAN OPERASIONAL</h3>
              <div className="space-y-2 pl-4">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Biaya Operasional</span>
                  <span className="text-destructive">({formatCurrency(totalBebanOperasional)})</span>
                </div>
              </div>
              <div className="flex justify-between py-2 mt-2 border-t font-semibold">
                <span>Total Beban Operasional</span>
                <span className="text-destructive">({formatCurrency(totalBebanOperasional)})</span>
              </div>
            </div>

            {/* Laba Bersih */}
            <div className={cn(
              "flex justify-between py-4 px-4 rounded-lg font-bold text-lg",
              labaBersih >= 0 ? "bg-emerald-500/10" : "bg-destructive/10"
            )}>
              <span>LABA BERSIH</span>
              <span className={labaBersih >= 0 ? "text-emerald-600" : "text-destructive"}>
                {formatCurrency(labaBersih)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
