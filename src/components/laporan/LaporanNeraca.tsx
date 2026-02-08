import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Building2, Wallet, Scale, Loader2 } from 'lucide-react';
import { useBalanceSheet } from '@/hooks/useReports';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export function LaporanNeraca() {
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0]);
  const { data: balanceSheet, isLoading } = useBalanceSheet(new Date(asOfDate));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Memuat data laporan...</span>
      </div>
    );
  }

  const totalAktiva = balanceSheet?.assets.totalAssets || 0;
  const totalKewajiban = balanceSheet?.liabilities.totalLiabilities || 0;
  const totalModal = balanceSheet?.equity.totalEquity || 0;
  const totalPasiva = totalKewajiban + totalModal;
  const isBalanced = balanceSheet?.isBalanced || false;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Per Tanggal:</span>
              <Input
                type="date"
                className="w-48"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
              />
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
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Aktiva</p>
                <p className="text-2xl font-bold">{formatCurrency(totalAktiva)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                <Wallet className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Kewajiban</p>
                <p className="text-2xl font-bold">{formatCurrency(totalKewajiban)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <Scale className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Modal</p>
                <p className="text-2xl font-bold">{formatCurrency(totalModal)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balance Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AKTIVA */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">AKTIVA</CardTitle>
            <p className="text-sm text-muted-foreground">
              Per {format(new Date(asOfDate), 'd MMMM yyyy', { locale: id })}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Aktiva Lancar */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-primary">Aktiva Lancar</h3>
                <div className="space-y-2 pl-4">
                  <div className="flex justify-between py-1">
                    <span className="text-sm text-muted-foreground">Kas & Bank</span>
                    <span className="text-sm">{formatCurrency(balanceSheet?.assets.cash || 0)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-sm text-muted-foreground">Persediaan Obat</span>
                    <span className="text-sm">{formatCurrency(balanceSheet?.assets.inventory || 0)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-sm text-muted-foreground">Piutang Usaha</span>
                    <span className="text-sm">{formatCurrency(balanceSheet?.assets.receivables || 0)}</span>
                  </div>
                </div>
                <div className="flex justify-between py-2 mt-2 border-t font-medium text-sm">
                  <span>Total Aktiva Lancar</span>
                  <span>{formatCurrency(balanceSheet?.assets.totalCurrent || 0)}</span>
                </div>
              </div>

              {/* Aktiva Tetap */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-primary">Aktiva Tetap</h3>
                <div className="space-y-2 pl-4">
                  <div className="flex justify-between py-1">
                    <span className="text-sm text-muted-foreground">Peralatan & Inventaris</span>
                    <span className="text-sm">{formatCurrency(balanceSheet?.assets.fixedAssets || 0)}</span>
                  </div>
                </div>
                <div className="flex justify-between py-2 mt-2 border-t font-medium text-sm">
                  <span>Total Aktiva Tetap</span>
                  <span>{formatCurrency(balanceSheet?.assets.fixedAssets || 0)}</span>
                </div>
              </div>

              {/* Total Aktiva */}
              <div className="flex justify-between py-3 bg-primary/10 px-4 rounded-lg font-bold">
                <span>TOTAL AKTIVA</span>
                <span>{formatCurrency(totalAktiva)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PASIVA */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">PASIVA</CardTitle>
            <p className="text-sm text-muted-foreground">
              Per {format(new Date(asOfDate), 'd MMMM yyyy', { locale: id })}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Kewajiban Lancar */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-primary">Kewajiban Lancar</h3>
                <div className="space-y-2 pl-4">
                  <div className="flex justify-between py-1">
                    <span className="text-sm text-muted-foreground">Hutang Usaha</span>
                    <span className="text-sm">{formatCurrency(balanceSheet?.liabilities.payables || 0)}</span>
                  </div>
                </div>
                <div className="flex justify-between py-2 mt-2 border-t font-medium text-sm">
                  <span>Total Kewajiban Lancar</span>
                  <span>{formatCurrency(balanceSheet?.liabilities.totalCurrent || 0)}</span>
                </div>
              </div>

              {/* Kewajiban Jangka Panjang */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-primary">Kewajiban Jangka Panjang</h3>
                <div className="space-y-2 pl-4">
                  <div className="flex justify-between py-1">
                    <span className="text-sm text-muted-foreground">Hutang Bank</span>
                    <span className="text-sm">{formatCurrency(balanceSheet?.liabilities.longTerm || 0)}</span>
                  </div>
                </div>
                <div className="flex justify-between py-2 mt-2 border-t font-medium text-sm">
                  <span>Total Kewajiban</span>
                  <span>{formatCurrency(totalKewajiban)}</span>
                </div>
              </div>

              {/* Modal */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-primary">Modal</h3>
                <div className="space-y-2 pl-4">
                  <div className="flex justify-between py-1">
                    <span className="text-sm text-muted-foreground">Modal Disetor</span>
                    <span className="text-sm">{formatCurrency(balanceSheet?.equity.capital || 0)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-sm text-muted-foreground">Laba Ditahan</span>
                    <span className="text-sm">{formatCurrency(balanceSheet?.equity.retainedEarnings || 0)}</span>
                  </div>
                </div>
                <div className="flex justify-between py-2 mt-2 border-t font-medium text-sm">
                  <span>Total Modal</span>
                  <span className="text-emerald-600">{formatCurrency(totalModal)}</span>
                </div>
              </div>

              {/* Total Pasiva */}
              <div className="flex justify-between py-3 bg-primary/10 px-4 rounded-lg font-bold">
                <span>TOTAL PASIVA</span>
                <span>{formatCurrency(totalPasiva)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balance Check */}
      <Card className={isBalanced ? 'border-emerald-500/50' : 'border-destructive/50'}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
            <Scale className={`h-8 w-8 ${isBalanced ? 'text-emerald-500' : 'text-destructive'}`} />
            <div className="text-center">
              <p className={`text-lg font-semibold ${isBalanced ? 'text-emerald-600' : 'text-destructive'}`}>
                {isBalanced ? 'NERACA SEIMBANG' : 'NERACA TIDAK SEIMBANG'}
              </p>
              <p className="text-sm text-muted-foreground">
                Aktiva: {formatCurrency(totalAktiva)} | Pasiva: {formatCurrency(totalPasiva)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
