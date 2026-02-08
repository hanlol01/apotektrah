import { useState } from 'react';
import { Layout } from '@/components/pharmacy/Layout';
import { Header } from '@/components/pharmacy/Header';
import { PatientForm } from '@/components/pharmacy/PatientForm';
import { DoctorSelect } from '@/components/pharmacy/DoctorSelect';
import { MedicineSelector } from '@/components/pharmacy/MedicineSelector';
import { TransactionSummary } from '@/components/pharmacy/TransactionSummary';
import { Patient, Doctor, PrescriptionItem } from '@/types/pharmacy';
import { useCreatePatient } from '@/hooks/usePatients';
import { useCreateTransaction, generateTransactionNumber } from '@/hooks/useTransactions';
import { toast } from 'sonner';

export default function ResepBiasa() {
  const [patient, setPatient] = useState<Partial<Patient>>({});
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [items, setItems] = useState<PrescriptionItem[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPatient = useCreatePatient();
  const createTransaction = useCreateTransaction();

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
    if (items.length === 0) {
      toast.error('Mohon tambahkan minimal satu obat');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create or find patient
      const patientData = await createPatient.mutateAsync({
        name: patient.name,
        address: patient.address || null,
        phone: patient.phone || null,
        birth_date: patient.birthDate || null,
      });

      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      const total = subtotal;

      // Create transaction
      const transactionNumber = generateTransactionNumber();
      await createTransaction.mutateAsync({
        transaction: {
          transaction_number: transactionNumber,
          date: new Date().toISOString(),
          patient_id: patientData.id,
          doctor_id: doctor.id,
          prescription_type: 'regular',
          subtotal,
          service_fee: 0,
          total,
          payment_status: 'paid',
          notes: notes || null,
        },
        prescriptionItems: items.map((item) => ({
          medicine_id: item.medicine.id,
          quantity: item.quantity,
          dosage: item.dosage,
          instructions: item.instructions || null,
          subtotal: item.subtotal,
        })),
      });

      toast.success(
        `Transaksi ${transactionNumber} berhasil diproses!`,
        {
          description: `Pasien: ${patient.name}`,
        }
      );

      // Reset form
      setPatient({});
      setDoctor(null);
      setItems([]);
      setNotes('');
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error('Gagal memproses transaksi. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Header
        title="Input Resep Biasa"
        subtitle="Buat transaksi penjualan obat berdasarkan resep dokter"
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <PatientForm patient={patient} onChange={setPatient} />
          <DoctorSelect doctor={doctor} onChange={setDoctor} />
          <MedicineSelector items={items} onItemsChange={setItems} />
        </div>

        <div className="col-span-1">
          <TransactionSummary
            items={items}
            compoundPrescriptions={[]}
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
