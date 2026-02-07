export interface Patient {
  id: string;
  name: string;
  address: string;
  phone: string;
  birthDate: string;
}

export interface Doctor {
  id: string;
  name: string;
  sipNumber: string; // Surat Izin Praktik
  specialization: string;
  hospital: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  unit: string;
  price: number;
  stock: number;
  category: 'obat-keras' | 'obat-bebas' | 'obat-bebas-terbatas' | 'narkotika' | 'psikotropika';
}

export interface PrescriptionItem {
  id: string;
  medicine: Medicine;
  quantity: number;
  dosage: string; // e.g., "3x1 sehari"
  instructions: string; // e.g., "sesudah makan"
  subtotal: number;
}

export interface CompoundItem {
  id: string;
  medicine: Medicine;
  quantity: number;
  unit: string;
}

export interface CompoundPrescription {
  id: string;
  items: CompoundItem[];
  form: 'kapsul' | 'puyer' | 'salep' | 'sirup';
  totalAmount: number;
  dosage: string;
  instructions: string;
  serviceFee: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  transactionNumber: string;
  date: string;
  patient: Patient;
  doctor: Doctor;
  prescriptionType: 'regular' | 'compound';
  items: PrescriptionItem[];
  compoundPrescriptions: CompoundPrescription[];
  subtotal: number;
  serviceFee: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  notes: string;
}
