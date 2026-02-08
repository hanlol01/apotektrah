import { useState } from 'react';
import { Layout } from '@/components/pharmacy/Layout';
import { Header } from '@/components/pharmacy/Header';
import { PatientForm } from '@/components/pharmacy/PatientForm';
import { DoctorSelect } from '@/components/pharmacy/DoctorSelect';
import { CompoundMedicineForm } from '@/components/pharmacy/CompoundMedicineForm';
import { TransactionSummary } from '@/components/pharmacy/TransactionSummary';
import { Patient, Doctor, CompoundPrescription } from '@/types/pharmacy';
import { useCreatePatient } from '@/hooks/usePatients';
import { useCreateTransaction, generateTransactionNumber } from '@/hooks/useTransactions';
import { toast } from 'sonner';

export default function ResepRacikan() {
  const [patient, setPatient] = useState<Partial<Patient>>({});
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [compoundPrescriptions, setCompoundPrescriptions] = useState<CompoundPrescription[]>([]);
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
    if (compoundPrescriptions.length === 0) {
      toast.error('Mohon tambahkan minimal satu racikan');
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
      const subtotal = compoundPrescriptions.reduce((sum, p) => sum + p.subtotal, 0);
      const serviceFee = compoundPrescriptions.reduce((sum, p) => sum + p.serviceFee, 0);
      const total = subtotal;

      // Create transaction
      const transactionNumber = generateTransactionNumber();
      await createTransaction.mutateAsync({
        transaction: {
          transaction_number: transactionNumber,
          date: new Date().toISOString(),
          patient_id: patientData.id,
          doctor_id: doctor.id,
          prescription_type: 'compound',
          subtotal,
          service_fee: serviceFee,
          total,
          payment_status: 'paid',
          notes: notes || null,
        },
        compoundPrescriptions: compoundPrescriptions.map((cp) => ({
          prescription: {
            form: cp.form,
            total_amount: cp.totalAmount,
            dosage: cp.dosage,
            instructions: cp.instructions || null,
            service_fee: cp.serviceFee,
            subtotal: cp.subtotal,
          },
          items: cp.items.map((item) => ({
            medicine_id: item.medicine.id,
            quantity: item.quantity,
            unit: item.unit,
          })),
        })),
      });

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
