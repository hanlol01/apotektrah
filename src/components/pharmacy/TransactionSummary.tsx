import { PrescriptionItem, CompoundPrescription } from '@/types/pharmacy';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Receipt, CreditCard, Printer } from 'lucide-react';

interface TransactionSummaryProps {
  items: PrescriptionItem[];
  compoundPrescriptions: CompoundPrescription[];
  notes: string;
  onNotesChange: (notes: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function TransactionSummary({
  items,
  compoundPrescriptions,
  notes,
  onNotesChange,
  onSubmit,
  isSubmitting = false,
}: TransactionSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const regularSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const compoundSubtotal = compoundPrescriptions.reduce((sum, p) => sum + p.subtotal, 0);
  const total = regularSubtotal + compoundSubtotal;

  const hasItems = items.length > 0 || compoundPrescriptions.length > 0;

  return (
    <div className="card-pharmacy sticky top-4">
      <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
        <Receipt className="h-5 w-5 text-primary" />
        Ringkasan Transaksi
      </h3>

      <div className="space-y-3 mb-6">
        {items.length > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Obat Resep ({items.length} item)</span>
            <span className="font-medium">{formatCurrency(regularSubtotal)}</span>
          </div>
        )}

        {compoundPrescriptions.length > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Racikan ({compoundPrescriptions.length} resep)
            </span>
            <span className="font-medium">{formatCurrency(compoundSubtotal)}</span>
          </div>
        )}

        {!hasItems && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Belum ada item ditambahkan
          </p>
        )}

        {hasItems && (
          <>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="space-y-2 mb-6">
        <Label className="text-sm font-medium">Catatan Transaksi</Label>
        <Textarea
          placeholder="Tambahkan catatan untuk transaksi ini..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="input-pharmacy min-h-[80px]"
        />
      </div>

      <div className="space-y-3">
        <Button
          onClick={onSubmit}
          disabled={!hasItems || isSubmitting}
          className="w-full btn-primary-gradient flex items-center justify-center gap-2"
        >
          <CreditCard className="h-4 w-4" />
          {isSubmitting ? 'Memproses...' : 'Proses Pembayaran'}
        </Button>

        <Button
          variant="outline"
          disabled={!hasItems}
          className="w-full"
        >
          <Printer className="h-4 w-4 mr-2" />
          Cetak Struk
        </Button>
      </div>

      {hasItems && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            Pastikan semua data sudah benar sebelum memproses transaksi
          </p>
        </div>
      )}
    </div>
  );
}
