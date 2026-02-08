import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Building2, Wallet, Scale } from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const aktivaLancar = [
  { label: 'Kas & Bank', amount: 85000000 },
  { label: 'Piutang Usaha', amount: 15000000 },
  { label: 'Persediaan Obat', amount: 120000000 },
  { label: 'Perlengkapan', amount: 5000000 },
];

const aktivaTetap = [
  { label: 'Peralatan Apotek', amount: 50000000 },
  { label: 'Akumulasi Penyusutan', amount: -10000000 },
  { label: 'Kendaraan', amount: 80000000 },
  { label: 'Akumulasi Penyusutan Kendaraan', amount: -16000000 },
];

const kewajibanLancar = [
  { label: 'Utang Usaha (Supplier)', amount: 45000000 },
  { label: 'Utang Gaji', amount: 12000000 },
  { label: 'Utang Pajak', amount: 3000000 },
];

const kewajibanJangkaPanjang = [
  { label: 'Utang Bank', amount: 50000000 },
];

const modalData = [
  { label: 'Modal Disetor', amount: 150000000 },
  { label: 'Laba Ditahan', amount: 48000000 },
  { label: 'Laba Periode Berjalan', amount: 21000000 },
];

export function LaporanNeraca() {
  const totalAktivaLancar = aktivaLancar.reduce((sum, d) => sum + d.amount, 0);
  const totalAktivaTetap = aktivaTetap.reduce((sum, d) => sum + d.amount, 0);
  const totalAktiva = totalAktivaLancar + totalAktivaTetap;

  const totalKewajibanLancar = kewajibanLancar.reduce((sum, d) => sum + d.amount, 0);
  const totalKewajibanJangkaPanjang = kewajibanJangkaPanjang.reduce((sum, d) => sum + d.amount, 0);
  const totalKewajiban = totalKewajibanLancar + totalKewajibanJangkaPanjang;

  const totalModal = modalData.reduce((sum, d) => sum + d.amount, 0);
  const totalPasiva = totalKewajiban + totalModal;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Per Tanggal:</span>
              <Input type="date" className="w-48" defaultValue="2024-01-31" />
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
            <p className="text-sm text-muted-foreground">Per 31 Januari 2024</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Aktiva Lancar */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-primary">Aktiva Lancar</h3>
                <div className="space-y-2 pl-4">
                  {aktivaLancar.map((item) => (
                    <div key={item.label} className="flex justify-between py-1">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between py-2 mt-2 border-t font-medium text-sm">
                  <span>Total Aktiva Lancar</span>
                  <span>{formatCurrency(totalAktivaLancar)}</span>
                </div>
              </div>

              {/* Aktiva Tetap */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-primary">Aktiva Tetap</h3>
                <div className="space-y-2 pl-4">
                  {aktivaTetap.map((item) => (
                    <div key={item.label} className="flex justify-between py-1">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className={`text-sm ${item.amount < 0 ? 'text-destructive' : ''}`}>
                        {item.amount < 0 ? `(${formatCurrency(Math.abs(item.amount))})` : formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between py-2 mt-2 border-t font-medium text-sm">
                  <span>Total Aktiva Tetap</span>
                  <span>{formatCurrency(totalAktivaTetap)}</span>
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
            <p className="text-sm text-muted-foreground">Per 31 Januari 2024</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Kewajiban Lancar */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-primary">Kewajiban Lancar</h3>
                <div className="space-y-2 pl-4">
                  {kewajibanLancar.map((item) => (
                    <div key={item.label} className="flex justify-between py-1">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between py-2 mt-2 border-t font-medium text-sm">
                  <span>Total Kewajiban Lancar</span>
                  <span>{formatCurrency(totalKewajibanLancar)}</span>
                </div>
              </div>

              {/* Kewajiban Jangka Panjang */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-primary">Kewajiban Jangka Panjang</h3>
                <div className="space-y-2 pl-4">
                  {kewajibanJangkaPanjang.map((item) => (
                    <div key={item.label} className="flex justify-between py-1">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between py-2 mt-2 border-t font-medium text-sm">
                  <span>Total Kewajiban Jangka Panjang</span>
                  <span>{formatCurrency(totalKewajibanJangkaPanjang)}</span>
                </div>
              </div>

              {/* Modal */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-primary">Modal</h3>
                <div className="space-y-2 pl-4">
                  {modalData.map((item) => (
                    <div key={item.label} className="flex justify-between py-1">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
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
      <Card className={totalAktiva === totalPasiva ? 'border-emerald-500/50' : 'border-destructive/50'}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
            <Scale className={`h-8 w-8 ${totalAktiva === totalPasiva ? 'text-emerald-500' : 'text-destructive'}`} />
            <div className="text-center">
              <p className={`text-lg font-semibold ${totalAktiva === totalPasiva ? 'text-emerald-600' : 'text-destructive'}`}>
                {totalAktiva === totalPasiva ? 'NERACA SEIMBANG' : 'NERACA TIDAK SEIMBANG'}
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
