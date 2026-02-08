import { useState } from 'react';
import { CompoundItem, CompoundPrescription, Medicine } from '@/types/pharmacy';
import { useMedicines, DbMedicine } from '@/hooks/useMedicines';
import { dosageOptions, instructionOptions, compoundForms } from '@/data/mockData';
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
import { Plus, Trash2, Beaker, FlaskConical, Loader2 } from 'lucide-react';

interface CompoundMedicineFormProps {
  prescriptions: CompoundPrescription[];
  onPrescriptionsChange: (prescriptions: CompoundPrescription[]) => void;
}

const COMPOUND_SERVICE_FEE = 15000; // Biaya racik per resep

// Helper to convert DB medicine to app medicine type
function toAppMedicine(dbMed: DbMedicine): Medicine {
  return {
    id: dbMed.id,
    name: dbMed.name,
    genericName: dbMed.generic_name,
    unit: dbMed.unit,
    price: Number(dbMed.price),
    stock: dbMed.stock,
    category: dbMed.category,
  };
}

export function CompoundMedicineForm({
  prescriptions,
  onPrescriptionsChange,
}: CompoundMedicineFormProps) {
  const { data: medicines, isLoading } = useMedicines();
  const [currentItems, setCurrentItems] = useState<CompoundItem[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [unit, setUnit] = useState('mg');
  const [form, setForm] = useState<'kapsul' | 'puyer' | 'salep' | 'sirup'>('kapsul');
  const [totalAmount, setTotalAmount] = useState(10);
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleMedicineSelect = (medicineId: string) => {
    const medicine = medicines?.find((m) => m.id === medicineId);
    setSelectedMedicine(medicine ? toAppMedicine(medicine) : null);
  };

  const handleAddIngredient = () => {
    if (!selectedMedicine || !quantity) return;

    const newItem: CompoundItem = {
      id: crypto.randomUUID(),
      medicine: selectedMedicine,
      quantity: parseFloat(quantity),
      unit,
    };

    setCurrentItems([...currentItems, newItem]);
    setSelectedMedicine(null);
    setQuantity('');
  };

  const handleRemoveIngredient = (itemId: string) => {
    setCurrentItems(currentItems.filter((item) => item.id !== itemId));
  };

  const calculateCompoundPrice = () => {
    const ingredientsCost = currentItems.reduce(
      (sum, item) => sum + item.medicine.price * (item.quantity / 100) * totalAmount,
      0
    );
    return ingredientsCost + COMPOUND_SERVICE_FEE;
  };

  const handleAddPrescription = () => {
    if (currentItems.length === 0 || !dosage) return;

    const newPrescription: CompoundPrescription = {
      id: crypto.randomUUID(),
      items: currentItems,
      form,
      totalAmount,
      dosage,
      instructions,
      serviceFee: COMPOUND_SERVICE_FEE,
      subtotal: calculateCompoundPrice(),
    };

    onPrescriptionsChange([...prescriptions, newPrescription]);

    // Reset form
    setCurrentItems([]);
    setForm('kapsul');
    setTotalAmount(10);
    setDosage('');
    setInstructions('');
  };

  const handleRemovePrescription = (prescriptionId: string) => {
    onPrescriptionsChange(prescriptions.filter((p) => p.id !== prescriptionId));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getFormLabel = (formValue: string) => {
    return compoundForms.find((f) => f.value === formValue)?.label || formValue;
  };

  return (
    <div className="card-pharmacy">
      <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
        <Beaker className="h-5 w-5 text-primary" />
        Komposisi Racikan
      </h3>

      {/* Add Ingredient Form */}
      <div className="p-4 bg-muted/30 rounded-lg mb-6">
        <h4 className="font-medium text-sm mb-4 flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-secondary" />
          Tambah Bahan Obat
        </h4>
        
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="space-y-2 col-span-2">
            <Label className="text-sm font-medium">Nama Obat/Bahan</Label>
            <Select onValueChange={handleMedicineSelect} value={selectedMedicine?.id || ''} disabled={isLoading}>
              <SelectTrigger className="input-pharmacy">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Memuat...</span>
                  </div>
                ) : (
                  <SelectValue placeholder="Pilih bahan obat" />
                )}
              </SelectTrigger>
              <SelectContent>
                {medicines?.map((med) => (
                  <SelectItem key={med.id} value={med.id}>
                    {med.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Jumlah per Unit</Label>
            <Input
              type="number"
              placeholder="contoh: 250"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="input-pharmacy"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Satuan</Label>
            <div className="flex gap-2">
              <Select onValueChange={setUnit} value={unit}>
                <SelectTrigger className="input-pharmacy flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mg">mg</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="tetes">tetes</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddIngredient}
                disabled={!selectedMedicine || !quantity}
                className="btn-secondary-gradient"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Current Ingredients */}
        {currentItems.length > 0 && (
          <div className="space-y-2 mb-4">
            <Label className="text-sm font-medium">Bahan yang Ditambahkan:</Label>
            <div className="flex flex-wrap gap-2">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-full border border-border"
                >
                  <span className="text-sm">
                    {item.medicine.name} {item.quantity} {item.unit}
                  </span>
                  <button
                    onClick={() => handleRemoveIngredient(item.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compound Details */}
        {currentItems.length > 0 && (
          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Bentuk Sediaan</Label>
              <Select onValueChange={(v) => setForm(v as typeof form)} value={form}>
                <SelectTrigger className="input-pharmacy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {compoundForms.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Jumlah {getFormLabel(form)}</Label>
              <Input
                type="number"
                min={1}
                value={totalAmount}
                onChange={(e) => setTotalAmount(parseInt(e.target.value) || 1)}
                className="input-pharmacy"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Aturan Pakai</Label>
              <Select onValueChange={setDosage} value={dosage}>
                <SelectTrigger className="input-pharmacy">
                  <SelectValue placeholder="Pilih" />
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
                    <SelectValue placeholder="Pilih" />
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
                  onClick={handleAddPrescription}
                  disabled={currentItems.length === 0 || !dosage}
                  className="btn-primary-gradient"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Simpan
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentItems.length > 0 && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Estimasi Biaya: <span className="font-semibold text-primary">{formatCurrency(calculateCompoundPrice())}</span>
              <span className="text-xs ml-2">(termasuk biaya racik {formatCurrency(COMPOUND_SERVICE_FEE)})</span>
            </p>
          </div>
        )}
      </div>

      {/* Saved Prescriptions */}
      {prescriptions.length > 0 ? (
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">Racikan Tersimpan:</h4>
          {prescriptions.map((prescription, index) => (
            <div
              key={prescription.id}
              className="p-4 bg-card rounded-lg border border-border"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">
                    R/ {index + 1} - {getFormLabel(prescription.form)} ({prescription.totalAmount} buah)
                  </p>
                  <div className="mt-2 space-y-1">
                    {prescription.items.map((item) => (
                      <p key={item.id} className="text-sm text-muted-foreground">
                        • {item.medicine.name} {item.quantity} {item.unit}
                      </p>
                    ))}
                  </div>
                  <p className="text-sm mt-2">
                    <span className="font-medium">S:</span> {prescription.dosage}{' '}
                    {prescription.instructions && `(${prescription.instructions})`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">
                    {formatCurrency(prescription.subtotal)}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePrescription(prescription.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-2"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Beaker className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Belum ada racikan ditambahkan</p>
          <p className="text-sm">Tambahkan bahan obat di atas untuk membuat racikan</p>
        </div>
      )}
    </div>
  );
}
