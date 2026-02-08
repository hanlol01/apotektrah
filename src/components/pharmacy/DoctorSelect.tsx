import { Doctor } from '@/types/pharmacy';
import { useDoctors, DbDoctor } from '@/hooks/useDoctors';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Stethoscope, Building, FileText, Loader2 } from 'lucide-react';

interface DoctorSelectProps {
  doctor: Partial<Doctor> | null;
  onChange: (doctor: Doctor | null) => void;
}

// Helper to convert DB doctor to app doctor type
function toAppDoctor(dbDoctor: DbDoctor): Doctor {
  return {
    id: dbDoctor.id,
    name: dbDoctor.name,
    sipNumber: dbDoctor.sip_number,
    specialization: dbDoctor.specialization,
    hospital: dbDoctor.hospital,
  };
}

export function DoctorSelect({ doctor, onChange }: DoctorSelectProps) {
  const { data: doctors, isLoading } = useDoctors();

  const handleDoctorSelect = (doctorId: string) => {
    const selectedDoctor = doctors?.find((d) => d.id === doctorId);
    onChange(selectedDoctor ? toAppDoctor(selectedDoctor) : null);
  };

  return (
    <div className="card-pharmacy">
      <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
        <Stethoscope className="h-5 w-5 text-primary" />
        Data Dokter Penulis Resep
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label className="text-sm font-medium text-foreground">Pilih Dokter</Label>
          <Select onValueChange={handleDoctorSelect} value={doctor?.id || ''} disabled={isLoading}>
            <SelectTrigger className="input-pharmacy">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memuat data dokter...</span>
                </div>
              ) : (
                <SelectValue placeholder="Pilih dokter penulis resep" />
              )}
            </SelectTrigger>
            <SelectContent>
              {doctors?.map((doc) => (
                <SelectItem key={doc.id} value={doc.id}>
                  {doc.name} - {doc.specialization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {doctor && (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  No. SIP
                </span>
              </Label>
              <Input
                value={doctor.sipNumber || ''}
                readOnly
                className="input-pharmacy bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                <span className="flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5" />
                  Instansi
                </span>
              </Label>
              <Input
                value={doctor.hospital || ''}
                readOnly
                className="input-pharmacy bg-muted"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
