import { useState } from 'react';
import { Medicine, PrescriptionItem } from '@/types/pharmacy';
import { mockMedicines, dosageOptions, instructionOptions } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Pill, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MedicineSelectorProps {
  items: PrescriptionItem[];
  onItemsChange: (items: PrescriptionItem[]) => void;
}

const categoryBadges: Record<string, { label: string; className: string }> = {
  'obat-keras': { label: 'Obat Keras', className: 'badge-warning' },
  'obat-bebas': { label: 'Bebas', className: 'badge-success' },
  'obat-bebas-terbatas': { label: 'Bebas Terbatas', className: 'badge-info' },
  narkotika: { label: 'Narkotika', className: 'bg-destructive/15 text-destructive' },
  psikotropika: { label: 'Psikotropika', className: 'bg-destructive/15 text-destructive' },
};

export function MedicineSelector({ items, onItemsChange }: MedicineSelectorProps) {
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleMedicineSelect = (medicineId: string) => {
    const medicine = mockMedicines.find((m) => m.id === medicineId);
    setSelectedMedicine(medicine || null);
  };

  const handleAddItem = () => {
    if (!selectedMedicine || !dosage) return;

    const newItem: PrescriptionItem = {
      id: crypto.randomUUID(),
      medicine: selectedMedicine,
      quantity,
      dosage,
      instructions,
      subtotal: selectedMedicine.price * quantity,
    };

    onItemsChange([...items, newItem]);
    
    // Reset form
    setSelectedMedicine(null);
    setQuantity(1);
    setDosage('');
    setInstructions('');
  };

  const handleRemoveItem = (itemId: string) => {
    onItemsChange(items.filter((item) => item.id !== itemId));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="card-pharmacy">
      <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
        <Pill className="h-5 w-5 text-primary" />
        Daftar Obat
      </h3>

      {/* Add Medicine Form */}
      <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Nama Obat</Label>
          <Select onValueChange={handleMedicineSelect} value={selectedMedicine?.id || ''}>
            <SelectTrigger className="input-pharmacy">
              <SelectValue placeholder="Pilih obat" />
            </SelectTrigger>
            <SelectContent>
              {mockMedicines.map((med) => (
                <SelectItem key={med.id} value={med.id}>
                  <div className="flex items-center gap-2">
                    <span>{med.name}</span>
                    <span className={cn('text-xs px-1.5 py-0.5 rounded', categoryBadges[med.category].className)}>
                      {categoryBadges[med.category].label}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedMedicine && (
            <p className="text-xs text-muted-foreground">
              Stok: {selectedMedicine.stock} {selectedMedicine.unit} | {formatCurrency(selectedMedicine.price)}/{selectedMedicine.unit}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Jumlah</Label>
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="input-pharmacy"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Aturan Pakai</Label>
          <Select onValueChange={setDosage} value={dosage}>
            <SelectTrigger className="input-pharmacy">
              <SelectValue placeholder="Pilih aturan pakai" />
            </SelectTrigger>
            <SelectContent>
              {dosageOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Keterangan</Label>
          <div className="flex gap-2">
            <Select onValueChange={setInstructions} value={instructions}>
              <SelectTrigger className="input-pharmacy flex-1">
                <SelectValue placeholder="Pilih keterangan" />
              </SelectTrigger>
              <SelectContent>
                {instructionOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleAddItem}
              disabled={!selectedMedicine || !dosage}
              className="btn-primary-gradient"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Items Table */}
      {items.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="table-pharmacy">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Obat</th>
                <th>Kategori</th>
                <th>Jumlah</th>
                <th>Aturan Pakai</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div>
                      <p className="font-medium">{item.medicine.name}</p>
                      <p className="text-xs text-muted-foreground">{item.medicine.genericName}</p>
                    </div>
                  </td>
                  <td>
                    <span className={cn('text-xs px-2 py-1 rounded-full', categoryBadges[item.medicine.category].className)}>
                      {categoryBadges[item.medicine.category].label}
                    </span>
                  </td>
                  <td>
                    {item.quantity} {item.medicine.unit}
                  </td>
                  <td>
                    <div>
                      <p>{item.dosage}</p>
                      {item.instructions && (
                        <p className="text-xs text-muted-foreground">{item.instructions}</p>
                      )}
                    </div>
                  </td>
                  <td className="font-medium">{formatCurrency(item.subtotal)}</td>
                  <td>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Pill className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Belum ada obat ditambahkan</p>
          <p className="text-sm">Pilih obat dari daftar di atas</p>
        </div>
      )}

      {/* Warning for controlled substances */}
      {items.some((item) => ['narkotika', 'psikotropika', 'obat-keras'].includes(item.medicine.category)) && (
        <div className="mt-4 flex items-start gap-3 p-4 bg-warning/10 rounded-lg border border-warning/20">
          <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-warning">Perhatian</p>
            <p className="text-muted-foreground">
              Resep ini mengandung obat keras/narkotika/psikotropika. Pastikan resep asli disimpan dan dicatat sesuai ketentuan yang berlaku.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
