import { useState } from 'react';
import { Layout } from '@/components/pharmacy/Layout';
import { Header } from '@/components/pharmacy/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  Plus,
  Trash2,
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  MinusCircle,
  PlusCircle,
  Save,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockMedicines } from '@/data/mockData';
import { Medicine } from '@/types/pharmacy';
import { toast } from 'sonner';

interface OpnameItem {
  id: string;
  medicine: Medicine;
  systemStock: number;
  actualStock: number;
  difference: number;
  reason: string;
}

interface OpnameTransaction {
  id: string;
  opnameNumber: string;
  date: string;
  items: OpnameItem[];
  notes: string;
  status: 'draft' | 'completed';
  createdBy: string;
}

const reasonOptions = [
  'Kedaluwarsa',
  'Rusak/Pecah',
  'Kesalahan Input',
  'Hilang',
  'Bonus/Sampel',
  'Retur Supplier',
  'Lainnya',
];

export default function StokOpname() {
  const [searchTerm, setSearchTerm] = useState('');
  const [opnameItems, setOpnameItems] = useState<OpnameItem[]>([]);
  const [notes, setNotes] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<string>('');

  const generateOpnameNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SO-${dateStr}-${random}`;
  };

  const filteredMedicines = mockMedicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addMedicineToOpname = (medicineId: string) => {
    const medicine = mockMedicines.find((m) => m.id === medicineId);
    if (!medicine) return;

    // Check if already added
    if (opnameItems.some((item) => item.medicine.id === medicineId)) {
      toast.error('Obat sudah ada dalam daftar opname');
      return;
    }

    const newItem: OpnameItem = {
      id: Date.now().toString(),
      medicine,
      systemStock: medicine.stock,
      actualStock: medicine.stock, // Default to system stock
      difference: 0,
      reason: '',
    };

    setOpnameItems([...opnameItems, newItem]);
    setSelectedMedicine('');
    setSearchTerm('');
  };

  const updateActualStock = (itemId: string, actualStock: number) => {
    setOpnameItems(
      opnameItems.map((item) => {
        if (item.id === itemId) {
          const difference = actualStock - item.systemStock;
          return { ...item, actualStock, difference };
        }
        return item;
      })
    );
  };

  const updateReason = (itemId: string, reason: string) => {
    setOpnameItems(
      opnameItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, reason };
        }
        return item;
      })
    );
  };

  const removeItem = (itemId: string) => {
    setOpnameItems(opnameItems.filter((item) => item.id !== itemId));
  };

  const getDifferenceStatus = (difference: number) => {
    if (difference === 0) {
      return { icon: CheckCircle2, className: 'text-success', label: 'Sesuai' };
    } else if (difference < 0) {
      return { icon: MinusCircle, className: 'text-destructive', label: 'Kurang' };
    } else {
      return { icon: PlusCircle, className: 'text-warning', label: 'Lebih' };
    }
  };

  const totalItems = opnameItems.length;
  const matchedItems = opnameItems.filter((item) => item.difference === 0).length;
  const discrepancyItems = opnameItems.filter((item) => item.difference !== 0).length;

  const handleSaveOpname = () => {
    // Validate that all discrepancy items have reasons
    const itemsWithoutReason = opnameItems.filter(
      (item) => item.difference !== 0 && !item.reason
    );

    if (itemsWithoutReason.length > 0) {
      toast.error('Harap isi alasan untuk semua item yang memiliki selisih');
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmSaveOpname = () => {
    const opnameTransaction: OpnameTransaction = {
      id: Date.now().toString(),
      opnameNumber: generateOpnameNumber(),
      date: new Date().toISOString(),
      items: opnameItems,
      notes,
      status: 'completed',
      createdBy: 'Admin Apotek',
    };

    console.log('Saved Opname Transaction:', opnameTransaction);
    toast.success(`Stok Opname ${opnameTransaction.opnameNumber} berhasil disimpan`);

    // Reset form
    setOpnameItems([]);
    setNotes('');
    setShowConfirmDialog(false);
  };

  return (
    <Layout>
      <Header
        title="Stok Opname"
        subtitle="Pencatatan dan penyesuaian stok fisik obat"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Add Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Medicine Selection */}
          <div className="card-pharmacy">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Tambah Obat untuk Opname
            </h3>

            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama obat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input-pharmacy"
                />
              </div>

              <Select value={selectedMedicine} onValueChange={addMedicineToOpname}>
                <SelectTrigger className="w-64 input-pharmacy">
                  <SelectValue placeholder="Pilih obat" />
                </SelectTrigger>
                <SelectContent>
                  {filteredMedicines.map((medicine) => (
                    <SelectItem key={medicine.id} value={medicine.id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{medicine.name}</span>
                        <span className="text-muted-foreground text-xs ml-2">
                          Stok: {medicine.stock}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Opname Items Table */}
          <div className="card-pharmacy">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Daftar Obat Opname
              </h3>
              {opnameItems.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {totalItems} item
                </span>
              )}
            </div>

            {opnameItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ClipboardCheck className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  Belum ada obat dalam daftar opname
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Pilih obat dari dropdown di atas untuk memulai
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="table-pharmacy">
                  <thead>
                    <tr>
                      <th>Nama Obat</th>
                      <th className="text-center">Stok Sistem</th>
                      <th className="text-center">Stok Fisik</th>
                      <th className="text-center">Selisih</th>
                      <th>Alasan</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {opnameItems.map((item) => {
                      const status = getDifferenceStatus(item.difference);
                      const StatusIcon = status.icon;

                      return (
                        <tr key={item.id}>
                          <td>
                            <div>
                              <p className="font-medium">{item.medicine.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.medicine.unit}
                              </p>
                            </div>
                          </td>
                          <td className="text-center font-medium">
                            {item.systemStock}
                          </td>
                          <td className="text-center">
                            <Input
                              type="number"
                              min="0"
                              value={item.actualStock}
                              onChange={(e) =>
                                updateActualStock(
                                  item.id,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-20 text-center mx-auto input-pharmacy"
                            />
                          </td>
                          <td className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <StatusIcon
                                className={cn('h-4 w-4', status.className)}
                              />
                              <span
                                className={cn(
                                  'font-medium',
                                  item.difference > 0
                                    ? 'text-warning'
                                    : item.difference < 0
                                    ? 'text-destructive'
                                    : 'text-success'
                                )}
                              >
                                {item.difference > 0 && '+'}
                                {item.difference}
                              </span>
                            </div>
                          </td>
                          <td>
                            {item.difference !== 0 ? (
                              <Select
                                value={item.reason}
                                onValueChange={(value) =>
                                  updateReason(item.id, value)
                                }
                              >
                                <SelectTrigger className="w-36 input-pharmacy">
                                  <SelectValue placeholder="Pilih alasan" />
                                </SelectTrigger>
                                <SelectContent>
                                  {reasonOptions.map((reason) => (
                                    <SelectItem key={reason} value={reason}>
                                      {reason}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                -
                              </span>
                            )}
                          </td>
                          <td>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Notes */}
          {opnameItems.length > 0 && (
            <div className="card-pharmacy">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Catatan Opname
              </h3>
              <Textarea
                placeholder="Tambahkan catatan untuk stok opname ini..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-pharmacy min-h-[100px]"
              />
            </div>
          )}
        </div>

        {/* Right Panel - Summary */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="card-pharmacy">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Ringkasan Opname
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Total Item
                  </span>
                </div>
                <span className="font-semibold">{totalItems}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm text-muted-foreground">
                    Stok Sesuai
                  </span>
                </div>
                <span className="font-semibold text-success">{matchedItems}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-muted-foreground">
                    Ada Selisih
                  </span>
                </div>
                <span className="font-semibold text-destructive">
                  {discrepancyItems}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <Button
                className="w-full btn-primary-gradient"
                disabled={opnameItems.length === 0}
                onClick={handleSaveOpname}
              >
                <Save className="h-4 w-4 mr-2" />
                Simpan Stok Opname
              </Button>

              {opnameItems.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setOpnameItems([]);
                    setNotes('');
                  }}
                >
                  Reset Form
                </Button>
              )}
            </div>
          </div>

          {/* Info Card */}
          <div className="card-pharmacy border-primary/20 bg-primary/5">
            <div className="flex items-start gap-3">
              <ClipboardCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Panduan Opname</p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Hitung stok fisik obat secara akurat</li>
                  <li>• Isi alasan untuk setiap selisih</li>
                  <li>• Simpan opname setelah semua data lengkap</li>
                  <li>• Sistem akan menyesuaikan stok otomatis</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Simpan Stok Opname</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menyimpan hasil stok opname ini? Stok obat
              akan disesuaikan dengan hasil penghitungan fisik.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Item:</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stok Sesuai:</span>
                <span className="font-medium text-success">{matchedItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ada Selisih:</span>
                <span className="font-medium text-destructive">
                  {discrepancyItems}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Batal
            </Button>
            <Button
              className="btn-primary-gradient"
              onClick={confirmSaveOpname}
            >
              Ya, Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
