import { useState } from 'react';
import { Layout } from '@/components/pharmacy/Layout';
import { Header } from '@/components/pharmacy/Header';
import { PatientForm } from '@/components/pharmacy/PatientForm';
import { DoctorSelect } from '@/components/pharmacy/DoctorSelect';
import { CompoundMedicineForm } from '@/components/pharmacy/CompoundMedicineForm';
import { TransactionSummary } from '@/components/pharmacy/TransactionSummary';
import { Patient, Doctor, CompoundPrescription } from '@/types/pharmacy';
import { toast } from 'sonner';

export default function ResepRacikan() {
  const [patient, setPatient] = useState<Partial<Patient>>({});
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [compoundPrescriptions, setCompoundPrescriptions] = useState<CompoundPrescription[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!patient.name) {
      toast.error('Mohon isi nama pasien');
      return;
    }
    if (!doctor) {
      toast.error('Mohon pilih dokter penulis resep');
      return;
    }
    if (compoundPrescriptions.length === 0) {
      toast.error('Mohon tambahkan minimal satu racikan');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const transactionNumber = `TRX-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

    toast.success(
      `Transaksi ${transactionNumber} berhasil diproses!`,
      {
        description: `Pasien: ${patient.name} - ${compoundPrescriptions.length} racikan`,
      }
    );

    // Reset form
    setPatient({});
    setDoctor(null);
    setCompoundPrescriptions([]);
    setNotes('');
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <Header
        title="Input Resep Racikan"
        subtitle="Buat transaksi penjualan obat racikan berdasarkan resep dokter"
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <PatientForm patient={patient} onChange={setPatient} />
          <DoctorSelect doctor={doctor} onChange={setDoctor} />
          <CompoundMedicineForm
            prescriptions={compoundPrescriptions}
            onPrescriptionsChange={setCompoundPrescriptions}
          />
        </div>

        <div className="col-span-1">
          <TransactionSummary
            items={[]}
            compoundPrescriptions={compoundPrescriptions}
            notes={notes}
            onNotesChange={setNotes}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </Layout>
  );
}
